import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { EventsGateway } from '../events/events.gateway';
import { DmChannelService } from './dm-channel.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { CreateDmChannelDto } from './dto/create-dm-channel';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateFriendNicknameDto } from './dto/update-friend-nickname.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RelationshipService } from './relationship.service';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly relationshipService: RelationshipService,
    private readonly dmChannelService: DmChannelService,
    private eventsGateway: EventsGateway,
  ) {}

  @Get('@me')
  @ApiBearerAuth()
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @Patch('@me')
  async updateMe(@CurrentUser() user: User, @Body() updateUser: UpdateUserDto) {
    const updatedUser = await this.userService.update(user.id, updateUser);
    const userSocketIds = this.eventsGateway.getClientSocketIds(user.id);
    this.eventsGateway.emitUserUpdate(userSocketIds, updatedUser);
    return updatedUser;
  }

  @Patch('@me/settings')
  async updateUserSettings(
    @CurrentUser() user: User,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    const oldStatus = user.status;
    const settings = await this.userService.updateSettings(
      user.id,
      updateSettingsDto,
    );
    this.eventsGateway.emitUserSettingsUpdate(user.id, settings);
    if (updateSettingsDto.status && oldStatus !== updateSettingsDto.status) {
      await this.updateMe(user, { status: updateSettingsDto.status });
      this.eventsGateway.emitPresenceUpdate(user.id, updateSettingsDto.status);
    }
    return settings;
  }

  @Get('/@me/relationships')
  async getRelationships(@CurrentUser() user: User) {
    return this.relationshipService.getRelationships(user);
  }

  @Post('/@me/relationships')
  async addFriend(
    @Body() addFriendDto: AddFriendDto,
    @CurrentUser() user: User,
  ) {
    const peerUser = await this.userService.findOneByUsernameAndNumber(
      addFriendDto.username,
      addFriendDto.discrimination,
      ['relationships'],
    );
    if (!peerUser) {
      throw new BadRequestException('User not found');
    }
    return this.relationshipService.createRelationship(user, peerUser.id);
  }

  @Put('/@me/relationships/:peerId')
  async createRelationship(
    @Param('peerId') peerId: string,
    @Body() createRelationshipDto: CreateRelationshipDto,
    @CurrentUser() user: User,
  ) {
    return this.relationshipService.createRelationship(
      user,
      peerId,
      createRelationshipDto.type,
    );
  }

  @Patch('/@me/relationships/:peerId')
  async updateFriendNickname(
    @Param('peerId') peerId: string,
    @Body() updateFriendNicknameDto: UpdateFriendNicknameDto,
    @CurrentUser() user: User,
  ) {
    return this.relationshipService.updateFriendNickname(
      user,
      peerId,
      updateFriendNicknameDto.nickname,
    );
  }

  @Delete('/@me/relationships/:peerId')
  async removeRelationship(
    @Param('peerId') peerId: string,
    @CurrentUser() user: User,
  ) {
    return this.relationshipService.deleteRelationship(user, peerId);
  }

  @Post('/@me/channels')
  createDmChannel(
    @CurrentUser() user: User,
    @Body() createDmChannelDto: CreateDmChannelDto,
  ) {
    return this.dmChannelService.createDmChannel(
      user,
      createDmChannelDto.recipient,
    );
  }

  @Delete('/@me/channels/:channelId')
  async deleteDmChannel(
    @Param('channelId') channelId: string,
    @CurrentUser() user: User,
  ) {
    return this.dmChannelService.removeDmChannel(user, channelId);
  }
}
