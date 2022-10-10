import { Avatar, Button } from "@app/common";
import { useAppSelector } from "@hooks/redux";
import { ChannelService } from "@services/channel.service";
import { selectChannel } from "@store/selectors";
import _ from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { MdClose } from "react-icons/md";
import HomeSidebarItem from "./HomeSidebarItem";

interface DirectMessageItemProps {
  channelId: string;
}

const DirectMessageSkeleton = ({ index }: { index: number }) => {
  return (
    <div style={{ opacity: 1 - 0.1 * index }} className="flex space-x-2 px-2 mt-3 pr-10">
      <div className="w-8 h-8 rounded-full bg-background-primary"></div>
      <div className="flex-1 bg-background-primary my-1.5 rounded-full"></div>
    </div>
  );
};

export const DirectMessagePlaceholder = () => {
  return (
    <div className="space-y-2.5 pl-2">
      {_.range(0, 10).map((i) => (
        <DirectMessageSkeleton index={i} key={`DirectMessageSkeleton${i}`} />
      ))}
    </div>
  );
};

const DirectMessageItem: React.FC<DirectMessageItemProps> = ({ channelId }) => {
  const channel = useAppSelector((state) => selectChannel(state, channelId));
  const channels = useAppSelector((state) => state.channels);
  const router = useRouter();
  if (!channel) return null;

  return (
    <HomeSidebarItem
      className="flex items-center gap-2 w-full px-2 group"
      path={`/channels/@me/${channel.id}`}
    >
      <Avatar user={channel.recipients[0]} />
      <div className="flex-1">{channel.recipients[0]?.username}</div>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          ChannelService.deleteDmChannel(channelId).then(() => router.push("/channels/@me"));
        }}
        theme="blank"
        className="invisible group-hover:visible"
      >
        <MdClose size={20} />
      </Button>
    </HomeSidebarItem>
  );
};

export default DirectMessageItem;
