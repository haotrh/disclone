import { User } from "./user";

export enum ChannelType {
  SERVER_TEXT = 0,
  DM = 1,
  SERVER_VOICE = 2,
  SERVER_CATEGORY = 3,
}

export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

export interface Overwrite {
  id: string;
  type: OverwriteType;
  allow: string;
  deny: string;
}

export interface Channel {
  id: string;
  name?: string;
  topic?: string;
  type: ChannelType;
  parentId: string | null;
  serverId?: string;
  ownerId?: string;
  recipients?: User[];
  lastMessageId?: string;
  collapsed?: boolean;
  position?: number;
  createdAt: Date;
}
