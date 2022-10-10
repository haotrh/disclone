import {
  Button,
  ModalFormContainer,
  ModalFormContent,
  ModalFormDescription,
  ModalFormFooter,
} from "@app/common";
import { useModal } from "@app/common/modal/ModalContext";
import { useChannel } from "@contexts/ChannelContext";
import useSubmit from "@hooks/useSubmit";
import { ServerService } from "@services/server.service";
import React from "react";
import { Role } from "types/server";

interface DeleteRoleFormProps {
  role: Role;
}

const DeleteRoleForm: React.FC<DeleteRoleFormProps> = ({ role }) => {
  const { server } = useChannel();
  const { close } = useModal();
  const { isSubmitting, handleSubmit } = useSubmit({
    onSubmit: () => {
      server && ServerService.deleteRole(server.id, role.id);
    },
    onSuccess: close,
  });

  return (
    <ModalFormContainer>
      <ModalFormContent>
        <div className="text-center">
          <h2 className="text-center text-header-primary font-semibold pt-7 pb-5">DELETE ROLE</h2>
          <ModalFormDescription>
            Are you sure you want to delete the{" "}
            <span className="font-semibold break-words">{role.name}</span> role? This action cannot
            be undone.
          </ModalFormDescription>
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <div className="flex w-full gap-2">
          <Button onClick={close} theme="secondary" size="large" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="large" className="flex-1" loading={isSubmitting}>
            Okay
          </Button>
        </div>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default DeleteRoleForm;
