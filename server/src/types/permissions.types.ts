export enum Permissions {
  VIEW_CHANNELS = 1 << 0,
  MANAGE_CHANNELS = 1 << 1,
  MANAGE_ROLES = 1 << 2,
  MANAGE_EMOJIS_STICKERS = 1 << 3,
  MANAGE_SERVER = 1 << 4,
  CREATE_INVITE = 1 << 5,
  CHANGE_NICKNAME = 1 << 6,
  MANAGE_NICKNAMES = 1 << 7,
  KICK_MEMBERS = 1 << 8,
  SEND_MESSAGES = 1 << 9,
  ATTACH_FILES = 1 << 10,
  ADD_REACTIONS = 1 << 11,
  MANAGE_MESSAGES = 1 << 12,
  CONNECT = 1 << 13,
  SPEAK = 1 << 14,
  VIDEO = 1 << 15,
  MUTE_MEMBERS = 1 << 16,
  DEAFEN_MEMBERS = 1 << 17,
  MOVE_MEMBERS = 1 << 18,
  ADMINISTRATOR = 1 << 19,
  EMBED_LINKS = 1 << 20,
  MENTION_EVERYONE = 1 << 21,
}

export const defaultPermission: number =
  Permissions.VIEW_CHANNELS |
  Permissions.CREATE_INVITE |
  Permissions.CHANGE_NICKNAME |
  Permissions.SEND_MESSAGES |
  Permissions.ATTACH_FILES |
  Permissions.ADD_REACTIONS |
  Permissions.CONNECT |
  Permissions.SPEAK |
  Permissions.VIDEO;
