import { Avatar, Clickable, IconText } from "@app/common";
import { getMemberName, usernameWithDiscrimination } from "@utils/members";
import classNames from "classnames";
import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { Member } from "types/server";

interface MemberRowProps {
  member: Member;
  selected: boolean;
  onClick: (id: string, selected: boolean) => void;
}

const MemberRow: React.FC<MemberRowProps> = ({ member, selected, onClick }) => {
  return (
    <Clickable
      onClick={() => {
        onClick(member.user.id, selected);
      }}
      bg
      className="px-1.5 py-1 gap-1"
    >
      <div
        className={classNames(
          "w-[18px] h-[18px] rounded-md border flex-center transition flex-shrink-0",
          {
            "bg-primary border-transparent": selected,
            "border-button-text-disabled": !selected,
          }
        )}
      >
        {selected && <IoMdCheckmark color="white" size={18} />}
      </div>
      <IconText
        className="!gap-1"
        icon={<Avatar size={24} user={member} noStatus />}
        text={
          <div className="flex gap-2 font-normal text-sm">
            <div>{getMemberName(member)}</div>
            <div className="text-text-muted">
              {usernameWithDiscrimination(member.user)}
            </div>
          </div>
        }
      />
    </Clickable>
  );
};

export default MemberRow;
