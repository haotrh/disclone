import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Channel, ChannelType } from '../channel/entities/channel.entity';
import { EventsGateway } from '../ws/events.gateway';
import { User } from './entities/user.entity';

@Injectable()
export class DmChannelService {
  constructor(
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    @InjectRepository(Channel)
    private channelRepository: EntityRepository<Channel>,
    private eventsGateway: EventsGateway,
  ) {}

  async createDmChannel(user: User, recipientId: string) {
    const recipient = await this.userRepository.findOneOrFail(recipientId);
    let channel: Channel = await this.channelRepository.findOne(
      {
        $and: [{ recipients: [user] }, { recipients: [recipient] }],
      },
      { populate: ['recipients'] },
    );
    if (channel) {
      channel.show.add(user);
    } else {
      channel = this.channelRepository.create({
        recipients: [user, recipient],
        show: [user],
        type: ChannelType.DM,
      });
    }
    await this.channelRepository.persistAndFlush(channel);
    this.eventsGateway.emitDmChannelCreate(user.id, channel);
    return channel;
  }

  async removeDmChannel(user: User, channelId: string) {
    const channel = await this.channelRepository.findOneOrFail(channelId);
    channel.show?.remove(user);
    await this.channelRepository.persistAndFlush(channel);
    this.eventsGateway.emitDmChannelDelete(user.id, { id: channelId });
    return channel;
  }
}
