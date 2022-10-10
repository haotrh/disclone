import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Permissions } from 'src/types/permissions.types';
import { ChannelService } from '../channel/channel.service';
import { CreateChannelDto } from '../channel/dto/create-channel.dto';
import { ModifyChannelPositionsDto } from '../channel/dto/modify-channel-positions.dto';
import { Permission } from '../permissions/permission.decorator';
import { User } from '../user/entities/user.entity';
import { EventsGateway } from '../events/events.gateway';
import { AddRoleMembersDto } from './dto/add-role-members.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { CreateServerDto } from './dto/create-server.dto';
import { JoinServerDto } from './dto/join-server.dto';
import { ModifyRolePositionsDto } from './dto/modify-channel-positions.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { InviteService } from './invite.service';
import { ServerService } from './server.service';

@ApiTags('servers')
@ApiBearerAuth()
@Controller('servers')
export class ServerController {
  constructor(
    private serverService: ServerService,
    private inviteService: InviteService,
    private channelService: ChannelService,
    private eventsGateway: EventsGateway,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createServerDto: CreateServerDto,
  ) {
    const server = await this.serverService.create(user, createServerDto);
    this.eventsGateway.emitServerCreate(user.id, server);
    return server;
  }

  @Delete(':serverId')
  async delete(@CurrentUser() user: User, @Param('serverId') serverId: string) {
    await this.eventsGateway.emitServerDelete(serverId, { id: serverId });
    await this.serverService.delete(user, serverId);
    return;
  }

  @Patch(':serverId')
  @Permission(Permissions.MANAGE_SERVER)
  async update(
    @CurrentUser() user: User,
    @Param('serverId') serverId: string,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    const server = await this.serverService.update(
      user,
      serverId,
      updateServerDto,
    );
    this.eventsGateway.emitServerUpdate(serverId, server);
    return server;
  }

  @Get(':serverId/members')
  getMembers(@CurrentUser() user: User, @Param('serverId') serverId: string) {
    this.eventsGateway.joinRoom(user.id, serverId);
    return this.serverService.getMembers(serverId);
  }

  @Post(':serverId/invites')
  @Permission(Permissions.CREATE_INVITE)
  createInvite(
    @CurrentUser() user: User,
    @Param('serverId') serverId: string,
    @Body() createInviteDto: CreateInviteDto,
  ) {
    return this.inviteService.createInvite(user, serverId, createInviteDto);
  }

  @Post(':serverId/channels')
  @Permission(Permissions.MANAGE_CHANNELS)
  async createServerChannel(
    @Body() createChannelDto: CreateChannelDto,
    @Param('serverId') serverId: string,
  ) {
    const channel = await this.channelService.createChannel(
      createChannelDto,
      serverId,
    );
    this.eventsGateway.emitChannelCreate(serverId, channel);
    return channel;
  }

  @Patch(':serverId/channels')
  @Permission(Permissions.MANAGE_CHANNELS)
  async modifyServerChannelPositions(
    @Body(new ParseArrayPipe({ items: ModifyChannelPositionsDto }))
    modifyChannelPositionsDtos: ModifyChannelPositionsDto[],
    @Param('serverId') serverId: string,
  ) {
    const channels = await this.channelService.modifyChannelPositions(
      modifyChannelPositionsDtos,
    );

    channels.map((channel) => {
      this.eventsGateway.emitChannelUpdate(serverId, channel);
    });
    return;
  }

  @Put(':serverId/members/@me')
  @HttpCode(204)
  async joinServer(
    @Body() { inviteCode }: JoinServerDto,
    @Param('serverId') serverId: string,
    @CurrentUser() user: User,
  ) {
    const member = await this.serverService.joinServer(
      inviteCode,
      user,
      serverId,
    );
    this.eventsGateway.emitMemberAdd(serverId, { member, serverId });
    return;
  }

  @Patch(':serverId/members/@me')
  async modifyCurrentMember(
    @Body() updateMemberDto: UpdateMemberDto,
    @CurrentUser() user: User,
    @Param('serverId') serverId: string,
  ) {
    const member = await this.serverService.updateMember(
      updateMemberDto,
      user,
      serverId,
    );
    this.eventsGateway.emitMemberUpdate(serverId, {
      member,
      serverId,
      userId: user.id,
    });
    return member;
  }

  @Patch(':serverId/members/:userId')
  @Permission(Permissions.MANAGE_NICKNAMES)
  async modifyMember(
    @Body() updateMemberDto: UpdateMemberDto,
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
  ) {
    const member = await this.serverService.updateMember(
      updateMemberDto,
      userId,
      serverId,
    );
    this.eventsGateway.emitMemberUpdate(serverId, { member, serverId, userId });
    return member;
  }

  @Put(':serverId/members/:userId/roles/:roleId')
  async addMemberRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
  ) {
    await this.serverService.addMemberRole(userId, serverId, roleId);
    this.eventsGateway.emitMemberRoleAdd(serverId, {
      userId,
      serverId,
      roleId,
    });
  }

  @Patch(':serverId/roles/:roleId/members')
  @Permission(Permissions.MANAGE_ROLES)
  async addRoleMembers(
    @Body() { memberIds }: AddRoleMembersDto,
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
  ) {
    const members = await this.serverService.addRoleMembers(
      memberIds,
      serverId,
      roleId,
    );
    members.forEach((member) => {
      this.eventsGateway.emitMemberRoleAdd(serverId, {
        userId: member.user.id,
        serverId,
        roleId,
      });
    });
    return;
  }

  @Delete(':serverId/members/:userId/roles/:roleId')
  async removeMemberRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @Param('serverId') serverId: string,
  ) {
    await this.serverService.removeMemberRole(userId, serverId, roleId);
    this.eventsGateway.emitMemberRoleRemove(serverId, {
      userId,
      serverId,
      roleId,
    });
  }

  @Delete(':serverId/members/:userId')
  async removeMember(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
  ) {
    await this.serverService.removeMember(userId, serverId);
    this.eventsGateway.emitMemberRemove(serverId, {
      id: userId,
      serverId,
    });
  }

  @Post(':serverId/roles')
  @Permission(Permissions.MANAGE_ROLES)
  async createServerRole(@Param('serverId') serverId: string) {
    const role = await this.serverService.createRole(serverId);
    this.eventsGateway.emitServerRoleCreate(serverId, { role, serverId });
    return role;
  }

  @Patch(':serverId/roles')
  @Permission(Permissions.MANAGE_ROLES)
  async modifyServerRolePositions(
    @Body(new ParseArrayPipe({ items: ModifyRolePositionsDto }))
    modifyRolePositionsDto: ModifyRolePositionsDto[],
    @Param('serverId') serverId: string,
  ) {
    const roles = await this.serverService.modifyRolePositions(
      modifyRolePositionsDto,
    );

    roles.map((role) => {
      this.eventsGateway.emitServerRoleUpdate(serverId, role);
    });
    return;
  }

  @Patch(':serverId/roles/:roleId')
  @Permission(Permissions.MANAGE_ROLES)
  async modifyServerRole(
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('serverId') serverId: string,
    @Param('roleId') roleId: string,
  ) {
    const role = await this.serverService.updateRole(
      updateRoleDto,
      roleId,
      serverId,
    );
    this.eventsGateway.emitServerRoleUpdate(serverId, role);
    return role;
  }

  @Delete(':serverId/roles/:roleId')
  @Permission(Permissions.MANAGE_ROLES)
  async deleteServerRole(
    @Param('serverId') serverId: string,
    @Param('roleId') roleId: string,
  ) {
    const role = await this.serverService.deleteRole(roleId, serverId);
    this.eventsGateway.emitServerRoleDelete(serverId, {
      id: role.id,
      serverId,
    });
    return;
  }

  @Get(':serverId/invites')
  async getServerInvites(@Param('serverId') serverId: string) {
    return this.inviteService.getServerInvites(serverId);
  }
}
