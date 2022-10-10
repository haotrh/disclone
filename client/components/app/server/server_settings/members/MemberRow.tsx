import { Avatar, Button, Clickable, ComboBox, Popover } from "@app/common";
import MemberNameWithColor from "@app/common/MemberNameWithColor";
import MenuWrapper from "@app/common/menu/MenuWrapper";
import PermissionWrapper from "@app/common/PermissionWrapper";
import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { ServerService } from "@services/server.service";
import { selectMemberRoles, selectServerRoles } from "@store/selectors";
import { decimalToRgb, hexIsLight } from "@utils/colors";
import { usernameWithDiscrimination } from "@utils/members";
import classNames from "classnames";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AiFillFlag } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { Permissions } from "types/permissions";
import { Member, Role } from "types/server";

interface RoleTagProps {
  role: Role;
  onRemove: () => any;
}

const RoleTag: React.FC<RoleTagProps> = ({ role, onRemove }) => {
  return (
    <div
      className="bg-background-secondary-alt rounded font-medium h-[22px] overflow-hidden
  px-2 py-1 text-[11px] leading-[14px] min-w-0 flex-nowrap flex gap-1 select-none overflow-ellipsis"
    >
      <div
        onClick={onRemove}
        className={classNames("w-3 h-3 rounded-full flex-center", {
          "text-black": hexIsLight(role.color.toString(16)),
          "text-white": hexIsLight(role.color.toString(16)),
        })}
        style={{ backgroundColor: decimalToRgb(role.color) }}
      >
        <MdClose className="opacity-0 hover:opacity-100" size={12} />
      </div>
      <div className="flex-1 min-w-0 overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
        {role.name}
      </div>
    </div>
  );
};

interface AddMemberRoleButtonProps {
  member: Member;
}

const AddMemberRoleButton: React.FC<AddMemberRoleButtonProps> = ({ member }) => {
  const { server } = useChannel();
  const roles = useAppSelector((state) => selectServerRoles(state, server?.id ?? ""));
  const availableRoles = useMemo(
    () => roles.filter((role) => !member.roles.includes(role.id)),
    [roles, member]
  );

  return (
    <PermissionWrapper permissions={Permissions.MANAGE_ROLES}>
      <Popover
        placement="bottom"
        content={
          <ComboBox
            placeholder="Role"
            data={availableRoles}
            idKey="id"
            label="name"
            keyName="AddMemberRoleButtonRole"
            onClick={(role) =>
              ServerService.addRoleMembers(server?.id ?? "", role.id, [member.user.id])
            }
            render={(role) => (
              <div className="flex gap-2 items-center min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: decimalToRgb(role.color) }}
                />
                <div className="flex-1 min-w-0 overflow-hidden overflow-ellipsis">{role.name}</div>
              </div>
            )}
          />
        }
      >
        <button
          className="bg-background-secondary-alt rounded font-medium h-[22px]
         p-1 text-sm flex gap-1 select-none flex-shrink-0"
        >
          <FiPlus />
        </button>
      </Popover>
    </PermissionWrapper>
  );
};

interface MemberRowProps {
  member: Member;
  serverId: string;
}

const MemberRow: React.FC<MemberRowProps> = React.memo(({ member, serverId }) => {
  const selectorData = useMemo(() => ({ serverId, userId: member.user.id }), [member, serverId]);
  const roles = useAppSelector((state) => selectMemberRoles(state, selectorData));
  const [numberOfDisplayedRoles, setNumberOfDisplayedRoles] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let length = 0;
    for (let i = 0; i < roles.length; i++) {
      length += roles[i].name.length;
      if (length > 20) {
        setNumberOfDisplayedRoles(i + 1);
        return;
      }
    }
    setNumberOfDisplayedRoles(roles.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex gap-4 items-center group border-b border-divider py-4 first:border-t">
      <Avatar noStatus size={40} user={member} />
      <div className="w-[180px]">
        <MemberNameWithColor member={member} serverId={serverId} />
        <div className="text-sm text-text-muted">@{usernameWithDiscrimination(member.user)}</div>
      </div>
      <div className="flex-1 flex gap-1 min-w-0 overflow-hidden relative" ref={containerRef}>
        {roles.slice(0, numberOfDisplayedRoles).map((role) => (
          <RoleTag
            key={role.id}
            role={role}
            onRemove={() => {
              ServerService.removeRoleMember(serverId, role.id, member.user.id);
            }}
          />
        ))}
        {numberOfDisplayedRoles < roles.length ? (
          <Popover
            content={
              <MenuWrapper>
                <div className="flex gap-2 items-center text-channels-default text-xs font-semibold select-none">
                  <AiFillFlag />
                  <div>ROLES</div>
                </div>
                <div className="flex flex-wrap mt-2 gap-1">
                  {roles.map((role) => (
                    <RoleTag
                      key={role.id}
                      role={role}
                      onRemove={() => {
                        ServerService.removeRoleMember(serverId, role.id, member.user.id);
                      }}
                    />
                  ))}
                  <AddMemberRoleButton member={member} />
                </div>
              </MenuWrapper>
            }
          >
            <button
              className="bg-background-secondary-alt rounded font-semibold h-[22px]
         px-2 text-[11px] flex gap-1 select-none flex-shrink-0 leading-[22px]"
            >
              +{roles.length - numberOfDisplayedRoles}
            </button>
          </Popover>
        ) : (
          <AddMemberRoleButton member={member} />
        )}
      </div>
      <Popover
        followCursor
        placement="bottom-start"
        content={
          <div className="p-1.5">
            <Clickable theme="primary" type="popover">
              asdasd
            </Clickable>
            <Clickable theme="primary" type="popover">
              asdasd
            </Clickable>
            <Clickable theme="primary" type="popover">
              asdasd
            </Clickable>
          </div>
        }
      >
        <Button theme="blank" className="opacity-0 group-hover:opacity-100 !duration-75">
          <BsThreeDotsVertical size={22} />
        </Button>
      </Popover>
    </div>
  );
});

MemberRow.displayName = "MemberRow";

export default MemberRow;
