import {
  ComboBox,
  LayerModalContent,
  LayerModalDescription,
  LayerModalHeader,
  Popover,
  SearchInput,
} from "@app/common";
import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { selectMembers, selectServerRoles } from "@store/selectors";
import { roleNameColorStyle } from "@utils/colors";
import React, { useMemo, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Role } from "types/server";
import MemberRow from "./MemberRow";

const MemberSettings = React.memo(() => {
  const { server } = useChannel();
  const [search, setSearch] = useState("");
  const everyoneRole = useAppSelector((state) => state.roles[server?.id ?? ""]);
  const [displayRole, setDisplayRole] = useState<Role>(everyoneRole);
  const roles = useAppSelector((state) => selectServerRoles(state, server?.id ?? ""));
  const members = useAppSelector((state) => selectMembers(state, server?.id ?? ""));
  const containerRef = useRef<HTMLDivElement>(null);
  const rolesWithEveryone = useMemo(() => [...roles, everyoneRole], [roles, everyoneRole]);

  const filterMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          (displayRole.id === server?.id || member.roles.includes(displayRole.id)) &&
          (member.nick?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            member.user.username?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            member.user.discrimination?.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      ),
    [displayRole, members, search, server?.id]
  );

  return (
    <LayerModalContent ref={containerRef}>
      <LayerModalHeader>Server Members</LayerModalHeader>
      <LayerModalDescription className="flex items-center justify-between">
        <div>
          {filterMembers.length === 0 ? "No" : filterMembers.length} Member
          {filterMembers.length > 1 && "s"}
        </div>
        <div className="flex items-center gap-2">
          <Popover
            customStyling
            placement="bottom-start"
            content={
              <ComboBox
                data={rolesWithEveryone}
                idKey="id"
                label="name"
                keyName="ServerMemberRoleSelectOption"
                onClick={(role) => setDisplayRole(role)}
                selectedData={displayRole}
                render={(role) => (
                  <div style={roleNameColorStyle(role.color)} className="py-1">
                    {role.name}
                  </div>
                )}
              />
            }
          >
            <div className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
              <div className="flex items-center gap-2">
                Display role:{" "}
                <span className="max-w-[80px] overflow-hidden inline-block overflow-ellipsis text-right">
                  {displayRole.name}
                </span>
              </div>
              <BsChevronDown className="text-header-primary" size={12} />
            </div>
          </Popover>
          <SearchInput
            inputClassName="!p-1"
            placeholder="Search"
            search={search}
            setSearch={setSearch}
          />
        </div>
      </LayerModalDescription>
      <div>
        {filterMembers.map((member) => (
          <MemberRow key={member.user.id} member={member} serverId={server?.id ?? ""} />
        ))}
      </div>
    </LayerModalContent>
  );
});

MemberSettings.displayName = "MemberSettings";

export default MemberSettings;
