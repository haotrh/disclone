import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Channel } from 'src/modules/channel/entities/channel.entity';
import { Emoji } from 'src/modules/emoji/entities/emoji.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from '../../../common/base.entity';
import { Invite } from './invite.entity';
import { Member } from './member.entity';
import { Role } from './role.entity';

@Entity()
export class Server extends BaseEntity {
  @Property()
  name: string;

  @Property()
  description = '';

  @Property()
  icon: string | null;

  @Property()
  splash: string | null;

  @Property({ persist: false, serializedName: 'owner' })
  isOwner?: boolean;

  @Property({ persist: false })
  permissions?: string;

  @OneToMany(() => Channel, (channel) => channel.server, {
    orphanRemoval: true,
  })
  channels = new Collection<Channel>(this);

  @ManyToOne({
    serializer: (value: User) => value.id,
    serializedName: 'ownerId',
  })
  owner: User;

  @OneToOne({
    serializer: (value) => value.id,
    serializedName: 'systemChannelId',
    orphanRemoval: true,
  })
  systemChannel: Channel;

  @OneToMany(() => Member, (member) => member.server, {
    hidden: true,
    persist: true,
    orphanRemoval: true,
  })
  members = new Collection<Member>(this);

  @OneToMany(() => Role, (role) => role.server, { orphanRemoval: true })
  roles = new Collection<Role>(this);

  @OneToMany(() => Emoji, (emoji) => emoji.server, { orphanRemoval: true })
  emojis = new Collection<Emoji>(this);

  @OneToMany(() => Invite, (invite) => invite.server, { orphanRemoval: true })
  invites = new Collection<Invite>(this);
}
