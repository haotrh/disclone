import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { User } from '../user/entities/user.entity';
import { CreateInviteDto } from './dto/create-invite.dto';
import { Invite } from './entities/invite.entity';
import { Server } from './entities/server.entity';
import randomstring from 'randomstring';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private inviteRepository: EntityRepository<Invite>,
    @InjectRepository(Server)
    private serverRepository: EntityRepository<Server>,
  ) {}

  async getServerInvites(serverId: string) {
    return this.inviteRepository.find({ server: serverId });
  }

  async createInvite(
    user: User,
    serverId: string,
    { maxAge, maxUses, unique }: CreateInviteDto,
  ) {
    const server = await this.serverRepository.findOneOrFail(serverId);

    if (!unique) {
      const invite = await this.inviteRepository.findOne({
        maxAge,
        maxUses,
        server: serverId,
      });

      if (invite) return invite;
    }

    const code = randomstring.generate({ length: 8 });
    const invite = this.inviteRepository.create({
      code,
      inviter: user,
      maxAge,
      maxUses,
      server,
    });
    if (maxAge !== 0)
      invite.expiresAt = moment(invite.createdAt)
        .add(maxAge, 'seconds')
        .toDate();
    await this.inviteRepository.persistAndFlush(invite);
    return invite;
  }

  async checkInviteValid(invite: Invite) {
    if (
      (invite.maxUses !== 0 && invite.uses >= invite.maxUses) ||
      moment() > moment(invite.expiresAt)
    )
      return false;
    return true;
  }

  getInvite(inviteCode: string) {
    return this.inviteRepository.findOneOrFail(
      { code: inviteCode },
      {
        populate: ['server'],
      },
    );
  }

  async deleteInvite(inviteCode: string) {
    const invite = await this.getInvite(inviteCode);
    return this.inviteRepository.removeAndFlush(invite);
  }

  async useInviteCode(inviteCode: string) {
    const invite = await this.getInvite(inviteCode);

    if (this.checkInviteValid(invite)) {
      invite.uses = invite.uses + 1;
      if (invite.maxUses !== 0 && invite.uses === invite.maxUses) {
        this.inviteRepository.remove(invite);
      }
      await this.inviteRepository.flush();
      return;
    } else {
      throw new Error('Invalid invite code');
    }
  }
}
