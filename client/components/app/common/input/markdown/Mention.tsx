import { Popover } from "@app/common/popover";
import ProfileInfo from "@app/user/ProfileInfo";
import { useAppSelector } from "@hooks/redux";
import { selectMember } from "@store/selectors";
import { getMemberName } from "@utils/members";
import { MENTION_REGEX } from "@utils/regex";
import classNames from "classnames";
import React, { useMemo } from "react";

interface MentionProps {
  userId: string;
  serverId: string;
  showNotfoundAsUnknown?: boolean;
  readOnly?: boolean;
}

const Mention: React.FC<MentionProps> = ({ userId, serverId, showNotfoundAsUnknown, readOnly }) => {
  const match = MENTION_REGEX.exec(userId);
  const memberData = useMemo(
    () => ({ id: match ? match[2] : userId, server: serverId }),
    [match, userId, serverId]
  );
  const member = useAppSelector((state) => selectMember(state, memberData));

  return (
    <Popover
      placement="right"
      animation
      disabled={readOnly || !member}
      content={<ProfileInfo member={member} />}
    >
      <span
        className={classNames(
          "px-0.5 rounded-[3px] bg-[hsla(235,85.6%,64.7%,0.3)] text-[rgb(222,224,252)]",
          "text-header-primary font-medium",
          {
            "cursor-pointer": !readOnly && member,
          }
        )}
      >
        {match?.[1] ??
          (member ? "@" + getMemberName(member) : showNotfoundAsUnknown ? "@Unknown User" : userId)}
      </span>
    </Popover>
  );
};

export default Mention;
