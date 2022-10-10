import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppDispatch } from "@lib/hooks/redux";
import { ChannelService } from "@lib/services/channel.service";
import { updateChannel } from "@lib/store/slices/channels.slice";
import { addMessages } from "@lib/store/slices/messages.slice";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { LIMIT_MESSAGES_PER_API_CALL } from "types/api.interfaces";
import ChatMessageSkeleton from "./ChatMessageSkeleton";

interface MessageLoaderProps {
  messageId: string;
  fetchType: "before" | "after";
}

const MessageLoader = ({ messageId, fetchType }: MessageLoaderProps) => {
  const dispatch = useAppDispatch();
  const { channel } = useChannel();
  const [fetching, setFetching] = useState(false);

  const { ref, inView } = useInView({
    skip: fetching,
  });

  useEffect(() => {
    (async () => {
      if (inView && channel) {
        try {
          setFetching(true);
          const messages = (
            await ChannelService.getMessage(channel.id, {
              fetchType,
              messageId,
            })
          ).data;
          dispatch(addMessages({ channelId: channel.id, messages }));
          if (messages.length < LIMIT_MESSAGES_PER_API_CALL) {
            dispatch(
              updateChannel({
                id: channel.id,
                serverId: channel?.serverId ?? "",
                seeFirstMessages: true,
              })
            );
          } else {
            setFetching(false);
          }
        } catch (e: any) {
          console.log(e.response);
        } finally {
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref}>
      {_.range(5).map((i) => (
        <ChatMessageSkeleton key={i} />
      ))}
    </div>
  );
};

export default MessageLoader;
