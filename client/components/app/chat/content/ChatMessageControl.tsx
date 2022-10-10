import { Tooltip } from "@app/common";
import Clickable, { ClickableProps } from "@app/common/button/Clickable";
import PermissionWrapper from "@app/common/PermissionWrapper";
import { useAppSelector } from "@hooks/redux";
import { isChatMessage } from "@utils/message.util";
import React from "react";
import { MdAddReaction, MdEdit } from "react-icons/md";
import { Permissions } from "types/permissions";
import ChatMessageMoreButton from "./ChatMessageMoreButton";
import { useMessage } from "./MessageWrapper";

interface ChatMessageControlButtonProps extends ClickableProps {
  tooltip: string;
}

export const ChatMessageControlButton = React.forwardRef<
  HTMLDivElement,
  ChatMessageControlButtonProps
>(({ tooltip, ...props }, ref) => (
  <Tooltip content={tooltip}>
    <Clickable
      ref={ref}
      {...props}
      className="w-8 h-8 hover:bg-background-modifier-hover transition-colors flex-center text-xl"
    />
  </Tooltip>
));

ChatMessageControlButton.displayName = "ChatMessageControlButton";

const ChatMessageControl = () => {
  const { setEdit, message } = useMessage();
  const me = useAppSelector((state) => state.me.user);

  return (
    <div
      className="absolute hidden group-hover:flex border border-background-tertiary overflow-hidden
      bg-background-secondary right-4 -top-0 -translate-y-1/2 rounded hover:shadow-lg transition-shadow"
    >
      <PermissionWrapper permissions={Permissions.ADD_REACTIONS}>
        <ChatMessageControlButton tooltip="Add Reaction">
          <MdAddReaction />
        </ChatMessageControlButton>
      </PermissionWrapper>
      {isChatMessage(message) && message.author === me?.id && (
        <ChatMessageControlButton tooltip="Edit" onClick={() => setEdit(true)}>
          <MdEdit />
        </ChatMessageControlButton>
      )}
      <ChatMessageMoreButton />
    </div>
  );
};

export default React.memo(ChatMessageControl);
