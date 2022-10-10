import { Clickable, ModalRender, Popover } from "@app/common";
import PermissionWrapper from "@app/common/PermissionWrapper";
import { useAppSelector } from "@hooks/redux";
import { isChatMessage } from "@utils/message.util";
import React from "react";
import { AiFillPushpin } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { IoTrash } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { Permissions } from "types/permissions";
import { ChatMessageControlButton } from "./ChatMessageControl";
import DeleteMessageModal from "./DeleteMessageModal";
import { useMessage } from "./MessageWrapper";
import PinMessageModal from "./PinMessageModal";
import UnpinMessageModal from "./UnpinMessageModal";

const ChatMessageMoreButton = () => {
  const { setEdit, message } = useMessage();
  const me = useAppSelector((state) => state.me.user);

  return (
    <PermissionWrapper permissions={[Permissions.MANAGE_CHANNELS]} show={me?.id === message.author}>
      <Popover
        placement="left-start"
        content={
          <div className="p-1.5 w-[188px]">
            {isChatMessage(message) && (
              <>
                {me?.id === message.author && (
                  <Clickable theme="primary" type="popover" onClick={() => setEdit(true)}>
                    <div>Edit Message</div>
                    <MdEdit size={18} />
                  </Clickable>
                )}
                <PermissionWrapper permissions={Permissions.MANAGE_CHANNELS}>
                  {message.pinned ? (
                    <ModalRender modal={<UnpinMessageModal />}>
                      <Clickable theme="primary" type="popover">
                        <div>Unpin Message</div>
                        <AiFillPushpin size={18} />
                      </Clickable>
                    </ModalRender>
                  ) : (
                    <ModalRender modal={<PinMessageModal />}>
                      <Clickable theme="primary" type="popover">
                        <div>Pin Message</div>
                        <AiFillPushpin size={18} />
                      </Clickable>
                    </ModalRender>
                  )}
                </PermissionWrapper>
              </>
            )}
            {me?.id === message.author && (
              <ModalRender modal={<DeleteMessageModal />}>
                <Clickable theme="danger" type="popover">
                  <div>Delete Message</div>
                  <IoTrash size={18} />
                </Clickable>
              </ModalRender>
            )}
          </div>
        }
      >
        <ChatMessageControlButton tooltip="More">
          <BsThreeDots />
        </ChatMessageControlButton>
      </Popover>
    </PermissionWrapper>
  );
};

export default ChatMessageMoreButton;
