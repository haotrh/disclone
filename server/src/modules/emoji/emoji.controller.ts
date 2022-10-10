import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Permissions } from 'src/types/permissions.types';
import { Permission } from '../permissions/permission.decorator';
import { User } from '../user/entities/user.entity';
import { EventsGateway } from '../ws/events.gateway';
import { CreateEmojiDto } from './dtos/create-emoji.dto';
import { ModifyEmojiDto } from './dtos/modify-emoji.dto';
import { EmojiService } from './emoji.service';

@ApiTags('emojis')
@ApiBearerAuth()
@Controller('servers/:serverId/emojis')
export class EmojiController {
  constructor(
    private emojiService: EmojiService,
    private eventsGateway: EventsGateway,
  ) {}

  @Get()
  async listServerEmojis(@Param('serverId') serverId: string) {
    return this.emojiService.listServerEmojis(serverId);
  }

  @Get(':emojiId')
  async getEmoji(
    @Param('serverId') serverId: string,
    @Param('emojiId') emojiId: string,
  ) {
    return this.emojiService.getServerEmoji(serverId, emojiId);
  }

  @Post()
  @Permission(Permissions.MANAGE_EMOJIS_STICKERS)
  async createEmoji(
    @Param('serverId') serverId: string,
    @Body() createEmojiDto: CreateEmojiDto,
    @CurrentUser() user: User,
  ) {
    const emoji = await this.emojiService.createEmoji(
      serverId,
      createEmojiDto,
      user,
    );
    this.eventsGateway.emitEmojiCreate(serverId, { emoji, serverId });
    return emoji;
  }

  @Patch(':emojiId')
  @Permission(Permissions.MANAGE_EMOJIS_STICKERS)
  async modifyEmoji(
    @Param('emojiId') emojiId: string,
    @Body() modifyEmojiDto: ModifyEmojiDto,
  ) {
    const emoji = await this.emojiService.modifyEmoji(emojiId, modifyEmojiDto);
    this.eventsGateway.emitEmojiUpdate(emoji.server.id, emoji);
    return emoji;
  }

  @Delete(':emojiId')
  @Permission(Permissions.MANAGE_EMOJIS_STICKERS)
  async deleteInvite(@Param('emojiId') emojiId: string) {
    const emoji = await this.emojiService.deleteEmoji(emojiId);
    this.eventsGateway.emitEmojiDelete(emoji.server.id, {
      emojiId: emoji.id,
      serverId: emoji.server.id,
    });
    return;
  }
}
