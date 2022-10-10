import { Channel } from 'src/modules/channel/entities/channel.entity';
import { Message } from 'src/modules/channel/entities/message.entity';
import { ReadState } from 'src/modules/channel/entities/readState.entity';
import { Emoji } from 'src/modules/emoji/entities/emoji.entity';
import { Member } from 'src/modules/server/entities/member.entity';
import { Role } from 'src/modules/server/entities/role.entity';
import { Server } from 'src/modules/server/entities/server.entity';
import { UserSettings } from 'src/modules/user/entities/user-settings.entity';
import { Relationship, User } from 'src/modules/user/entities/user.entity';
import { IErrorResponse } from './api.types';

export interface WSResponse {
  ERROR: IErrorResponse;
  READY: {
    user: User;
    servers: Server[];
    settings: UserSettings;
    readState: ReadState[];
    relationships: Relationship[];
    dmChannels: Channel[];
  };
  CHANNEL_CREATE: Channel;
  CHANNEL_UPDATE: Partial<Channel>;
  CHANNEL_DELETE: { id: string; serverId?: string };
  SERVER_CREATE: Server;
  SERVER_UPDATE: Partial<Server>;
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
  SERVER_ROLE_UPDATE: Partial<Role>;
  MESSAGE_CREATE: Message;
  MESSAGE_UPDATE: Partial<Message>;
  MESSAGE_DELETE: { id: string; channelId: string };
  USER_UPDATE: Partial<User> & Pick<User, 'id'>;
  USER_SETTINGS_UPDATE: Partial<UserSettings>;
  TYPING: { userId: string; serverId: string };
  EMOJI_CREATE: { serverId: string; emoji: Emoji };
  EMOJI_UPDATE: Partial<Emoji>;
  EMOJI_DELETE: { serverId: string; emojiId: string };
  RELATIONSHIP_ADD: Relationship;
  RELATIONSHIP_REMOVE: { id: string };
}

export type WSResponseEvent = keyof WSResponse;
