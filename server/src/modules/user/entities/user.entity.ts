import {
  Embeddable,
  Embedded,
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  OptionalProps,
  Property,
  StringType,
  Unique,
} from '@mikro-orm/core';
import { ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { UserSettings } from './user-settings.entity';

export const publicUserFields: (keyof User)[] = [
  'id',
  'username',
  'discrimination',
  'avatar',
  'status',
  'banner',
  'bio',
];

export const myUserFields: (keyof User)[] = [
  'id',
  'username',
  'discrimination',
  'avatar',
  'status',
  'email',
  'verified',
  'dob',
  'bio',
  'banner',
];

export type UserStatus = 'online' | 'offline' | 'idle' | 'dnd';

export enum RelationshipType {
  FRIEND = 1,
  BLOCK = 2,
  INCOMING = 3,
  OUTGOING = 4,
}

@Entity()
export class User extends BaseEntity {
  [OptionalProps]?: 'bio' | 'status';

  @Property()
  @Unique()
  @IsEmail()
  email: string;

  @Property()
  @IsString()
  username: string;

  @Property()
  @IsString()
  discrimination: string;

  @Property()
  @IsBoolean()
  verified = false;

  @Property()
  @IsDate()
  dob: Date;

  @Property()
  @IsString()
  bio = '';

  @Property({ hidden: true })
  @IsString()
  password: string;

  @Property()
  @IsString()
  avatar: string | null = null;

  @Property()
  @IsString()
  banner: string | null = null;

  @Property({ type: StringType })
  @IsString()
  status: UserStatus = 'online';

  @OneToOne({ lazy: true, hidden: true })
  @ApiHideProperty()
  settings: UserSettings;

  @Embedded({ hidden: true, array: true })
  relationships: Relationship[] = [];
}

@Embeddable()
export class Relationship {
  @Property()
  id: string;

  @Enum()
  @IsEnum(RelationshipType)
  type: RelationshipType;

  @Property()
  nickname: string | null = null;

  @ManyToOne({ lazy: true })
  user: User;
}
