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
import { useChannel } from "@contexts/ChannelContext";
import useSubmit from "@hooks/useSubmit";
import { ServerService } from "@services/server.service";
import { getMemberName } from "@utils/members";
import React, { useState } from "react";
import { Member, Role } from "types/server";

interface RemoveRoleMemberFormProps {
  member: Member;
  role: Role;
}

const RemoveRoleMemberForm: React.FC<RemoveRoleMemberFormProps> = ({ member, role }) => {
  const { server } = useChannel();
  const { close } = useModal();
  const { isSubmitting, handleSubmit } = useSubmit({
    onSubmit: () => {
      server && ServerService.removeRoleMember(server.id, role.id, member.user.id);
    },
    onSuccess: () => {
      close();
    },
  });

  return (
    <ModalFormContainer>
      <ModalFormHeader>Remove member</ModalFormHeader>
      <ModalFormContent>
        <div>
          Remove <span className="font-semibold">{getMemberName(member)}</span> from role{" "}
          <span className="font-semibold">{role.name}</span>
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          size="medium"
          theme="danger"
        >
          Remove
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default RemoveRoleMemberForm;
