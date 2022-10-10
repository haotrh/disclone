import { Avatar, Clickable, Popover } from "@app/common";
import MemberNameWithColor from "@app/common/MemberNameWithColor";
import ServerOwner from "@app/common/ServerOwner";
import ProfileInfo from "@app/user/ProfileInfo";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppSelector } from "@lib/hooks/redux";
import { selectMembersWithVisualRole } from "@lib/store/selectors";
import classNames from "classnames";
import _ from "lodash";
import React, { useMemo } from "react";
import { Member } from "types/server";

const MemberRow = ({ member }: { member: Member }) => {
  const { server } = useChannel();

  return (
    <Popover animation content={<ProfileInfo member={member} />} placement="left-start">
      <Clickable
        bg
        className={classNames("p-1.5 flex space-x-1.5 items-center", {
          "opacity-30 hover:opacity-100": member.user.status === "offline",
        })}
      >
        <Avatar noStatus={member.user.status === "offline"} user={member} />
        <div className="leading-4">
          <MemberNameWithColor member={member} serverId={server?.id} />
        </div>
        {server?.ownerId === member.user.id && <ServerOwner />}
      </Clickable>
    </Popover>
  );
};

const MemberSidebarGroup = ({ group, members }: { group: string; members: Member[] }) => {
  const role = useAppSelector((state) => state.roles[group]);
  const groupName = useMemo(() => {
    return role ? role.name : group.toUpperCase();
  }, [role, group]);

  return (
    <div className="mb-4">
      <div
        className="uppercase text-channels-default select-none font-semibold text-[13px]
      px-2 flex items-center"
      >
        <div className="min-w-0 overflow-hidden overflow-ellipsis">{groupName}</div>{" "}
        <div className="flex-shrink-0">&#8210; {members.length}</div>
      </div>
      {members.map((member) => (
        <MemberRow member={member} key={member.user.id} />
      ))}
    </div>
  );
};

const MemberSidebar: React.FC = () => {
  const { channel, server } = useChannel();
  const members = useAppSelector((state) => selectMembersWithVisualRole(state, server?.id ?? ""));

  const groupedMembers = useMemo(() => {
    return _.groupBy(
      _.orderBy(members, [(member) => member.user.status === "offline", "asc"]),
      (member) =>
        member.user.status === "offline"
          ? "offline"
          : member.visualRole
          ? member.visualRole.id
          : "online"
    );
  }, [members]);

  return (
    <>
      {channel?.showMember ? (
        <div className="w-60 bg-background-secondary flex-shrink-0 py-6 px-2 space-y-1">
          {_.keys(groupedMembers).map((group) => (
            <MemberSidebarGroup key={group} group={group} members={groupedMembers[group]} />
          ))}
        </div>
      ) : null}
    </>
  );
};

export default MemberSidebar;
