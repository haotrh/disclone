import { Avatar, Clickable, Popover } from "@app/common";
import { ChannelService } from "@services/channel.service";
import { selectDmChannels } from "@store/selectors";
import { store } from "@store/store";
import { StatusParser } from "@utils/statusParser";
import { useRouter } from "next/router";
import React from "react";
import { IoChatbox } from "react-icons/io5";
import { User } from "types/user";
import FriendListItemContextMenu from "./FriendListItemContextMenu";
import FriendListMoreButton from "./FriendListMoreButton";
import UserListItem from "./UserListItem";

interface FriendListItemProps {
  user: User;
}

const FriendListItem: React.FC<FriendListItemProps> = ({ user }) => {
  const router = useRouter();
  const handleMessage = () => {
    const dmChannels = selectDmChannels(store.getState());
    const dmChannel = dmChannels.find((channel) =>
      channel.recipients?.some((recipient) => recipient === user.id)
    );
    if (dmChannel) {
      router.push(`/channels/@me/${dmChannel.id}`);
    } else {
      ChannelService.createDmChannel(user.id).then(({ data }) =>
        router.push(`/channels/@me/${data.id}`)
      );
    }
  };

  return (
    <Popover
      content={<FriendListItemContextMenu user={user} />}
      followCursor
      placement="bottom-start"
      isContextMenu
    >
      <UserListItem onClick={handleMessage}>
        <div className="flex items-center space-x-3">
          <Avatar disableTooltip size={32} user={user} />
          <div>
            <div className="text-white font-semibold text-[17px]">
              {user.username}
              <span className="text-header-secondary font-medium text-sm invisible group-hover:visible">
                #{user.discrimination}
              </span>
            </div>
            <div className="text-header-secondary font-medium text-sm">
              {StatusParser(user.status)}
            </div>
          </div>
        </div>
        <div className="flex space-x-3 z-50">
          <Clickable theme="row" onClick={handleMessage}>
            <IoChatbox size={18} />
          </Clickable>
          <FriendListMoreButton user={user} />
        </div>
      </UserListItem>
    </Popover>
  );
};

export default FriendListItem;
