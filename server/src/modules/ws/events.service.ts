import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ExtendedSocket } from 'src/types/socket-io.types';
import { ServerService } from '../server/server.service';
import { myUserFields, UserStatus } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class EventsService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ServerService))
    private serverService: ServerService,
    private readonly orm: MikroORM,
  ) {}

  @UseRequestContext()
  async ready(
    userId: string,
    socket: ExtendedSocket,
    emitPresenceUpdate?: (status: UserStatus) => Promise<void>,
  ) {
    const user = await this.userService.findOne(userId, myUserFields);
    const settings = await this.userService.getUserSettings(userId);
    const servers = await this.serverService.getUserServers(userId);
    if (user.status !== settings.status && emitPresenceUpdate) {
      this.userService.update(userId, { status: settings.status });
      emitPresenceUpdate(settings.status);
    }
    const readState = await this.userService.getUserReadStates(userId);
    const relationships = await this.userService.getRelationships(userId);
    const dmChannels = await this.userService.getDmChannels(userId);
    socket.emit('READY', {
      user,
      servers,
      settings,
      readState,
      relationships,
      dmChannels,
    });
    socket.userId = userId;
  }

  @UseRequestContext()
  setOffline(userId: string) {
    return this.userService.update(userId, { status: 'offline' });
  }
}
