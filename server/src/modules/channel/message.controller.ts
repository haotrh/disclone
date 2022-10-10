import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Permissions } from 'src/types/permissions.types';
import { Permission } from '../permissions/permission.decorator';
import { User } from '../user/entities/user.entity';
import { EventsGateway } from '../ws/events.gateway';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';

@ApiTags('message')
@ApiBearerAuth()
@Controller('channels/:channelId/messages')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private eventsGateway: EventsGateway,
  ) {}

  @Get()
  @Permission(Permissions.VIEW_CHANNELS)
  getMessages(
    @Query() query: PaginationQueryDto,
    @Param('channelId') channelId: string,
    @CurrentUser() user: User,
  ) {
    const messages = this.messageService.getMessages(channelId, query, user);
    this.eventsGateway.joinRoom(user.id, channelId);
    return messages;
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { dest: './upload' }))
  @Permission(Permissions.SEND_MESSAGES)
  async sendMessage(
    @CurrentUser() user: User,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('channelId') channelId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    if (createMessageDto.content) {
      createMessageDto.content = createMessageDto.content.trim();
    }
    const message = await this.messageService.sendMessage(
      user,
      channelId,
      files,
      createMessageDto,
    );
    this.eventsGateway.emitMessageCreate(channelId, message);
    return message;
  }

  @Patch(':messageId')
  async editMessage(
    @Body() updateMessageDto: UpdateMessageDto,
    @Param('messageId') messageId: string,
    @CurrentUser() user: User,
  ) {
    const message = await this.messageService.updateMessage(
      user,
      updateMessageDto,
      messageId,
    );
    this.eventsGateway.emitMessageUpdate(message.channel.id, message);
    return message;
  }

  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: string) {
    const message = await this.messageService.deleteMessage(messageId);
    this.eventsGateway.emitMessageDelete(message.channel.id, {
      id: message.id,
      channelId: message.channel.id,
    });
    return message;
  }
}
