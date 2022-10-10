import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { InviteService } from './invite.service';
import { Permissions } from 'src/types/permissions.types';
import { Permission } from '../permissions/permission.decorator';

@ApiTags('invites')
@ApiBearerAuth()
@Controller('invites')
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get(':inviteCode')
  @Public()
  async getInvite(@Param('inviteCode') inviteCode: string) {
    return this.inviteService.getInvite(inviteCode);
  }

  @Delete(':inviteCode')
  @Permission(Permissions.MANAGE_SERVER)
  async deleteInvite(@Param('inviteCode') inviteCode: string) {
    return this.inviteService.deleteInvite(inviteCode);
  }
}
