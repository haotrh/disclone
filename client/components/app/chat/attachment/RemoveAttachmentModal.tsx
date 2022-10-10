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
import { Attachment } from "types/message";
import { useMessage } from "../content/MessageWrapper";

interface RemoveAttachmentModalProps {
  attachment: Attachment;
}

const RemoveAttachmentModal: React.FC<RemoveAttachmentModalProps> = ({ attachment }) => {
  const { channel } = useChannel();
  const { close } = useModal();
  const { message } = useMessage();

  const onRemove = async () => {
    if (channel) {
      try {
        const newAttachments =
          message.attachments?.filter(
            (messageAttachment) => messageAttachment.id !== attachment.id
          ) ?? [];
        await close();
        ChannelService.updateMessage(channel.id, message.id, {
          attachments: newAttachments,
        });
      } catch (e) {}
    }
  };

  return (
    <ModalFormContainer>
      <ModalFormHeader>Are you sure?</ModalFormHeader>
      <ModalFormContent>
        <ModalFormDescription>
          This will remove this attachment from this message permanently.
        </ModalFormDescription>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button onClick={onRemove} grow size="medium" theme="danger">
          Remove Attachment
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default RemoveAttachmentModal;
