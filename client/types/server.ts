import { Channel } from "./channel";
import { User } from "./user";

export interface Role {
  id: string;
  name: string;
  color: number;
  position: number;
  hoist: boolean;
  permissions: string;
}

export interface Server {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  banner?: string | null;
  channels: Channel[];
  roles: Role[];
  emojis: CustomEmoji[];
  ownerId: string;
  systemChannelId: string;
  owner?: boolean;
  splash?: string;
  permissions?: string;
  invites?: Invite[];
}

export interface Invite {
  code: string;
  server: Server;
  inviter: User;
  memberCount?: number;
  presenceCount?: number;
  uses: number;
  maxUses: number;
  expiresAt?: Date;
}

export interface Member {
  user: User;
  nick?: string;
  mute: boolean;
  deaf: boolean;
  joinedAt: Date;
  bio: string;
  avatar?: string;
  banner?: string;
  roles: string[];
  typing?: boolean;
  visualRole?: Role;
  serverId?: string;
}

export interface EmojiSkin {
  unified: string;
  native: string;
  x: number;
  y: number;
}

export interface StandardEmoji {
  name: string;
  unified: string;
  native: string;
  x: number;
  y: number;
  hasParent?: boolean;
  skins?: StandardEmoji[];
}

export interface CustomEmoji {
  id: string;
  name: string;
  serverId?: string;
}

export type Emoji = (StandardEmoji | CustomEmoji) & {
  altName?: string;
  fullName?: string;
};

export type ServerEmoji = { id: string; name: string; serverId: string; user: User };

export const isNativeEmoji = (emoji: Emoji) => "native" in emoji;
