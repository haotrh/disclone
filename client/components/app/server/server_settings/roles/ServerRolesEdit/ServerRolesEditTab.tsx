import Clickable, { ClickableProps } from "@app/common/button/Clickable";
import { useAppSelector } from "@hooks/redux";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useTab } from "@lib/contexts/TabContext";
import { selectMembersWithRole } from "@store/selectors";
import classNames from "classnames";
import _ from "lodash";
import { useMemo } from "react";
import { useServerRolesSettings } from "../ServerRolesSettingsContext";
import { RoleEditTabType } from "./ServerRolesEditContent";

interface ServerRolesEditTabButtonProps extends ClickableProps {
  selected: boolean;
}

const ServerRolesEditTabButton = ({
  selected,
  disabled,
  ...props
}: ServerRolesEditTabButtonProps) => (
  <Clickable
    disabled={disabled}
    {...props}
    className={classNames("pb-4 relative border-b-2 -mb-0.5 !rounded-none", {
      "border-indigo-400 !text-header-primary": selected,
      "border-transparent": !selected,
      "hover:border-primary hover:text-interactive-hover": !selected && !disabled,
    })}
  />
);

const ServerRolesEditTab: React.FC = () => {
  const { edit, role } = useServerRolesSettings();
  const { server } = useChannel();
  const { tab, setTab } = useTab<RoleEditTabType>();
  const isEveryoneRole = useMemo(() => {
    return edit === server?.id;
  }, [edit, server?.id]);
  const members = useAppSelector((state) =>
    selectMembersWithRole(state, {
      roleId: role?.id ?? "",
      serverId: server?.id ?? "",
    })
  );

  return (
    <div className="flex text-base font-medium space-x-6 border-b-2 border-divider w-full -mb-0.5">
      <ServerRolesEditTabButton
        disabled={isEveryoneRole}
        selected={tab === "display" && !isEveryoneRole}
        onClick={() => setTab("display")}
      >
        Display
      </ServerRolesEditTabButton>
      <ServerRolesEditTabButton
        selected={isEveryoneRole || tab === "permissions"}
        onClick={() => setTab("permissions")}
      >
        Permissions
      </ServerRolesEditTabButton>
      <ServerRolesEditTabButton
        disabled={isEveryoneRole}
        selected={tab === "manage_members" && !isEveryoneRole}
        onClick={() => setTab("manage_members")}
      >
        Manage Members ({members.length})
      </ServerRolesEditTabButton>
    </div>
  );
};

export default ServerRolesEditTab;
