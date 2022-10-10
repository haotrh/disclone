import { useAppSelector } from "@hooks/redux";
import { selectMemberVisualRole } from "@store/selectors";
import { roleNameColorStyle } from "@utils/colors";
import React from "react";
import { Member } from "types/server";

interface MemberNameWithColorProps {
  member: Member;
  serverId?: string;
}

const MemberNameWithColor: React.FC<MemberNameWithColorProps> = React.memo(
  ({ member, serverId = "" }) => {
    const role = useAppSelector((state) =>
      selectMemberVisualRole(state, {
        serverId,
        userId: member.user.id,
      })
    );

    return (
      <span className="antialiased" style={roleNameColorStyle(role?.color)}>
        {member.nick ?? member.user.username}
      </span>
    );
  }
);

MemberNameWithColor.displayName = "MemberNameWithColor";

export default MemberNameWithColor;
