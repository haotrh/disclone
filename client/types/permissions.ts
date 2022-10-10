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

export const rolePermissionsList: {
  name: string;
  description: string;
  permission: Permissions;
}[] = [
  {
    name: "View Channels",
    description: "Allow members to view channels by default (excluding private channels).",
    permission: Permissions.VIEW_CHANNELS,
  },
  {
    name: "Manage Channels",
    description: "Allows members to create, edit, or delete channels.",
    permission: Permissions.MANAGE_CHANNELS,
  },
  {
    name: "Manage Roles",
    description:
      "Allows members to create new roles and edit or delete roles lower than their highest role. Also allows members to change permissions of individual channels that they have access to.",
    permission: Permissions.MANAGE_ROLES,
  },
  {
    name: "Manage Emojis and Stickers",
    description: "Allows members to add or remove custom emojis and stickers in this server.",
    permission: Permissions.MANAGE_EMOJIS_STICKERS,
  },
  {
    name: "Manage Server",
    description:
      "Allows members to change this server's name, switch regions, and add bots to this server.",
    permission: Permissions.MANAGE_SERVER,
  },
  {
    name: "Create Invite",
    description: "Allows members to invite new people to this server.",
    permission: Permissions.CREATE_INVITE,
  },
  {
    name: "Change Nickname",
    description: "Allows members to change their own nickname, a custom name for just this server.",
    permission: Permissions.CHANGE_NICKNAME,
  },
  {
    name: "Manage Nicknames",
    description: "Allows members to change the nicknames of other members.",
    permission: Permissions.MANAGE_NICKNAMES,
  },
  {
    name: "Kick Members",
    description:
      "Allows members to remove other members from this server. Kicked members will be able to rejoin if they have another invite.",
    permission: Permissions.KICK_MEMBERS,
  },
  {
    name: "Send Messages",
    description: "Allows members to send messages in text channels.",
    permission: Permissions.SEND_MESSAGES,
  },
  {
    name: "Attach Files",
    description: "Allows members to upload files or media in text channels.",
    permission: Permissions.ATTACH_FILES,
  },
  {
    name: "Add Reactions",
    description:
      "Allows members to add new emoji reactions to a message. If this permission is disabled, members can still react using any existing reactions on a message.",
    permission: Permissions.ADD_REACTIONS,
  },
  {
    name: "Manage Messages",
    description: "Allows members to delete messages by other members or pin any message.",
    permission: Permissions.MANAGE_MESSAGES,
  },
  {
    name: "Connect",
    description: "Allows members to join voice channels and hear others.",
    permission: Permissions.CONNECT,
  },
  {
    name: "Speak",
    description:
      "Allows members to talk in voice channels. If this permission is disabled, members are default muted until somebody with the “Mute Members” permission un-mutes them.",
    permission: Permissions.SPEAK,
  },
  {
    name: "Video",
    description:
      "Allows members to share their video, screen share, or stream a game in this server.",
    permission: Permissions.VIDEO,
  },
  {
    name: "Mute Members",
    description: "Allows members to mute other members in voice channels for everyone.",
    permission: Permissions.MUTE_MEMBERS,
  },
  {
    name: "Deafen Members",
    description:
      "Allows members to deafen other members in voice channels, which means they won't be able to speak or hear others.",
    permission: Permissions.DEAFEN_MEMBERS,
  },
  {
    name: "Move Members",
    description:
      "Allows members to move other members between voice channels that the member with this permission has access to.",
    permission: Permissions.MOVE_MEMBERS,
  },
  {
    name: "Administrator",
    description:
      "Members with this permission will have every permission and will also bypass all channel specific permissions or restrictions (for example, these members would get access to all private channels). This is a dangerous permission to grant.",
    permission: Permissions.ADMINISTRATOR,
  },
];
