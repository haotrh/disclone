import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import ObjectID from 'bson-objectid';
import ImageService from '../file/image.service';
import { Server } from '../server/entities/server.entity';
import { User } from '../user/entities/user.entity';
import { CreateEmojiDto } from './dtos/create-emoji.dto';
import { ModifyEmojiDto } from './dtos/modify-emoji.dto';
import { Emoji } from './entities/emoji.entity';

@Injectable()
export class EmojiService {
  constructor(
    @InjectRepository(Emoji) private emojiRepository: EntityRepository<Emoji>,
    @InjectRepository(Server)
    private serverRepository: EntityRepository<Server>,
    private imageService: ImageService,
    private orm: MikroORM,
  ) {}

  listServerEmojis(serverId: string) {
    return this.emojiRepository.find(
      { server: serverId },
      { populate: ['user'] },
    );
  }

  getServerEmoji(serverId: string, emojiId: string) {
    return this.emojiRepository.findOneOrFail({
      server: serverId,
      id: emojiId,
    });
  }

  async createEmoji(
    serverId: string,
    createEmojiDto: CreateEmojiDto,
    user: User,
  ) {
    const id = new ObjectID();
    createEmojiDto.image = await this.imageService.uploadEmoji(
      createEmojiDto.image,
      id.toHexString(),
    );

    const emoji = this.emojiRepository.create({
      _id: id,
      server: serverId,
      user,
      ...createEmojiDto,
    });
    await this.emojiRepository.persistAndFlush(emoji);
    return emoji;
  }

  async modifyEmoji(id: string, modifyEmojiDto: ModifyEmojiDto) {
    const emoji = await this.emojiRepository.findOneOrFail(id);
    this.emojiRepository.assign(emoji, modifyEmojiDto);
    await this.emojiRepository.flush();
    return emoji;
  }

  async deleteEmoji(id: string) {
    const emoji = await this.emojiRepository.findOneOrFail(id);
    await this.emojiRepository.removeAndFlush(emoji);
    return emoji;
  }
}
