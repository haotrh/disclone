import {
  Avatar,
  Button,
  Clickable,
  IconText,
  ModalRender,
  Popover,
  SearchInput,
  Tooltip,
} from "@app/common";
import { AddRoleMemberForm } from "@app/server";
import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { selectMembersWithRole } from "@store/selectors";
import { getMemberName, usernameWithDiscrimination } from "@utils/members";
import _ from "lodash";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { MdGroup } from "react-icons/md";
import { useServerRolesSettings } from "../ServerRolesSettingsContext";
import RemoveRoleMemberForm from "./RemoveRoleMemberForm";

const RoleManageMembers = () => {
  const [search, setSearch] = useState("");
  const { edit, role } = useServerRolesSettings();
  const { server } = useChannel();
  const members = useAppSelector((state) =>
    selectMembersWithRole(state, {
      roleId: role?.id ?? "",
      serverId: server?.id ?? "",
    })
  );

  if (!edit || !role) {
    return null;
  }

  return (
    <div>
      <div className="flex gap-4 items-center mb-4">
        <SearchInput search={search} setSearch={setSearch} placeholder="Search Members" />
        <ModalRender modal={<AddRoleMemberForm role={role} />}>
          <Button grow size="small">
            Add Members
          </Button>
        </ModalRender>
      </div>
      <div>
        {_.isEmpty(members) && (
          <Clickable bg className="py-1">
            <IconText
              className="!gap-1"
              icon={<MdGroup size={24} />}
              text={
                <div className="text-sm font-semibold text-text-muted">
                  No members were found.{" "}
                  <ModalRender modal={<AddRoleMemberForm role={role} />}>
                    <span className="link font-semibold">Add members to this role.</span>
                  </ModalRender>
                </div>
              }
            />
          </Clickable>
        )}
        {members.map((member) => (
          <Clickable key={member.user.id} className="p-2 rounded flex justify-between" bg>
            <IconText
              icon={<Avatar user={member} />}
              text={
                <div className="flex gap-1 font-normal text-sm">
                  <div className="text-header-primary font-medium">{getMemberName(member)}</div>
                  <div className="text-text-muted">{usernameWithDiscrimination(member.user)}</div>
                </div>
              }
            />
            <ModalRender modal={<RemoveRoleMemberForm member={member} role={role} />}>
              <Tooltip content="Remove member">
                <Clickable>
                  <IoMdCloseCircle size={18} />
                </Clickable>
              </Tooltip>
            </ModalRender>
          </Clickable>
        ))}
      </div>
    </div>
  );
};

export default RoleManageMembers;
