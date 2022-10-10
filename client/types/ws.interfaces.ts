import { IErrorResponse } from "./api.interfaces";
import { Channel } from "./channel";
import { Message } from "./message";
import { CustomEmoji, Member, Role, Server } from "./server";
import { Relationship, User, UserSettings } from "./user";

interface WSResponse {
  ERROR: IErrorResponse;
  READY: {
    user: User;
    servers: Server[];
    settings: UserSettings;
    relationships: Relationship[];
    dmChannels: Channel[];
  };
  CHANNEL_CREATE: Channel;
  CHANNEL_UPDATE: Partial<Channel>;
  CHANNEL_DELETE: { id: string; serverId: string };
  SERVER_CREATE: Server;
  SERVER_UPDATE: Partial<Server> & Pick<Server, "id">;
  SERVER_DELETE: { id: string };
  SERVER_MEMBER_ADD: { member: Member; serverId: string };
  SERVER_MEMBER_REMOVE: { id: string; serverId: string };
  SERVER_MEMBER_UPDATE: {
    member: Partial<Member>;
    serverId: string;
    userId: string;
  };
  SERVER_MEMBER_ROLE_ADD: { serverId: string; userId: string; roleId: string };
  SERVER_MEMBER_ROLE_REMOVE: {
    serverId: string;
    userId: string;
    roleId: string;
  };
  SERVER_ROLE_CREATE: { role: Role; serverId: string };
  SERVER_ROLE_DELETE: { id: string; serverId: string };
  SERVER_ROLE_UPDATE: Partial<Role> & Pick<Role, "id">;
  MESSAGE_CREATE: Message;
  MESSAGE_UPDATE: Partial<Message> & Pick<Message, "id">;
  MESSAGE_DELETE: { id: string; channelId: string };
  USER_UPDATE: Partial<User> & Pick<User, "id">;
  USER_SETTINGS_UPDATE: Partial<UserSettings>;
  TYPING: { userId: string; serverId: string };
  EMOJI_CREATE: { serverId: string; emoji: CustomEmoji };
  EMOJI_UPDATE: Partial<CustomEmoji> & { id: string };
  EMOJI_DELETE: { serverId: string; emojiId: string };
  RELATIONSHIP_ADD: Relationship;
  RELATIONSHIP_REMOVE: { id: string };
}

export type WSResponseEventMap = {
  [event in keyof WSResponse]: (data: WSResponse[event]) => void;
};
