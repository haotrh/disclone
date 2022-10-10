import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppSelector } from "@lib/hooks/redux";
import { selectServerOrderChannels } from "@lib/store/selectors";
import { useScroll } from "framer-motion";
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import { ChannelType } from "types/channel";
import Sidebar from "../Sidebar";
import ChannelButton from "./channel_item/ChannelButton";
import ChannelCategory from "./channel_item/ChannelCategory";
import { ChannelDragProvider } from "./channel_item/ChannelDragContext";
import ChannelDraggable from "./channel_item/ChannelDraggable";
import SidebarHeader from "./sidebar_header/ServerSidebarHeader";

const ServerSidebar = () => {
  const { server, channel: selectedChannel } = useChannel();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: ref });

  const channels = useAppSelector((state) => selectServerOrderChannels(state, server?.id ?? ""));

  const visibleChannels = useMemo(() => {
    const channelsObj = _.keyBy(channels, "id");

    return channels
      .map((channel, index) => ({ ...channel, index }))
      .filter(
        (channel) =>
          channel.id === selectedChannel?.id ||
          !channel.parentId ||
          !channelsObj[channel.parentId].collapsed
      );
  }, [channels]);

  if (!server) return null;

  // useEffect(() => {
  //   if (ref.current) {
  //     ref.current.addEventListener("scroll", (e) => {
  //       setScrollPosition((e.target as HTMLDivElement)?.scrollTop ?? 0);
  //     });
  //   }
  // }, []);

  return (
    <Sidebar>
      <SidebarHeader scrollPosition={scrollY} />
      <ChannelDragProvider>
        <SimpleBar scrollableNodeProps={{ ref }} className="min-h-0 flex-1 z-30">
          <div className="pt-0.5 pb-1.5 relative">
            {server.splash && <div className="h-[87px]" />}
            {visibleChannels.map((channel) => (
              <ChannelDraggable index={channel.index} key={channel.id} channel={channel}>
                {channel.type === ChannelType.SERVER_CATEGORY ? (
                  <ChannelCategory channel={channel} />
                ) : (
                  <ChannelButton selected={channel.id === selectedChannel?.id} channel={channel} />
                )}
              </ChannelDraggable>
            ))}
          </div>
        </SimpleBar>
      </ChannelDragProvider>
    </Sidebar>
  );
};

export default ServerSidebar;
