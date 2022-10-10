import { Message, MessageType } from "types/message";
import { MessageState } from "types/store.interfaces";

export function isSystemMessage(message: Message | MessageState) {
  return [MessageType.CHANNEL_PINNED_MESSAGE, MessageType.USER_JOIN].includes(message.type);
}

export function isChatMessage(message: Message | MessageState) {
  return [MessageType.DEFAULT, MessageType.REPLY].includes(message.type);
}
