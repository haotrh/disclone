import {
  Button,
  Input,
  Label,
  ModalCancelButton,
  ModalFormContainer,
  ModalFormContent,
} from "@app/common";
import { useModal } from "@app/common/modal/ModalContext";
import ModalFormFooter from "@app/common/modal/modal_form/ModalFormFooter";
import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { ServerService } from "@services/server.service";
import { selectMembersWithoutRole } from "@store/selectors";
import React, { useState } from "react";
import { Role } from "types/server";
import { RoleContainer } from "../server_settings/roles/ServerRolesTable";
import MemberRow from "./MemberRow";

interface AddRoleMemberFormProps {
  role: Role;
}

const AddRoleMemberForm: React.FC<AddRoleMemberFormProps> = ({ role }) => {
  const { server } = useChannel();
  const members = useAppSelector((state) =>
    selectMembersWithoutRole(state, { serverId: server?.id ?? "", roleId: role.id })
  );
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { close } = useModal();

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedMembers(
      checked ? selectedMembers.filter((member) => member !== id) : [...selectedMembers, id]
    );
  };

  const handleSubmit = () => {
    if (!server) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    ServerService.addRoleMembers(server.id, role.id, selectedMembers).then(() => {
      setIsSubmitting(false);
      close();
    });
  };

  return (
    <ModalFormContainer>
      <ModalFormContent>
        <div className="text-center pt-6">
          <h1 className="text-header-primary font-semibold text-[26px] my-2">Add members</h1>
          <div className="flex-center text-header-secondary">
            <RoleContainer size="small" role={role} />
          </div>
        </div>
        <Input placeholder="Search members" />
        <div className="h-[280px] overflow-y-auto custom-scrollbar">
          <Label>Members</Label>
          {members.map((member) => (
            <MemberRow
              onClick={handleSelect}
              selected={selectedMembers.includes(member.user.id)}
              key={member.user.id}
              member={member}
            />
          ))}
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <ModalCancelButton />
        <Button onClick={handleSubmit} loading={isSubmitting} size="medium">
          Add
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default AddRoleMemberForm;
