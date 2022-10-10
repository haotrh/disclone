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

const PinMessageModal: React.FC = ({}) => {
  const { channel } = useChannel();
  const { close } = useModal();
  const { message } = useMessage();

  const handlePin = async () => {
    try {
      await close();
      ChannelService.pinMessage(channel?.id ?? "", message.id);
    } catch (e) {}
  };

  return (
    <ModalFormContainer>
      <ModalFormHeader>Pin It. Pin It Good.</ModalFormHeader>
      <ModalFormContent>
        <ModalFormDescription>
          Hey, just double checking that you want to pin this message to #{channel?.name} for
          posterity and greatness?
        </ModalFormDescription>
        <div className="mt-0 border border-background-secondary-alt shadow-md shadow-background-secondary-alt px-4 py-2 rounded">
          <div className="-mt-4  overflow-hidden">
            <ChatMessage readOnly={true} groupStart={true} message={message} />
          </div>
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button onClick={handlePin} grow size="medium" theme="primary">
          Oh yeah. Pin it.
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default PinMessageModal;
