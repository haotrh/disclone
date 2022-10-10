import { avatarStatusMaskId } from "@utils/svgMask.constant";
import classNames from "classnames";
import { UserStatus } from "types/user";

interface StatusRectProps {
  coord: number;
  size: number;
  status: UserStatus;
}

const StatusRect: React.FC<StatusRectProps> = ({ coord, size, status }) => {
  return (
    <rect
      x={coord}
      y={coord}
      width={size}
      height={size}
      mask={`url(#${avatarStatusMaskId[status]})`}
      className={classNames({
        "fill-status-online": status === "online",
        "fill-status-idle": status === "idle",
        "fill-status-dnd": status === "dnd",
        "fill-status-offline": status === "offline",
      })}
    ></rect>
  );
};

export default StatusRect;
