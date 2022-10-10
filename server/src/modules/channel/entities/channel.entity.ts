import {
  Collection,
  Embeddable,
  Embedded,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  Property,
} from '@mikro-orm/core';
import { IsEnum, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Server } from 'src/modules/server/entities/server.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Message } from './message.entity';

export enum ChannelType {
  SERVER_TEXT = 0,
  DM = 1,
  SERVER_VOICE = 2,
  SERVER_CATEGORY = 3,
}

export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

@Embeddable()
export class Overwrite {
  @Property()
  @IsString()
  id: string;

  @Enum()
  @IsEnum(OverwriteType)
  type: OverwriteType;

  @Property()
  @IsString()
  allow: string | null;

  @Property()
  @IsString()
  deny: string | null;
}

@Entity()
export class Channel extends BaseEntity {
  [OptionalProps]?: 'position' | 'parent';

  @Property()
  name?: string;

  @Property()
  topic?: string;

  @Enum()
  type: ChannelType;

  @Property({ default: 0 })
  position: number;

  @Property()
  lastPinTimestamp: Date | null = null;

  @ManyToOne({
    serializer: (value) => value && value.id,
    serializedName: 'lastMessageId',
  })
  lastMessage?: Message;

  @ManyToOne(() => Channel, {
    serializer: (value) => value && value.id,
    serializedName: 'parentId',
    default: null,
  })
  parent: Channel | null;

  @ManyToOne(() => Server, {
    serializer: (value) => value && value.id,
    serializedName: 'serverId',
  })
  server?: Server;

  @ManyToMany()
  recipients? = new Collection<User>(this);

  @ManyToMany({ hidden: true })
  show? = new Collection<User>(this);

  @OneToMany(() => Message, (message) => message.channel, {
    lazy: true,
    hidden: true,
    orphanRemoval: true,
  })
  messages? = new Collection<Message>(this);

  @Embedded({ array: true, object: true, nullable: true })
  permissionOverwrites?: Overwrite[];
}
