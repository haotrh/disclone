import { Clickable, Tooltip } from "@app/common";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppSelector } from "@lib/hooks/redux";
import { selectServerRoles } from "@lib/store/selectors";
import { ServerService } from "@services/server.service";
import { decimalToRgb } from "@utils/colors";
import _ from "lodash";
import { AiOutlinePlus } from "react-icons/ai";
import { HiArrowLeft } from "react-icons/hi";
import { Role } from "types/server";
import { useServerRolesSettings } from "../ServerRolesSettingsContext";

const ServerRolesEditSidebarItem = ({ role }: { role: Role }) => {
  const { edit, setEdit } = useServerRolesSettings();

  return (
    <Clickable
      bg
      selected={role.id === edit}
      onClick={() => setEdit(role.id)}
      className="!text-header-primary px-2 py-2.5 flex items-center gap-2"
    >
      <div
        style={{ background: decimalToRgb(role.color) }}
        className="w-3 h-3 rounded-full flex-shrink-0"
      />
      <div className="text-[15px] leading-4 overflow-hidden overflow-ellipsis">{role.name}</div>
    </Clickable>
  );
};

const ServerRolesEditSidebar = () => {
  const { setEdit } = useServerRolesSettings();
  const { server } = useChannel();

  const roles = useAppSelector((state) => selectServerRoles(state, server?.id ?? ""));
  const defaultRole = useAppSelector((state) => state.roles[server?.id ?? ""]);

  const handleCreateRole = () => {
    server && ServerService.createRole(server.id);
  };

  return (
    <div style={{ flex: "0 0 232px" }} className="border-r border-divider flex flex-col min-w-0">
      <div className="pt-[60px] px-5 flex-center-between">
        <Clickable onClick={() => setEdit(null)} className="flex items-center font-semibold">
          <HiArrowLeft className="mr-2" size={18} /> BACK
        </Clickable>
        <Tooltip content="Create Role">
          <button onClick={handleCreateRole}>
            <AiOutlinePlus size={18} />
          </button>
        </Tooltip>
      </div>
      <div className="pt-8 space-y-0.5 flex-1 min-h-0">
        <div className="h-full pl-7 pr-3 pb-10 overflow-y-auto custom-scrollbar scrollbar-thin no-track space-y-0.5">
          {roles.map((role) => (
            <ServerRolesEditSidebarItem key={role.id} role={role} />
          ))}
          <ServerRolesEditSidebarItem role={defaultRole} />
        </div>
      </div>
    </div>
  );
};

export default ServerRolesEditSidebar;
