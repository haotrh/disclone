import { NewAttachment } from "@app/chat/text_area/ChatForm";
import { Channel } from "./channel";
import { Message } from "./message";
import { Server, Member } from "./server";

export interface ServerState extends Omit<Server, "channels" | "roles" | "emojis"> {
  currentInviteCode?: string;
  fetchMembers?: boolean;
  roles: string[];
  channels: string[];
}

export interface MemberState extends Omit<Member, "user"> {
  user: string;
}

export interface ChannelState extends Omit<Channel, "recipients"> {
  firstLoadMessages: boolean;
  seeFirstMessages: boolean;
  seeLastMessages: boolean;
  showMember: boolean;
  collapsed?: boolean;
  recipients?: string[];
}

export interface MessageState extends Omit<Message, "author" | "mentions"> {
  author: string;
  sending?: boolean;
  fail?: boolean;
  process?: number;
  size?: number;
  uploadingAttachments?: NewAttachment[];
  mentions?: string[];
}
