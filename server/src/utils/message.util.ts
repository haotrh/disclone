import {
  MessageType,
  Message,
} from 'src/modules/channel/entities/message.entity';

export function isSystemMessage(message: Message) {
  return [MessageType.CHANNEL_PINNED_MESSAGE, MessageType.USER_JOIN].includes(
    message.type,
  );
}

export function isChatMessage(message: Message) {
  return [MessageType.DEFAULT, MessageType.REPLY].includes(message.type);
}
