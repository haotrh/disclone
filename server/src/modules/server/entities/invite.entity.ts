import {
  Entity,
  Index,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import ObjectID from 'bson-objectid';
import { User } from 'src/modules/user/entities/user.entity';
import { Server } from './server.entity';

@Entity()
@Index({
  properties: 'expiresAt',
  options: {
    expireAfterSeconds: 0,
  },
})
export class Invite {
  [OptionalProps]?: 'uses';

  @PrimaryKey({ hidden: true })
  _id!: ObjectID;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Property()
  @Unique()
  code!: string;

  @Property()
  expiresAt?: Date;

  @Property({ persist: false })
  presenceCount?: number;

  @Property({ persist: false })
  memberCount?: number;

  @ManyToOne({ eager: true })
  server: Server;

  @ManyToOne({ eager: true })
  inviter: User;

  @Property({ hidden: true })
  maxAge: number;

  @Property()
  maxUses: number;

  @Property()
  uses = 0;

  @Property({ hidden: true })
  createdAt = new Date();
}
