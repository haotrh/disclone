import { getAvatarSrc } from "@utils/image";
import { StatusParser } from "@utils/statusParser";
import {
  SVG_MASK_AVATAR_ROUND_20,
  SVG_MASK_AVATAR_ROUND_24,
  SVG_MASK_AVATAR_ROUND_32,
  SVG_MASK_AVATAR_ROUND_40,
  SVG_MASK_AVATAR_ROUND_80,
} from "@utils/svgMask.constant";
import _ from "lodash";
import React, { useMemo } from "react";
import { FaDiscord } from "react-icons/fa";
import { UserStatus } from "types/user";
import Tooltip from "../tooltip/Tooltip";
import StatusRect from "./StatusRect";

export type AvatarSize = 24 | 32 | 40 | 80 | 100;

interface AvatarProps {
  src?: string;
  user?: any;
  size?: AvatarSize;
  status?: UserStatus;
  noStatus?: boolean;
  disableTooltip?: boolean;
}

const avatarImageMaskId: {
  [key in AvatarSize]: string;
} = {
  "24": SVG_MASK_AVATAR_ROUND_24,
  "32": SVG_MASK_AVATAR_ROUND_32,
  "40": SVG_MASK_AVATAR_ROUND_40,
  "80": SVG_MASK_AVATAR_ROUND_80,
  "100": SVG_MASK_AVATAR_ROUND_80,
};

const avatarStatusStats: {
  [key in AvatarSize]: {
    coord: number;
    size: number;
  };
} = {
  "24": {
    coord: 16,
    size: 8,
  },
  "32": {
    coord: 22,
    size: 10,
  },
  "40": {
    coord: 22,
    size: 10,
  },
  "80": {
    coord: 60,
    size: 16,
  },
  "100": {
    coord: 60,
    size: 16,
  },
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  user,
  status,
  noStatus,
  size = 32,
  disableTooltip,
}) => {
  const imageSrc = useMemo(() => {
    return src ?? user ? getAvatarSrc(user) : undefined;
  }, [src, user]);

  const userStatus: UserStatus | undefined = useMemo(() => {
    return noStatus ? undefined : status ?? user?.status ?? user?.user?.status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, noStatus]);

  return (
    <div className="relative">
      <svg role="none" style={{ width: size, height: size }} viewBox={`0 0 ${size} ${size}`}>
        <foreignObject
          x={0}
          y={0}
          width={size}
          height={size}
          mask={userStatus ? `url(#${avatarImageMaskId[size]})` : ""}
        >
          <div className="w-full h-full flex-center rounded-full overflow-hidden">
            {imageSrc ? (
              <div className="w-full h-full bg-black flex-center">
                <img
                  src={imageSrc}
                  alt="Avatar"
                  className="object-cover block pointer-events-none w-full h-full"
                />
              </div>
            ) : (
              <div className="bg-green-0 w-full h-full flex-center">
                <FaDiscord size="66%" className="text-white" />
              </div>
            )}
          </div>
        </foreignObject>
        {userStatus && (
          <Tooltip disabled={disableTooltip} content={StatusParser(userStatus)}>
            <g className="focus:outline-none">
              <StatusRect
                coord={avatarStatusStats[size].coord}
                size={avatarStatusStats[size].size}
                status={userStatus}
              />
            </g>
          </Tooltip>
        )}
      </svg>
    </div>
  );
};

export default Avatar;
