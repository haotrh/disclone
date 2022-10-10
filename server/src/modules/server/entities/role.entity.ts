import {
  Entity,
  ManyToOne,
  OptionalProps,
  Property,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/common/base.entity';
import { defaultPermission } from 'src/types/permissions.types';
import { Member } from './member.entity';
import { Server } from './server.entity';

@Entity()
export class Role extends BaseEntity {
  [OptionalProps]?: 'permissions' | 'hoist' | 'name' | 'color';

  @Property()
  name = 'new role';

  @Property()
  color = 10070709;

  @Property()
  position: number;

  @Property()
  hoist = false;

  @Property()
  permissions = defaultPermission.toString();

  @ManyToOne({ hidden: true, cascade: [] })
  server: Server;

  @ManyToMany(() => Member, (member) => member.roles, {
    hidden: true,
    lazy: true,
  })
  members = new Collection<Member>(this);
}
