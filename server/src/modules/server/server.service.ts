import { EntityRepository, MikroORM, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { ChannelService } from '../channel/channel.service';
import ImageService from '../file/image.service';
import { PermissionsService } from '../permissions/permissions.service';
import { User } from '../user/entities/user.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { ModifyRolePositionsDto } from './dto/modify-channel-positions.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Member } from './entities/member.entity';
import { Role } from './entities/role.entity';
import { Server } from './entities/server.entity';
import { InviteService } from './invite.service';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: EntityRepository<Server>,
    @InjectRepository(Member)
    private memberRepository: EntityRepository<Member>,
    @InjectRepository(Role)
    private roleRepository: EntityRepository<Role>,
    private inviteService: InviteService,
    private channelService: ChannelService,
    private imageService: ImageService,
    private permissionsService: PermissionsService,
    private orm: MikroORM,
  ) {}

  async create(user: User, { name, icon }: CreateServerDto) {
    const defaultChannels = this.channelService.createDefaultChannels();
    const member = this.memberRepository.create({ user });
    const server = this.serverRepository.create({
      name,
      owner: user,
      channels: defaultChannels,
      members: [member],
      systemChannel: defaultChannels[1],
    });

    if (icon) {
      const uploadedIcon = await this.imageService.uploadServerIcon(
        icon,
        server.id,
      );
      this.serverRepository.assign(server, { icon: uploadedIcon });
    }
    await this.serverRepository.persist(server).flush();

    const role = this.roleRepository.create({
      _id: server._id,
      server,
      name: '@everyone',
      position: 0,
    });
    await this.roleRepository.persistAndFlush(role);

    return server;
  }

  async update(user: User, serverId: string, updateServerDto: UpdateServerDto) {
    const server = await this.serverRepository.findOneOrFail(serverId, {
      populate: ['owner'],
    });

    if (updateServerDto.icon && updateServerDto.icon.includes('base64')) {
      updateServerDto.icon = await this.imageService.uploadServerIcon(
        updateServerDto.icon,
        server.id,
      );
    }

    if (updateServerDto.splash && updateServerDto.splash.includes('base64')) {
      updateServerDto.splash = await this.imageService.uploadServerSplash(
        updateServerDto.splash,
        server.id,
      );
    }

    if (server.owner.id === user.id) {
      this.serverRepository.assign(server, updateServerDto);
      await this.serverRepository.persistAndFlush(server);
      return server;
    } else {
      throw new BadRequestException('You do not have permission.');
    }
  }

  async delete(user: User, serverId: string) {
    const server = await this.serverRepository.findOneOrFail(serverId, {
      populate: [
        'members',
        'owner',
        'channels.messages',
        'roles',
        'invites',
        'emojis',
      ],
    });

    if (server.owner.id === user.id) {
      return this.serverRepository.removeAndFlush(server);
    } else {
      throw new BadRequestException('You do not have permission.');
    }
  }

  async getMembers(serverId: string) {
    const server = await this.serverRepository.findOneOrFail(serverId, {
      populate: ['members.user'],
    });

    return server.members;
  }

  async getUserServers(userId: string) {
    return (
      await this.memberRepository.find(
        { user: userId },
        { populate: ['server.channels', 'server.roles', 'server.emojis'] },
      )
    )
      .map((member) => {
        const server = member.server;
        if (server) {
          if (server.owner.id === userId) {
            server.isOwner = true;
          }
          server.permissions = this.permissionsService
            .computeServerPermissions(member)
            .toString();
        }
        return server;
      })
      .filter((server) => !_.isNull(server));
  }

  async joinServer(inviteCode: string, user: User, serverId: string) {
    if (await this.memberRepository.findOne({ user, server: serverId })) return;
    await this.inviteService.useInviteCode(inviteCode);
    const member = this.memberRepository.create({
      user,
      server: serverId,
    });

    await this.memberRepository.persistAndFlush(member);

    return member;
  }

  async createRole(serverId: string) {
    const position =
      (await this.roleRepository.count({ server: serverId })) - 1;
    const role = this.roleRepository.create({ server: serverId, position });
    await this.roleRepository.persistAndFlush(role);
    return role;
  }

  async updateMember(
    updateMemberDto: UpdateMemberDto,
    user: User | string,
    serverId: string,
  ) {
    const member = await this.memberRepository.findOneOrFail({
      user,
      server: serverId,
    });

    if (updateMemberDto.avatar && updateMemberDto.avatar.includes('base64')) {
      updateMemberDto.avatar = await this.imageService.uploadMemberAvatar(
        updateMemberDto.avatar,
        member.user.id,
        serverId,
      );
    }

    if (updateMemberDto.banner && updateMemberDto.banner.includes('base64')) {
      updateMemberDto.banner = await this.imageService.uploadMemberBanner(
        updateMemberDto.banner,
        member.user.id,
        serverId,
      );
    }

    this.memberRepository.assign(member, updateMemberDto);
    await this.memberRepository.flush();
    return member;
  }

  async updateRole(
    updateRoleDto: UpdateRoleDto,
    roleId: string,
    serverId: string,
  ) {
    const role = await this.roleRepository.findOneOrFail({
      id: roleId,
      server: serverId,
    });
    this.roleRepository.assign(role, updateRoleDto);
    await this.roleRepository.flush();
    return role;
  }

  async deleteRole(roleId: string, serverId: string) {
    const role = await this.roleRepository.findOneOrFail(
      {
        id: roleId,
        server: serverId,
      },
      { populate: ['members'] },
    );
    role.members.getItems().forEach((member) => {
      member.roles.remove(role);
    });
    await this.memberRepository.flush();
    await this.roleRepository.removeAndFlush(role);
    return role;
  }

  async addRoleMembers(memberIds: string[], serverId: string, roleId: string) {
    const members = await this.memberRepository.find({
      user: memberIds,
      server: serverId,
    });
    const role = await this.roleRepository.findOneOrFail(roleId);

    members.forEach((member) => member.roles.add(role));
    await this.memberRepository.flush();
    return members;
  }

  async addMemberRole(userId: string, serverId: string, roleId: string) {
    const member = await this.memberRepository.findOneOrFail({
      user: userId,
      server: serverId,
    });

    const role = await this.roleRepository.findOneOrFail(roleId);
    member.roles.add(role);
    await this.memberRepository.flush();
  }

  async removeMemberRole(userId: string, serverId: string, roleId: string) {
    const member = await this.memberRepository.findOneOrFail({
      user: userId,
      server: serverId,
    });

    const role = await this.roleRepository.findOneOrFail(roleId);
    member.roles.remove(role);
    await this.memberRepository.flush();
  }

  async removeMember(userId: string, serverId: string) {
    const member = await this.memberRepository.findOneOrFail({
      user: userId,
      server: serverId,
    });

    await this.memberRepository.removeAndFlush(member);
    return member;
  }

  async modifyRolePositions(modifyRolePositionsDtos: ModifyRolePositionsDto[]) {
    const roles = await this.roleRepository.find(
      modifyRolePositionsDtos.map((role) => role.id),
      { populate: ['server'] },
    );

    const modifyRoleMap = _.keyBy(
      modifyRolePositionsDtos,
      (channel) => channel.id,
    );

    roles.forEach((role) => {
      wrap(role).assign(modifyRoleMap[role.id], {
        em: this.orm.em,
        merge: true,
      });
    });

    await this.roleRepository.flush();

    return roles;
  }
}
