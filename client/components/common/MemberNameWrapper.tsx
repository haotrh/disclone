import { Popover } from "@app/common";
import ProfileInfo from "@app/user/ProfileInfo";
import { useAppSelector } from "@hooks/redux";
import { selectMemberVisualRole } from "@store/selectors";
import { decimalToRgb } from "@utils/colors";
import { getMemberName } from "@utils/members";
import React from "react";
import { Member } from "types/server";

interface MemberNameWrapperProps {
  member: Member;
  serverId?: string;
}

const MemberNameWrapper: React.FC<MemberNameWrapperProps> = ({ member, serverId = "" }) => {
  const role = useAppSelector((state) =>
    selectMemberVisualRole(state, {
      serverId,
      userId: member?.user?.id ?? "",
    })
  );

  return (
    <Popover customStyling animation placement="right" content={<ProfileInfo member={member} />}>
      <span
        style={role ? { color: decimalToRgb(role.color) } : {}}
        className="text-header-primary cursor-pointer hover:underline"
      >
        {getMemberName(member)}
      </span>
    </Popover>
  );
};

export default MemberNameWrapper;
