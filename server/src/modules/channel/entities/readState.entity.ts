import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import ObjectID from 'bson-objectid';
import { User } from 'src/modules/user/entities/user.entity';
import { Message } from './message.entity';

@Entity()
export class ReadState {
  @PrimaryKey({ hidden: true })
  _id!: ObjectID;

  @SerializedPrimaryKey()
  id!: string;

  @ManyToOne({ hidden: true, lazy: true })
  user: User;

  @Property()
  lastPinTimestamp: Date;

  @Property()
  lastMessage: Message;

  @Property()
  mentionCount = 0;
}
