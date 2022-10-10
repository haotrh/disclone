import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import ObjectID from 'bson-objectid';
import _ from 'lodash';
import { publicUserFields, User } from 'src/modules/user/entities/user.entity';
import { Role } from './role.entity';
import { Server } from './server.entity';

@Entity()
export class Member {
  [OptionalProps]?: 'mute' | 'deaf' | 'joinedAt' | 'nick' | 'server';

  @PrimaryKey({ hidden: true })
  _id!: ObjectID;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @ManyToOne({ hidden: true })
  server: Server;

  @ManyToOne({
    serializer: (value: User) => _.pick(value, publicUserFields),
    eager: true,
  })
  user: User;

  @Property()
  nick: string | null = null;

  @Property()
  mute = false;

  @Property()
  deaf = false;

  @Property()
  avatar: string | null = null;

  @Property()
  banner: string | null = null;

  @Property()
  bio = '';

  @Property()
  joinedAt = new Date();

  @ManyToMany()
  roles = new Collection<Role>(this);
}
