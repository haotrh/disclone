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
import { useMessage } from "./MessageWrapper";
import ChatMessage from "./ChatMessage";

const UnpinMessageModal: React.FC = ({}) => {
  const { channel } = useChannel();
  const { close } = useModal();
  const { message } = useMessage();

  const hanldeUnpin = async () => {
    try {
      await close();
      ChannelService.unpinMessage(channel?.id ?? "", message.id);
    } catch (e) {}
  };

  return (
    <ModalFormContainer>
      <ModalFormHeader>Unpin Message</ModalFormHeader>
      <ModalFormContent>
        <ModalFormDescription>
          You sure you want to remove this pinned message?
        </ModalFormDescription>
        <div className="mt-0 border border-background-secondary-alt shadow-md shadow-background-secondary-alt px-4 py-2 rounded">
          <div className="-mt-4  overflow-hidden">
            <ChatMessage readOnly={true} groupStart={true} message={message} />
          </div>
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button onClick={hanldeUnpin} grow size="medium" theme="danger">
          Remove it please!
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default UnpinMessageModal;
