import {
  EntityRepository,
  MikroORM,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { Channel, ChannelType } from '../channel/entities/channel.entity';
import { ReadState } from '../channel/entities/readState.entity';
import ImageService from '../file/image.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSettings } from './entities/user-settings.entity';
import { Relationship, User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    @InjectRepository(Channel)
    private channelRepository: EntityRepository<Channel>,
    @InjectRepository(ReadState)
    private readStateRepository: EntityRepository<ReadState>,
    @InjectRepository(UserSettings)
    private userSettingsRepository: EntityRepository<UserSettings>,
    private imageService: ImageService,
    private orm: MikroORM,
  ) {}

  async getRelationships(userId: string) {
    const { relationships } = await this.userRepository.findOneOrFail(userId, {
      fields: ['relationships'],
      populate: ['relationships', 'relationships.user'],
    });

    return (relationships ?? []) as Relationship[];
  }

  async getDmChannels(userId: string) {
    const channels = await this.channelRepository.find(
      {
        recipients: [userId],
        show: [userId],
        type: ChannelType.DM,
      },
      { populate: ['recipients'] },
    );

    return channels;
  }

  async create({ password, ...data }: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const discrimination = _.random(1, 9999).toString().padStart(4, '0');

    const user = this.userRepository.create({
      password: hashedPassword,
      discrimination,
      ...data,
    });

    const settings = this.userSettingsRepository.create({});
    this.userRepository.assign(user, { settings });
    await this.userRepository.persistAndFlush(user);

    return user;
  }

  findOne(id: string, fields?: (keyof User)[]) {
    return this.userRepository.findOne(id, { fields });
  }

  findOneByEmail(email: string, fields?: (keyof User)[]) {
    return this.userRepository.findOne({ email }, { fields });
  }

  findOneByUsernameAndNumber(
    username: string,
    discrimination: string,
    fields?: (keyof User)[],
  ) {
    return this.userRepository.findOne(
      { username, discrimination },
      { fields },
    );
  }

  async getUserSettings(id: string) {
    const settings = (
      await this.userRepository.findOne(id, {
        populate: ['settings'],
      })
    ).settings;

    if (!settings) {
      const settings = this.userSettingsRepository.create({});
      const user = await this.findOne(id);
      this.userRepository.assign(user, { settings });
      await this.userRepository.persistAndFlush(user);
      return settings;
    }

    return settings;
  }

  async getUserReadStates(id: string) {
    const readStates = await this.readStateRepository.find({ user: id });
    return readStates;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateFields: Partial<UpdateUserDto> = _.omit(updateUserDto, [
      'username',
      'password',
      'newPassword',
      'email',
    ]);
    const user = await this.userRepository.findOneOrFail(id);

    if (updateUserDto.username && updateUserDto.password) {
      if (bcrypt.compareSync(updateUserDto.password, user.password)) {
        updateFields.username = updateUserDto.username;
      } else {
        throw new HttpException('Passwords does not match!', 403);
      }
    }

    if (updateUserDto.email && updateUserDto.password) {
      if (bcrypt.compareSync(updateUserDto.password, user.password)) {
        updateFields.email = updateUserDto.email;
      } else {
        throw new HttpException('Passwords does not match!', 403);
      }
    }

    if (updateUserDto.newPassword && updateUserDto.password) {
      if (bcrypt.compareSync(updateUserDto.password, user.password)) {
        updateFields.password = bcrypt.hashSync(updateUserDto.newPassword, 10);
      } else {
        throw new HttpException('Passwords does not match!', 403);
      }
    }

    if (updateFields.avatar && updateFields.avatar.includes('base64')) {
      updateFields.avatar = await this.imageService.uploadUserAvatar(
        updateUserDto.avatar,
        user.id,
      );
    }

    if (updateFields.banner && updateFields.banner.includes('base64')) {
      updateFields.banner = await this.imageService.uploadUserBanner(
        updateFields.banner,
        user.id,
      );
    }

    this.userRepository.assign(user, updateFields);
    try {
      await this.userRepository.persistAndFlush(user);
      return user;
    } catch (e: unknown) {
      if (e instanceof UniqueConstraintViolationException) {
        throw new HttpException('email not available', 403);
      } else {
        throw e;
      }
    }
  }

  async updateSettings(userId: string, updateSettingsDto: UpdateSettingsDto) {
    const user = await this.userRepository.findOneOrFail(userId, {
      populate: ['settings'],
    });
    const settings = user.settings;
    this.userSettingsRepository.assign(settings, updateSettingsDto);
    await this.userSettingsRepository.persistAndFlush(settings);
    return settings;
  }
}
