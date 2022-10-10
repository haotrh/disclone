import { Avatar } from "@app/common";
import LayerModalRender from "@app/common/modal/layer_modal/LayerModalRender";
import Popover from "@components/app/common/popover/Popover";
import { useAppSelector } from "@lib/hooks/redux";
import { IoMdSettings } from "react-icons/io";
import { MdHeadphones, MdMic } from "react-icons/md";
import UserStatusSettings from "../UserStatusSettings";
import UserSettings from "../user_settings/UserSettings";
import UserAreaButton from "./UserAreaButton";

const UserBar = () => {
  const me = useAppSelector((selector) => selector.me);

  return (
    <div className="border-t border-background-primary select-none flex-shrink-0">
      <div className="h-[52px] p-2 flex justify-between items-center bg-background-secondary-alt w-full">
        <div className="flex space-x-2 overflow-hidden">
          <Popover
            offset={[2, 16]}
            placement="top-start"
            content={<UserStatusSettings />}
          >
            <button>
              <Avatar
                user={me.user}
                status={me.settings?.status}
                disableTooltip
              />
            </button>
          </Popover>
          <div className="flex-1 overflow-hidden">
            <div
              className="text-sm font-semibold text-header-primary leading-4 whitespace-nowrap overflow-ellipsis
            overflow-hidden max-w-full"
            >
              {me?.user?.username}
            </div>
            <div className="text-xs font-medium text-header-secondary">
              #{me?.user?.discrimination}
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0">
          <UserAreaButton tooltip="Mute">
            <MdMic size={22} />
          </UserAreaButton>
          <UserAreaButton tooltip="Deafen">
            <MdHeadphones size={22} />
          </UserAreaButton>
          <LayerModalRender modal={<UserSettings />}>
            <UserAreaButton tooltip="User Settings">
              <IoMdSettings size={22} />
            </UserAreaButton>
          </LayerModalRender>
        </div>
      </div>
    </div>
  );
};

export default UserBar;
