import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Permissions } from 'src/types/permissions.types';
import { Permission } from '../permissions/permission.decorator';
import { User } from '../user/entities/user.entity';
import { MessageService } from './message.service';

@ApiTags('pins')
@ApiBearerAuth()
@Controller('channels/:channelId/pins')
export class PinController {
  constructor(private messageService: MessageService) {}

  @Permission(Permissions.VIEW_CHANNELS)
  @Get()
  getPinnedMessages(
    @Param('channelId') channelId: string,
    @CurrentUser() user: User,
  ) {
    return this.messageService.getPinned(channelId, user.id);
  }

  @Permission(Permissions.MANAGE_CHANNELS)
  @Put(':messageId')
  async pinMessage(
    @Param('channelId') channelId: string,
    @Param('messageId') messageId: string,
    @CurrentUser() user: User,
  ) {
    return this.messageService.pinMessage(channelId, messageId, user);
  }

  @Permission(Permissions.MANAGE_CHANNELS)
  @Delete(':messageId')
  async unpinMessage(
    @Param('channelId') channelId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.unpinMessage(channelId, messageId);
  }
}
