import {
  Button,
  ModalCancelButton,
  ModalFormContainer,
  ModalFormContent,
  ModalFormDescription,
  ModalFormFooter,
  ModalFormHeader,
} from "@app/common";
import { useModal } from "@app/common/modal/ModalContext";
import { useChannel } from "@lib/contexts/ChannelContext";
import { ChannelService } from "@lib/services/channel.service";
import React from "react";
import ChatMessage from "./ChatMessage";
import { useMessage } from "./MessageWrapper";

const DeleteMessageModal: React.FC = ({}) => {
  const { channel } = useChannel();
  const { close } = useModal();
  const { message } = useMessage();

  const onRemove = async () => {
    try {
      await close();
      ChannelService.deleteMessage(channel?.id ?? "", message.id);
    } catch (e) {}
  };

  return (
    <ModalFormContainer>
      <ModalFormHeader>Delete Message</ModalFormHeader>
      <ModalFormContent>
        <ModalFormDescription>Are you sure you want to delete this message?</ModalFormDescription>
        <div className="mt-0 border border-background-secondary-alt shadow-md shadow-background-secondary-alt px-4 py-2 rounded">
          <div className="-mt-4  overflow-hidden">
            <ChatMessage readOnly={true} groupStart={true} message={message} />
          </div>
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button onClick={onRemove} grow size="medium" theme="danger">
          Delete
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default DeleteMessageModal;
