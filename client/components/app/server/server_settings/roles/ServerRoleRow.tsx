import {
  Button,
  CircleButton,
  Clickable,
  Divider,
  ModalRender,
  Popover,
  Tooltip,
} from "@app/common";
import { ClickableProps } from "@app/common/button/Clickable";
import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { selectMembersWithRole } from "@store/selectors";
import { decimalToRgb } from "@utils/colors";
import classNames from "classnames";
import React, { DragEvent, HTMLProps, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { IoTrash } from "react-icons/io5";
import { MdEdit, MdOutlineDragIndicator, MdPerson } from "react-icons/md";
import { RiShieldUserFill } from "react-icons/ri";
import { Role } from "types/server";
import { ServerState } from "types/store.interfaces";
import DeleteRoleForm from "./DeleteRoleForm";
import { useRoleDrag } from "./RoleDragContext";
import { useServerRolesSettings } from "./ServerRolesSettingsContext";

interface ServerRoleRowProps extends Omit<ClickableProps, "role"> {
  role: Role;
  index: number;
}

export const RoleRow = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    className={classNames(
      "flex items-center border-b border-divider text-header-secondary -mb-px",
      className
    )}
  />
);
export const RoleNameCol = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div {...props} style={{ flex: "0 1 273px" }} className={classNames(className)} />
);
export const MemberCol = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    style={{ flex: "0 0 112px" }}
    className={classNames(className, "mr-4 flex justify-end items-center")}
  />
);
export const ButtonCol = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    style={{ flex: "1 0 88px" }}
    className={classNames(className, "mr-4 flex justify-end items-center")}
  />
);

export const RoleContainer = ({
  role,
  size = "large",
}: {
  role: Role;
  size?: "small" | "large";
}) => (
  <div
    className={classNames("flex items-center", {
      "gap-1": size === "small",
      "gap-2.5": size === "large",
    })}
  >
    <RiShieldUserFill
      className="flex-shrink-0"
      color={decimalToRgb(role.color)}
      size={size === "small" ? 20 : 24}
    />
    <div className="leading-4 overflow-hidden overflow-ellipsis">{role.name}</div>
  </div>
);

const MemberColContent = ({ role, server }: { role: Role; server: ServerState }) => {
  const members = useAppSelector((state) =>
    selectMembersWithRole(state, {
      roleId: role.id,
      serverId: server.id,
    })
  );

  return (
    <Tooltip content="View members" placement="right">
      <div className="flex">
        <div className="mr-1">{members.length}</div>
        <MdPerson size={20} />
      </div>
    </Tooltip>
  );
};

const ServerRoleRow: React.FC<ServerRoleRowProps> = ({ role, index, className, ...props }) => {
  const { setEdit } = useServerRolesSettings();
  const { server } = useChannel();
  const [allowDrag, setAllowDrag] = useState(false);
  const { setDrag, drag, target, setTarget } = useRoleDrag();
  const { getValues, setValue } = useFormContext<{ roles: Role[] }>();

  const isTarget = useMemo(() => {
    return target?.index === index;
  }, [target, index]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (!allowDrag) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setDrag({ index, role });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (drag?.index !== index) {
      e.stopPropagation();
      e.preventDefault();
      if (target?.index !== index) {
        setTarget({ index, role });
      }
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (isTarget && target?.index === index) {
      setTarget(undefined);
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDrag(undefined);
    setTarget(undefined);
    if (allowDrag) {
      setAllowDrag(false);
    }
  };

  const handleDragDrop = (e: DragEvent<HTMLDivElement>) => {
    if (drag && target) {
      const oldRoles = getValues("roles");

      if (drag.index < target.index) {
        oldRoles.splice(target.index + 1, 0, drag.role);
        oldRoles.splice(drag.index, 1);
      } else {
        oldRoles.splice(target.index, 0, drag.role);
        oldRoles.splice(drag.index + 1, 1);
      }

      setValue("roles", oldRoles, { shouldDirty: true });
    }
  };

  return useMemo(
    () => (
      <Clickable
        {...props}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDragDrop}
        onDragLeave={handleDragLeave}
        bg
        onClick={() => setEdit(role.id)}
        className={classNames(className, "-ml-8 flex group relative", { drop: drag })}
      >
        {isTarget && (
          <div
            className={classNames(
              "absolute bottom-full left-0 w-full h-1 bg-green-600 rounded-full mx-8",
              {
                "top-full": drag && index > drag.index,
                "bottom-full": drag && index < drag.index,
              }
            )}
          />
        )}
        <Button
          onMouseDown={() => {
            setAllowDrag(true);
          }}
          theme="blank"
          className="w-8 invisible group-hover:visible"
        >
          <MdOutlineDragIndicator size={20} />
        </Button>
        <RoleRow className="py-4 flex-1 min-w-0">
          <RoleNameCol className="text-header-primary min-w-0">
            <RoleContainer role={role} />
          </RoleNameCol>
          <MemberCol>{server && <MemberColContent server={server} role={role} />}</MemberCol>
          <ButtonCol className="gap-3">
            <CircleButton
              tooltip="Edit"
              onClick={() => setEdit(role.id)}
              className="hidden group-hover:block"
            >
              <MdEdit />
            </CircleButton>
            <Popover
              content={
                <div className="p-1.5">
                  <Clickable
                    theme="primary"
                    type="popover"
                    className="py-1.5 px-2 rounded flex-center-between"
                  >
                    <div>View Server As Role</div>
                    <AiOutlineArrowRight size={17} />
                  </Clickable>
                  <Divider className="mx-1.5" spacing="xs" />
                  <ModalRender modal={<DeleteRoleForm role={role} />}>
                    <Clickable type="popover" theme="danger">
                      <div>Delete</div>
                      <IoTrash size={17} />
                    </Clickable>
                  </ModalRender>
                </div>
              }
              followCursor
              placement="right-start"
            >
              <CircleButton tooltip="More">
                <BsThreeDots />
              </CircleButton>
            </Popover>
          </ButtonCol>
        </RoleRow>
      </Clickable>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTarget, role, index, server, allowDrag, drag]
  );
};

export default ServerRoleRow;
