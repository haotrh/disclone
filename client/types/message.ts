import { User } from "./user";

export interface Attachment {
  id: string;
  url: string;
  fileName: string;
  description?: string;
  spoiler: boolean;
  contentType: string;
  width?: number;
  height?: number;
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
interface EmbedImage {
  url: string;
  width: number;
  height: number;
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

export interface Embed {
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: Date;
}

export enum MessageType {
  DEFAULT = 0,
  CHANNEL_PINNED_MESSAGE = 1,
  USER_JOIN = 2,
  REPLY = 3,
}

export interface Message {
  id: string;
  author: User;
  content: string;
  channelId: string;
  createdAt: Date;
  nonce?: string;
  attachments?: Attachment[];
  embeds?: Embed[];
  pinned?: boolean;
  type: MessageType;
  referencedMessage?: Message | null;
  mentionEveryone?: boolean;
  mentions?: User[];
}
