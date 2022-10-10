import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import ObjectID from 'bson-objectid';
import { Server } from 'src/modules/server/entities/server.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class Emoji {
  @PrimaryKey({ hidden: true })
  _id!: ObjectID;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property()
  user: User;

  @ManyToOne({ hidden: true })
  server: Server;
}
