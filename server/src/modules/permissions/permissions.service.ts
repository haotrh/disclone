import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Permissions } from 'src/types/permissions.types';
import { Channel, ChannelType } from '../channel/entities/channel.entity';
import { Member } from '../server/entities/member.entity';
import { Server } from '../server/entities/server.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: EntityRepository<Server>,
    @InjectRepository(Channel)
    private channelRepository: EntityRepository<Channel>,
    @InjectRepository(Member)
    private memberRepository: EntityRepository<Member>,
  ) {}

  hasPermission(memberPermissions: number, permission: Permissions) {
    return (memberPermissions & permission) == permission;
  }

  computeServerPermissions(member: Member) {
    const server = member.server;
    const serverRoles = _.keyBy(server.roles.toArray(), 'id');
    //everyone permissions
    let permissions = parseInt(serverRoles[server.id].permissions);
    member.roles.toArray().forEach((memberRole) => {
      const role = serverRoles[memberRole.id];
      permissions = permissions | parseInt(role.permissions);
    });
    return permissions;
  }

  async hasServerPermission(
    permission: Permissions,
    user: User,
    serverId: string,
  ): Promise<boolean> {
    const member = await this.memberRepository.findOne(
      {
        user,
        server: serverId,
      },
      { populate: ['server.roles', 'user'] },
    );
    if (!member) {
      return false;
    }
    const memberPermissions = this.computeServerPermissions(member);
    if (
      member.server.owner.id === member.user.id ||
      this.hasPermission(memberPermissions, Permissions.ADMINISTRATOR)
    ) {
      return true;
    }
    return (memberPermissions & permission) == permission;
  }

  async hasChannelPermission(
    permission: Permissions,
    user: User,
    channelId: string,
  ) {
    const channel = await this.channelRepository.findOne(channelId);
    if (channel.type === ChannelType.DM) return true;
    return await this.hasServerPermission(permission, user, channel.server.id);
  }
}
