import {
  Collection,
  Embeddable,
  Embedded,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Channel } from './channel.entity';

export enum MessageType {
  DEFAULT = 0,
  CHANNEL_PINNED_MESSAGE = 1,
  USER_JOIN = 2,
  REPLY = 3,
}

@Embeddable()
export class Attachment {
  @Property()
  id: string;

  @Property()
  fileName: string;

  @Property()
  description?: string;

  @Property()
  contentType: string;

  @Property()
  url: string;

  @Property()
  spoiler = false;

  @Property()
  width?: number;

  @Property()
  height?: number;

  @Property()
  size: number;
}

interface EmbedFooter {
  text: string;
  iconUrl?: string;
}
interface EmbedProvider {
  name: string;
  url?: string;
}
interface EmbedAuthor {
  name: string;
  url: string;
  iconUrl: string;
}
interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}
interface EmbedThumbnail {
  url: string;
  width: number;
  height: number;
}
interface EmbedVideo {
  url: string;
  width?: number;
  height?: number;
}
interface EmbedImage {
  url: string;
  width: number;
  height: number;
}

@Embeddable()
export class Embed {
  @Property()
  footer?: EmbedFooter;

  @Property()
  image?: EmbedImage;

  @Property()
  thumbnail?: EmbedThumbnail;

  @Property()
  video?: EmbedVideo;

  @Property()
  provider?: EmbedProvider;

  @Property()
  author?: EmbedAuthor;

  @Property()
  fields?: EmbedField[];

  @Property()
  title?: string;

  @Property()
  description?: string;

  @Property()
  url?: string;

  @Property()
  timestamp?: Date;

  @Property()
  color?: number;
}

@Entity()
export class Message extends BaseEntity {
  @Property()
  content?: string;

  @ManyToOne({
    serializer: (value) => value && value._id,
    serializedName: 'channelId',
  })
  channel!: Channel;

  @Property({ persist: false })
  nonce?: string;

  @ManyToOne({ eager: true })
  author!: User;

  @ManyToMany()
  readBy = new Collection<User>(this);

  @Embedded({ array: true, object: true, nullable: true })
  attachments?: Attachment[] = [];

  @Embedded({ array: true, object: true, nullable: true })
  embeds?: Embed[] = [];

  @Property()
  pinned = false;

  @Property()
  mentionEveryone = false;

  @ManyToMany({ eager: true })
  mentions = new Collection<User>(this);

  @Enum()
  type: MessageType = MessageType.DEFAULT;

  @ManyToOne()
  referencedMessage?: Message | null;
}
