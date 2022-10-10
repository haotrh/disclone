import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import fs from 'fs';
import imageSize from 'image-size';
import _ from 'lodash';
import { uuid } from 'short-uuid';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Permissions } from 'src/types/permissions.types';
import FilePath from 'src/utils/file-path.util';
import { isSystemMessage } from 'src/utils/message.util';
import {
  CUSTOM_EMOJI_REGEX,
  LINK_REGEX,
  MENTION_REGEX,
} from 'src/utils/regex.util';
import { CrawlService } from '../crawl/crawl.service';
import { Emoji } from '../emoji/entities/emoji.entity';
import { FileService } from '../file/file.service';
import { PermissionsService } from '../permissions/permissions.service';
import { Member } from '../server/entities/member.entity';
import { User } from '../user/entities/user.entity';
import { EventsGateway } from '../events/events.gateway';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Channel, ChannelType } from './entities/channel.entity';
import { Message, MessageType } from './entities/message.entity';
import { ReadState } from './entities/readState.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: EntityRepository<Channel>,
    @InjectRepository(Message)
    private messageRepository: EntityRepository<Message>,
    @InjectRepository(ReadState)
    private readStateRepository: EntityRepository<ReadState>,
    @InjectRepository(Emoji)
    private emojiRepository: EntityRepository<Emoji>,
    @InjectRepository(Member)
    private memberRepository: EntityRepository<Member>,
    private permissionsService: PermissionsService,
    private fileService: FileService,
    private crawlService: CrawlService,
    private eventsGateway: EventsGateway,
  ) {}

  private async getReadState(channelId: string, userId: string) {
    let readState = await this.readStateRepository.findOne({
      id: channelId,
      user: userId,
    });
    if (readState) return readState;
    readState = this.readStateRepository.create({
      id: channelId,
      user: userId,
    });
    await this.readStateRepository.flush();
    return readState;
  }

  private async updateReadStateLastMessage(
    channelId: string,
    userId: string,
    message: Message,
  ) {
    const readState = await this.getReadState(channelId, userId);
    if (readState.lastMessage?.id !== message?.id) {
      this.readStateRepository.assign(readState, {
        lastMessage: message,
      });
      await this.readStateRepository.flush();
    }
  }

  private getMessagesAfter = async (
    channelId: string,
    messageId: string,
    limit: number,
  ) => {
    return this.messageRepository.find(
      { id: { $gt: messageId }, channel: channelId },
      { limit, orderBy: [{ createdAt: 1 }] },
    );
  };

  private getMessagesBefore = async (
    channelId: string,
    messageId: string,
    limit: number,
  ) => {
    return await this.messageRepository.find(
      { id: { $lt: messageId }, channel: channelId },
      { limit, orderBy: [{ createdAt: -1 }] },
    );
  };

  private getMessagesAround = async (
    channelId: string,
    messageId: string,
    limit: number,
  ) => {
    const afterMessage = await this.messageRepository.find(
      { id: { $gt: messageId }, channel: channelId },
      { limit: Math.floor(limit / 2), orderBy: [{ createdAt: 1 }] },
    );
    const beforeMessage = await this.messageRepository.find(
      { id: { $lt: messageId }, channel: channelId },
      { limit: Math.floor(limit / 2), orderBy: [{ createdAt: -1 }] },
    );

    return _.merge(beforeMessage, afterMessage);
  };

  async getMessages(
    channelId: string,
    { limit = 20, after, around, before }: PaginationQueryDto,
    user: User,
  ) {
    let messages: Message[] = [];

    if (after) {
      messages = await this.getMessagesAfter(channelId, after, limit);
    } else if (around) {
      messages = await this.getMessagesAround(channelId, around, limit);
    } else if (before) {
      messages = await this.getMessagesBefore(channelId, before, limit);
    } else {
      messages = await this.messageRepository.find(
        { channel: channelId },
        { limit, orderBy: [{ createdAt: -1 }] },
      );
    }

    await this.updateReadStateLastMessage(channelId, user.id, _.last(messages));
    return messages;
  }

  async messageContentParse(
    user: User,
    message: Message,
    parseContent: string,
  ) {
    let match: RegExpExecArray | null = null;
    let content = parseContent;
    const channel = message.channel;
    message.mentionEveryone = false;
    // Custom emoji parse
    const customEmojiRegex = new RegExp(CUSTOM_EMOJI_REGEX.source, 'g');
    while ((match = customEmojiRegex.exec(content)) !== null) {
      const charArr = content.split('');
      const fullText = match[0];
      let replaceString = match[0];
      const id = match[2];
      const emoji = await this.emojiRepository.findOne(id);
      const member =
        emoji &&
        (await this.memberRepository.findOne({
          user,
          server: emoji?.server,
        }));
      if (emoji && member) {
        replaceString = `<:${emoji.name.replace(/[^0-9a-zA-Z]+/, '')}:${
          emoji.id
        }>`;
      } else {
        replaceString = `:${match[1].replace(/[^0-9a-zA-Z]+/, '')}:`;
      }
      if (replaceString !== fullText) {
        const distance = replaceString.length - fullText.length;
        customEmojiRegex.lastIndex += distance;
        charArr.splice(match.index, fullText.length, replaceString);
        content = charArr.join('');
      }
    }
    // Mention parse
    const mentionIds: string[] = [];
    const mentionRegex = new RegExp(MENTION_REGEX.source, 'g');
    while ((match = mentionRegex.exec(content)) !== null) {
      const isEveryone = match[1];
      if (isEveryone) {
        if (
          !message.mentionEveryone &&
          this.permissionsService.hasServerPermission(
            Permissions.MENTION_EVERYONE,
            user,
            channel.server.id,
          )
        ) {
          this.messageRepository.assign(message, { mentionEveryone: true });
        }
      } else {
        const userId = match[2];
        mentionIds.push(userId);
      }
    }
    if (!_.isEmpty(mentionIds)) {
      const members = await this.memberRepository.find(
        {
          user: mentionIds,
          server: channel.server,
        },
        { populate: ['user'] },
      );
      if (!_.isEmpty(members)) {
        message.mentions.add(...members.map((member) => member.user));
      }
    }
    //Link embed parse
    const linkRegex = new RegExp(LINK_REGEX.source, 'g');
    message.embeds = [];
    while ((match = linkRegex.exec(content))) {
      try {
        const url = match[0];
        const embed = await this.crawlService.getEmbedFromSite(url);
        message.embeds.push(embed);
      } catch {}
    }
    this.messageRepository.assign(message, { content });
    return;
  }

  async sendMessage(
    user: User,
    channelId: string,
    files: Array<Express.Multer.File>,
    { content, nonce, attachments }: CreateMessageDto,
  ) {
    const channel = await this.channelRepository.findOneOrFail(channelId);

    const message = this.messageRepository.create({
      channel,
      author: user,
    });

    if (content) {
      await this.messageContentParse(user, message, content);
    }

    if (files) {
      const responses = await Promise.all(
        _.values(files).map(async (file, index) => {
          const attachment = attachments.find(
            (attachment) => attachment.id === index,
          );
          if (attachment) {
            const id = uuid();
            const imagePath = `attachments/${id}/${attachment.fileName}` ?? '';
            let url = await this.fileService.uploadToS3(
              imagePath,
              fs.readFileSync(file.path),
            );
            let width: number | undefined, height: number | undefined;
            if (file.mimetype.includes('image')) {
              const dimensions = imageSize(file.path);
              width = dimensions.width;
              height = dimensions.height;
              url = FilePath.imageKitFilePath(imagePath);
            }
            fs.unlinkSync(file.path);
            return {
              id,
              fileName: attachment.fileName,
              description: attachment.description,
              contentType: file.mimetype,
              url,
              width,
              spoiler: attachment.spoiler,
              height,
              size: file.size,
            };
          }
        }),
      );
      this.messageRepository.assign(message, {
        attachments: _.compact(responses),
      });
    }
    this.channelRepository.assign(channel, { lastMessage: message });
    let broadcastChannelCreated = false;
    if (channel.type === ChannelType.DM && !channel.show.contains(user)) {
      channel.show.add(user);
      broadcastChannelCreated = true;
    }
    await this.channelRepository.persistAndFlush(channel);
    await this.updateReadStateLastMessage(channel.id, user.id, message);
    broadcastChannelCreated &&
      this.eventsGateway.emitDmChannelCreate(user.id, channel);
    message.nonce = nonce;
    return message;
  }

  async updateMessage(
    user: User,
    updateMessageDto: UpdateMessageDto,
    messageId: string,
  ) {
    const message = await this.messageRepository.findOneOrFail(messageId, {
      populate: ['channel'],
    });
    this.messageRepository.assign(message, updateMessageDto);
    if (updateMessageDto.content) {
      await this.messageContentParse(user, message, updateMessageDto.content);
    }
    message.updatedAt = new Date();
    await this.messageRepository.flush();
    return message;
  }

  async deleteMessage(messageId: string) {
    const message = await this.messageRepository.findOneOrFail(messageId);
    await this.messageRepository.removeAndFlush(message);
    return message;
  }

  async getPinned(channelId: string, userId: string) {
    const channel = await this.channelRepository.findOneOrFail(channelId);
    const readState = await this.getReadState(channelId, userId);
    const messages = await this.messageRepository.find({
      channel: channelId,
      pinned: true,
    });

    if (channel.lastPinTimestamp > readState.lastPinTimestamp) {
      this.readStateRepository.assign(readState, {
        lastPinTimestamp: new Date(),
      });
      await this.readStateRepository.flush();
    }

    return messages;
  }

  async pinMessage(channelId: string, messageId: string, user: User) {
    const channel = await this.channelRepository.findOneOrFail(channelId);
    const message = await this.messageRepository.findOneOrFail(
      {
        channel: channelId,
        id: messageId,
      },
      { populate: ['author'] },
    );
    if (message.pinned) {
      throw new BadRequestException('Message is already pinned!');
    }
    if (isSystemMessage(message)) {
      throw new BadRequestException('The message cannot be pinned!');
    }
    this.messageRepository.assign(message, { pinned: true });
    const pinMessage = this.messageRepository.create({
      type: MessageType.CHANNEL_PINNED_MESSAGE,
      author: user,
      channel: channelId,
      referencedMessage: message,
    });
    channel.lastPinTimestamp = pinMessage.createdAt;
    await this.messageRepository.persistAndFlush(pinMessage);
    this.eventsGateway.emitMessageUpdate(channelId, message);
    this.eventsGateway.emitMessageCreate(channelId, pinMessage);
    this.eventsGateway.emitChannelUpdate(pinMessage.channel.server.id, {
      id: channelId,
      lastPinTimestamp: pinMessage.createdAt,
    });
    return pinMessage;
  }

  async unpinMessage(channelId: string, messageId: string) {
    const message = await this.messageRepository.findOneOrFail(
      {
        channel: channelId,
        id: messageId,
      },
      { populate: ['author'] },
    );
    if (!message.pinned) {
      throw new BadRequestException('Message is not pinned!');
    }
    this.messageRepository.assign(message, { pinned: false });
    await this.messageRepository.flush();
    this.eventsGateway.emitMessageUpdate(channelId, message);
    return;
  }
}
