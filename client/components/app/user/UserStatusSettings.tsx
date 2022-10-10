import { Divider, StatusIcon } from "@app/common";
import Clickable, { ClickableProps } from "@app/common/button/Clickable";
import { UserService } from "@services/user.service";
import { UserStatus } from "types/user";

interface UserStatusSettingsButtonProps extends ClickableProps {
  status: UserStatus;
  name: string;
  description?: string;
}

const UserStatusSettingsButton: React.FC<UserStatusSettingsButtonProps> = ({
  status,
  name,
  description,
  ...props
}) => {
  return (
    <Clickable {...props} theme="primary" type="popover">
      <div className="flex">
        <div className="w-6 h-5 flex items-center flex-shrink-0">
          <StatusIcon status={status} />
        </div>
        <div>
          <div>{name}</div>
          {description && <div className="text-xs">{description}</div>}
        </div>
      </div>
    </Clickable>
  );
};

const UserStatusSettings = () => {
  const handleUpdateStatus = (status: UserStatus) => {
    UserService.updateSettings({ status });
  };

  return (
    <div className="w-[220px] p-2">
      <UserStatusSettingsButton
        onClick={() => handleUpdateStatus("online")}
        status="online"
        name="Online"
      />
      <Divider />
      <UserStatusSettingsButton
        onClick={() => handleUpdateStatus("idle")}
        status="idle"
        name="Idle"
      />
      <UserStatusSettingsButton
        onClick={() => handleUpdateStatus("dnd")}
        status="dnd"
        name="Do Not Disturb"
        description="You will not receive any desktop notifications"
      />
      <UserStatusSettingsButton
        onClick={() => handleUpdateStatus("offline")}
        status="offline"
        name="Invisible"
        description="You will not appear online, but will have full access to all of Discord."
      />
    </div>
  );
};

export default UserStatusSettings;
