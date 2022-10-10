import {
  Button,
  ModalCancelButton,
  ModalFormContainer,
  ModalFormContent,
  ModalFormFooter,
  ModalFormHeader,
} from "@app/common";
import { useChannel } from "@contexts/ChannelContext";
import useSubmit from "@hooks/useSubmit";
import { ServerService } from "@services/server.service";
import { useRouter } from "next/router";
import React from "react";
import { ServerState } from "types/store.interfaces";

interface LeaveServerProps {
  server: ServerState;
}

const LeaveServer: React.FC<LeaveServerProps> = ({ server }) => {
  const { server: currentServer } = useChannel();
  const router = useRouter();

  const { isSubmitting, handleSubmit } = useSubmit({
    onSubmit: async () => {
      await ServerService.leaveServer(server.id);
      if (currentServer?.id === server.id) {
        router.push("/channels/@me");
      }
    },
  });

  return (
    <ModalFormContainer>
      <ModalFormHeader>Leave &apos;{server.name}&apos;</ModalFormHeader>
      <ModalFormContent>
        Are you sure you want to leave <span className="font-semibold">{server.name}</span>? You
        won&apos;t be able to rejoin this server unless you are re-invited.
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button onClick={handleSubmit} loading={isSubmitting} theme="danger" size="medium" grow>
          Leave Server
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default LeaveServer;
