import {
  Button,
  ModalCancelButton,
  ModalFormContainer,
  ModalFormContent,
  ModalFormFooter,
  ModalFormHeader,
} from "@app/common";
import { useLayerModal } from "@app/common/modal/layer_modal/LayerModalContext";
import { useModal } from "@app/common/modal/ModalContext";
import { useChannel } from "@contexts/ChannelContext";
import useSubmit from "@hooks/useSubmit";
import { ChannelService } from "@services/channel.service";
import { useRouter } from "next/router";
import React from "react";
import { Channel } from "types/channel";
import { ChannelState } from "types/store.interfaces";

interface DeleteChannelFormProps {
  channel: ChannelState;
}

const DeleteChannelForm: React.FC<DeleteChannelFormProps> = ({ channel: deleteChannel }) => {
  const { channel } = useChannel();
  const router = useRouter();
  const { closeModal } = useLayerModal();

  const { isSubmitting, handleSubmit } = useSubmit({
    onSubmit: async () => {
      await ChannelService.deleteChannel(deleteChannel.id);
      if (channel?.id === deleteChannel.id) {
        router.push("/channels/" + channel.serverId);
      }
      closeModal();
    },
  });

  return (
    <ModalFormContainer>
      <ModalFormHeader>Delete Channel</ModalFormHeader>
      <ModalFormContent>
        Are you sure you want to delete <span className="font-semibold">#{channel?.name}</span>?
        This cannot be undone.
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button onClick={handleSubmit} loading={isSubmitting} theme="danger" size="medium" grow>
          Delete Channel
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default DeleteChannelForm;
