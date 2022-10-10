import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { forwardRef, Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import _ from 'lodash';
import { Server } from 'socket.io';
import { ExtendedSocket } from 'src/types/socket-io.types';
import { WSResponse, WSResponseEvent } from 'src/types/ws.types';
import { TokenService } from '../auth/token.service';
import { ServerService } from '../server/server.service';
import { myUserFields, UserStatus } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private tokenService: TokenService,
    private serverService: ServerService,
    private readonly orm: MikroORM,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  //user socketid mapping
  private userSocketIds = new Map<string, string[]>();

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: ExtendedSocket) {
    try {
      const token = socket.handshake?.query?.token as string;
      if (!token) {
        throw new WsException('Token not found');
      }
      try {
        const payload = this.tokenService.verifyJwtToken(token);
        const userId = payload.sub;
        if (this.userSocketIds.has(userId)) {
          await this.emitReady(userId, socket);
          this.userSocketIds.set(userId, [
            ...this.userSocketIds.get(userId),
            socket.id,
          ]);
        } else {
          //SEND "READY" EVENT
          await this.emitReady(userId, socket, async (status: UserStatus) => {
            this.emitPresenceUpdate(userId, status);
          });
          this.userSocketIds.set(userId, [socket.id]);
        }
      } catch (e: any) {
        throw new WsException(e.message);
      }
    } catch (error: any) {
      this.emitError(socket.id, error);
      socket.disconnect(true);
    }
  }

  async handleDisconnect(socket: ExtendedSocket) {
    const userId = socket.userId;
    const socketIds = this.userSocketIds.get(userId);

    if (socketIds) {
      if (socketIds.length === 1 && socketIds[0] === socket.id) {
        this.userSocketIds.delete(userId);
        await this.userService.update(userId, { status: 'offline' });
        const userServerIds = await this.getUserServerIds(userId);
        this.emitUserUpdate(userServerIds, { id: userId, status: 'offline' });
      } else {
        this.userSocketIds.set(
          userId,
          socketIds.filter((socketId) => socketId !== socket.id),
        );
      }
    }
  }

  getClientSocketIds(clientId: string) {
    return this.userSocketIds.get(clientId);
  }

  getSocketById(socketId: string) {
    return this.server.sockets.sockets.get(socketId);
  }

  @UseRequestContext()
  async getMemberSocketIds(serverId: string) {
    const members = await this.serverService.getMembers(serverId);
    return _.flatten(
      _.compact(
        members
          .toArray()
          .map((member) => this.getClientSocketIds(member.user.id)),
      ),
    );
  }

  @UseRequestContext()
  async getUserServerIds(userId: string) {
    return (await this.serverService.getUserServers(userId)).map(
      (server) => server.id,
    );
  }

  joinRoom(userId: string, room: string) {
    const socketIds = this.getClientSocketIds(userId);

    if (socketIds) {
      socketIds.forEach((socketId) => this.getSocketById(socketId)?.join(room));
    }
  }

  private emit(to: string | string[], event: WSResponseEvent, data: any) {
    this.server.to(to).emit(event, data);
  }

  async emitReady(
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

  emitError(to: string | string[], data: WSResponse['ERROR']) {
    this.emit(to, 'ERROR', data);
  }

  emitDmChannelCreate(userId: string, data: WSResponse['CHANNEL_CREATE']) {
    const userSocketIds = this.getClientSocketIds(userId);
    this.emit(userSocketIds, 'CHANNEL_CREATE', data);
  }

  emitDmChannelDelete(userId: string, data: WSResponse['CHANNEL_DELETE']) {
    const userSocketIds = this.getClientSocketIds(userId);
    this.emit(userSocketIds, 'CHANNEL_DELETE', data);
  }

  emitChannelCreate(serverId: string, data: WSResponse['CHANNEL_CREATE']) {
    this.emit(serverId, 'CHANNEL_CREATE', data);
  }

  emitChannelUpdate(serverId: string, data: WSResponse['CHANNEL_UPDATE']) {
    this.emit(serverId, 'CHANNEL_UPDATE', data);
  }

  emitChannelDelete(serverId: string, data: WSResponse['CHANNEL_DELETE']) {
    this.emit(serverId, 'CHANNEL_DELETE', data);
  }

  emitServerCreate(userId: string, data: WSResponse['SERVER_CREATE']) {
    const userSocketIds = this.getClientSocketIds(userId);
    this.emit(userSocketIds, 'SERVER_CREATE', data);
    this.joinRoom(userId, data.id);
  }

  async emitServerUpdate(serverId: string, data: WSResponse['SERVER_UPDATE']) {
    const socketIds = await this.getMemberSocketIds(serverId);
    this.emit(socketIds, 'SERVER_UPDATE', data);
  }

  async emitServerDelete(serverId: string, data: WSResponse['SERVER_DELETE']) {
    const socketIds = await this.getMemberSocketIds(serverId);
    this.emit(socketIds, 'SERVER_DELETE', data);
  }

  emitMemberAdd(serverId: string, data: WSResponse['SERVER_MEMBER_ADD']) {
    this.emit(serverId, 'SERVER_MEMBER_ADD', data);
  }

  emitMemberRemove(serverId: string, data: WSResponse['SERVER_MEMBER_REMOVE']) {
    this.emit(serverId, 'SERVER_MEMBER_REMOVE', data);
  }

  emitMemberUpdate(serverId: string, data: WSResponse['SERVER_MEMBER_UPDATE']) {
    this.emit(serverId, 'SERVER_MEMBER_UPDATE', data);
  }

  emitMemberRoleAdd(
    serverId: string,
    data: WSResponse['SERVER_MEMBER_ROLE_ADD'],
  ) {
    this.emit(serverId, 'SERVER_MEMBER_ROLE_ADD', data);
  }

  emitMemberRoleRemove(
    serverId: string,
    data: WSResponse['SERVER_MEMBER_ROLE_REMOVE'],
  ) {
    this.emit(serverId, 'SERVER_MEMBER_ROLE_REMOVE', data);
  }

  emitServerRoleCreate(
    serverId: string,
    data: WSResponse['SERVER_ROLE_CREATE'],
  ) {
    this.emit(serverId, 'SERVER_ROLE_CREATE', data);
  }

  emitServerRoleUpdate(
    serverId: string,
    data: WSResponse['SERVER_ROLE_UPDATE'],
  ) {
    this.emit(serverId, 'SERVER_ROLE_UPDATE', data);
  }

  emitServerRoleDelete(
    serverId: string,
    data: WSResponse['SERVER_ROLE_DELETE'],
  ) {
    this.emit(serverId, 'SERVER_ROLE_DELETE', data);
  }

  emitMessageCreate(channelId: string, data: WSResponse['MESSAGE_CREATE']) {
    this.emit(channelId, 'MESSAGE_CREATE', data);
  }

  emitMessageDelete(channelId: string, data: WSResponse['MESSAGE_DELETE']) {
    this.emit(channelId, 'MESSAGE_DELETE', data);
  }

  emitMessageUpdate(channelId: string, data: WSResponse['MESSAGE_UPDATE']) {
    this.emit(channelId, 'MESSAGE_UPDATE', data);
  }

  async emitEmojiCreate(serverId: string, data: WSResponse['EMOJI_CREATE']) {
    const socketIds = await this.getMemberSocketIds(serverId);
    this.emit(socketIds, 'EMOJI_CREATE', data);
  }

  async emitEmojiUpdate(serverId: string, data: WSResponse['EMOJI_UPDATE']) {
    const socketIds = await this.getMemberSocketIds(serverId);
    this.emit(socketIds, 'EMOJI_UPDATE', data);
  }

  async emitEmojiDelete(serverId: string, data: WSResponse['EMOJI_DELETE']) {
    const socketIds = await this.getMemberSocketIds(serverId);
    this.emit(socketIds, 'EMOJI_DELETE', data);
  }

  emitPinUpdate(channelId: string, data: WSResponse['MESSAGE_UPDATE']) {
    this.emit(channelId, 'MESSAGE_UPDATE', data);
  }

  emitUserUpdate(to: string | string[], data: WSResponse['USER_UPDATE']) {
    this.emit(to, 'USER_UPDATE', data);
  }

  emitUserSettingsUpdate(
    userId: string,
    data: WSResponse['USER_SETTINGS_UPDATE'],
  ) {
    const userSocketIds = this.getClientSocketIds(userId);
    this.emit(userSocketIds, 'USER_SETTINGS_UPDATE', data);
  }

  emitRelationshipAdd(userId: string, data: WSResponse['RELATIONSHIP_ADD']) {
    const userSocketIds = this.getClientSocketIds(userId);
    this.emit(userSocketIds, 'RELATIONSHIP_ADD', data);
  }

  emitRelationshipRemove(
    userId: string,
    data: WSResponse['RELATIONSHIP_REMOVE'],
  ) {
    const userSocketIds = this.getClientSocketIds(userId);
    this.emit(userSocketIds, 'RELATIONSHIP_REMOVE', data);
  }

  emitTyping(channelId: string, data: WSResponse['TYPING']) {
    this.emit(channelId, 'TYPING', data);
  }

  async emitPresenceUpdate(userId: string, status: UserStatus) {
    const userServerIds = await this.getUserServerIds(userId);
    this.emitUserUpdate(userServerIds, {
      id: userId,
      status,
    });
  }
}
