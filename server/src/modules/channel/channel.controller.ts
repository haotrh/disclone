import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Permissions } from 'src/types/permissions.types';
import { Permission } from '../permissions/permission.decorator';
import { User } from '../user/entities/user.entity';
import { EventsGateway } from '../events/events.gateway';
import { ChannelService } from './channel.service';
import { UpdateChannelDto } from './dto/update-channel.dto';

@ApiTags('channels')
@ApiBearerAuth()
@Controller('channels')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private eventsGateway: EventsGateway,
  ) {}

  @Patch(':channelId')
  @Permission(Permissions.MANAGE_CHANNELS)
  async updateChannel(
    @Body() updateChannelDto: UpdateChannelDto,
    @Param('channelId') channelId: string,
  ) {
    const channel = await this.channelService.updateChannel(
      updateChannelDto,
      channelId,
    );
    this.eventsGateway.emitChannelUpdate(channel.server.id, channel);
    return channel;
  }

  @Delete(':channelId')
  @Permission(Permissions.MANAGE_CHANNELS)
  async deleteChannel(@Param('channelId') channelId: string) {
    const channel = await this.channelService.deleteChannel(channelId);
    this.eventsGateway.emitChannelDelete(channel.server.id, {
      id: channel.id,
      serverId: channel.server.id,
    });
    return channel;
  }

  @Put(':channelId/permissions/:overwriteId')
  async editChannelPermissions() {}

  @Delete(':channelId/permissions/:overwriteId')
  async deleteChannelPermission() {}

  @Post(':channelId/typing')
  async triggerTypingIndicator(
    @CurrentUser() user: User,
    @Param('channelId') channelId: string,
  ) {
    const channel = await this.channelService.getChannel(channelId);
    this.eventsGateway.emitTyping(channelId, {
      userId: user.id,
      serverId: channel.server.id,
    });
  }
}
