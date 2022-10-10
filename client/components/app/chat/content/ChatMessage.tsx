import { isSystemMessage } from "@utils/message.util";
import React from "react";
import { Member } from "types/server";
import { MessageState } from "types/store.interfaces";
import MessageWrapper from "./MessageWrapper";
import SystemMessage from "./SystemMessage";
import UserMessage from "./UserMessage";

interface ChatMessageProps {
  message: MessageState;
  groupStart?: boolean;
  readOnly?: boolean;
  author?: Member;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({ message, groupStart, readOnly, className }) => {
    return (
      <MessageWrapper
        className={className}
        message={message}
        groupStart={groupStart}
        readOnly={readOnly}
      >
        {isSystemMessage(message) ? <SystemMessage /> : <UserMessage />}
      </MessageWrapper>
    );
  }
);

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
