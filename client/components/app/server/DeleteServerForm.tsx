import {
  Button,
  Input,
  ModalCancelButton,
  ModalCloseButton,
  ModalFormContainer,
  ModalFormContent,
  ModalFormFooter,
  ModalFormHeader,
} from "@app/common";
import { useLayerModal } from "@app/common/modal/layer_modal/LayerModalContext";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppDispatch } from "@lib/hooks/redux";
import { ServerService } from "@lib/services/server.service";
import { deleteServer } from "@lib/store/slices/servers.slice";
import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";

const DeleteServerForm = () => {
  const { server } = useChannel();
  const [serverName, setServerName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { closeModal } = useLayerModal();

  const onDelete = async () => {
    if (!server) return;
    setLoading(true);
    try {
      await ServerService.deleteServer(server.id);
      router.push("/channels/@me").then(() => {
        dispatch(deleteServer({ id: server.id }));
        closeModal();
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ModalFormContainer>
      <ModalCloseButton />
      <ModalFormHeader>Delete &apos;{server?.name}&apos;</ModalFormHeader>
      <ModalFormContent>
        <div className="p-3 bg-amber-500 text-white rounded-md mb-6">
          Are you sure you want to delete <span className="font-bold">{server?.name}</span>? This
          action cannot be undone.
        </div>
        <div>
          <Input
            label="ENTER SERVER NAME"
            value={serverName}
            onChange={(e) => setServerName((e.target as HTMLInputElement).value)}
          />
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button
          loading={loading}
          disabled={!_.isEqual(serverName, server?.name)}
          theme="danger"
          grow
          size="medium"
          onClick={onDelete}
        >
          Delete Server
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default DeleteServerForm;
