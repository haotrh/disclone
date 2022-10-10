import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import 'dotenv/config';
import { User } from '../../user/entities/user.entity';

export enum TokenType {
  REFRESH_TOKEN = 'refresh_token',
  RESET_PASSWORD = 'reset_password',
  VERIFY_EMAIL = 'verify_email',
}

@Entity()
@Index({
  properties: 'expiresIn',
  options: {
    expireAfterSeconds: 0,
  },
})
export class Token {
  @PrimaryKey()
  _id: string;

  @Enum()
  type: TokenType;

  @ManyToOne()
  user: User;

  @Property()
  expiresIn: Date;
}
