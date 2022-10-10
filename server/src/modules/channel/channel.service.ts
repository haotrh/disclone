import { EntityRepository, MikroORM, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ModifyChannelPositionsDto } from './dto/modify-channel-positions.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel, ChannelType } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: EntityRepository<Channel>,
    private orm: MikroORM,
  ) {}

  getChannel(channelId: string) {
    return this.channelRepository.findOneOrFail(channelId, {
      populate: ['server'],
    });
  }

  createDefaultChannels() {
    const textChannelCategory = this.channelRepository.create({
      name: 'TEXT CHANNELS',
      type: ChannelType.SERVER_CATEGORY,
      position: 0,
    });

    const generalTextChannel = this.channelRepository.create({
      name: 'general',
      type: ChannelType.SERVER_TEXT,
      parent: textChannelCategory,
      position: 0,
    });

    const voiceChannelCategory = this.channelRepository.create({
      name: 'VOICE CHANNELS',
      type: ChannelType.SERVER_CATEGORY,
      position: 1,
    });

    const generalVoiceChannel = this.channelRepository.create({
      name: 'general',
      type: ChannelType.SERVER_VOICE,
      parent: voiceChannelCategory,
      position: 1,
    });

    return [
      textChannelCategory,
      generalTextChannel,
      voiceChannelCategory,
      generalVoiceChannel,
    ];
  }

  async createChannel(
    { name, parentId, type }: CreateChannelDto,
    serverId?: string,
  ) {
    const channel = this.channelRepository.create({
      name,
      type,
    });

    if (serverId) {
      const count = await this.channelRepository.count({
        server: serverId,
        type,
      });
      this.channelRepository.assign(channel, {
        position: count,
        server: serverId,
      });
    }

    if (parentId) {
      const parent = await this.channelRepository.findOneOrFail(parentId);
      this.channelRepository.assign(channel, { parent });
    }

    await this.channelRepository.persistAndFlush(channel);

    return channel;
  }

  async modifyChannelPositions(
    modifyChannelPositionsDtos: ModifyChannelPositionsDto[],
  ) {
    const channels = await this.channelRepository.find(
      modifyChannelPositionsDtos.map((channel) => channel.id),
      { populate: ['server'] },
    );

    const modifyChannelMap = _.keyBy(
      modifyChannelPositionsDtos,
      (channel) => channel.id,
    );

    channels.forEach((channel) => {
      wrap(channel).assign(modifyChannelMap[channel.id], {
        em: this.orm.em,
        merge: true,
      });
    });

    await this.channelRepository.flush();

    return channels;
  }

  async updateChannel(updateChannelDto: UpdateChannelDto, channelId: string) {
    const channel = await this.channelRepository.findOneOrFail(channelId);
    this.channelRepository.assign(channel, updateChannelDto);
    await this.channelRepository.flush();
    return channel;
  }

  async deleteChannel(channelId: string) {
    const channel = await this.channelRepository.findOneOrFail(channelId);
    await this.channelRepository.removeAndFlush(channel);
    return channel;
  }
}
