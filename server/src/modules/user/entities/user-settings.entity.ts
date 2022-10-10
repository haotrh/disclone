import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/common/base.entity';
import { UserStatus } from './user.entity';

export type Theme = 'dark' | 'light';

@Entity()
export class UserSettings extends BaseEntity {
  @Property()
  theme: Theme = 'dark';

  @Property()
  animateEmoji = true;

  @Property()
  gifAutoPlay = true;

  @Property()
  serversPositions: string[] = [];

  @Property()
  status: UserStatus = 'online';
}
