import { StatusParser } from "@utils/statusParser";
import { UserStatus } from "types/user";
import Tooltip from "../tooltip/Tooltip";
import StatusRect from "./StatusRect";

interface StatusIconProps {
  size?: number;
  status: UserStatus;
  tooltip?: boolean;
}

const StatusIcon: React.FC<StatusIconProps> = ({
  size = 10,
  status,
  tooltip,
}) => {
  return (
    <Tooltip disabled={!tooltip} content={StatusParser(status)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <StatusRect coord={0} size={size} status={status} />
      </svg>
    </Tooltip>
  );
};

export default StatusIcon;
