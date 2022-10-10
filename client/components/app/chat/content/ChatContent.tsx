import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppDispatch, useAppSelector } from "@lib/hooks/redux";
import { ChannelService } from "@lib/services/channel.service";
import { selectChannelMesasges } from "@lib/store/selectors";
import { updateChannel } from "@lib/store/slices/channels.slice";
import { addMessages } from "@lib/store/slices/messages.slice";
import { isChatMessage, isSystemMessage } from "@utils/message.util";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useRef } from "react";
import { LIMIT_MESSAGES_PER_API_CALL } from "types/api.interfaces";
import { MessageState } from "types/store.interfaces";
import ChannelWelcomeMessage from "./ChannelWelcomeMessage";
import ChatMessage from "./ChatMessage";
import ChatMessageSkeleton from "./ChatMessageSkeleton";
import MessageLoader from "./MessageLoader";
import UploadingMessage from "./UploadingMessage";

const isGroupStart = (message: MessageState, previousMessage: MessageState) => {
  return (
    !isSystemMessage(message) &&
    (message.author !== previousMessage.author ||
      moment(message.createdAt).diff(moment(previousMessage.createdAt), "minutes") >= 5 ||
      (isChatMessage(message) && isSystemMessage(previousMessage)))
  );
};

const isDateDifferent = (message: MessageState, previousMessage: MessageState) => {
  return (
    moment(message.createdAt)
      .startOf("day")
      .diff(moment(previousMessage.createdAt).startOf("day"), "days") >= 1
  );
};

const ChatDateDivider = React.memo(({ date }: { date: Date }) => (
  <div className="mt-4 mb-2 flex-center select-none h-0 border-t border-divider">
    <span className="bg-background-primary p-2 text-[13px] font-semibold text-text-muted">
      {moment(date).format("ll").toString()}
    </span>
  </div>
));

ChatDateDivider.displayName = "ChatDateDivider";

const ChatContent = () => {
  const { channel } = useChannel();
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => selectChannelMesasges(state, channel?.id ?? ""));
  const scrollToEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (async () => {
      if (channel && !channel?.firstLoadMessages) {
        try {
          const messages = (await ChannelService.getMessage(channel.id)).data;
          dispatch(addMessages({ channelId: channel.id, messages }));
          dispatch(
            updateChannel({
              id: channel.id,
              firstLoadMessages: true,
              seeFirstMessages: messages.length < LIMIT_MESSAGES_PER_API_CALL,
            })
          );
          scrollToEndRef.current?.scrollIntoView();
        } catch (e: any) {
          console.log(e.response);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id]);

  const sortedMessages: MessageState[] = useMemo(() => {
    if (messages) {
      return _.orderBy(_.values(messages), ["sending", "createdAt"], ["desc", "asc"]);
    } else {
      return [];
    }
  }, [messages]);

  return (
    <div
      style={{ overflowAnchor: "none" }}
      className="flex-1 flex-col-reverse flex min-h-0 justify-between overflow-x-hidden overflow-y-scroll custom-scrollbar mr-1 my-1 pr-1 "
    >
      <div className="px-4">
        {channel?.firstLoadMessages ? (
          <>
            {channel?.seeFirstMessages ? (
              <ChannelWelcomeMessage />
            ) : (
              <MessageLoader messageId={sortedMessages[0].id} fetchType="before" />
            )}
            {sortedMessages.map((message, i) => {
              const groupStart = i === 0 || isGroupStart(message, sortedMessages[i - 1]);
              const newDate = i === 0 || isDateDifferent(message, sortedMessages[i - 1]);
              return (
                <React.Fragment key={message.id}>
                  {newDate && <ChatDateDivider date={message.createdAt} />}
                  {message.sending && message.size ? (
                    <UploadingMessage message={message} />
                  ) : (
                    <ChatMessage groupStart={groupStart || newDate} message={message} />
                  )}
                </React.Fragment>
              );
            })}
            {/* {!channel.seeLastMessages &&
            _.range(5).map((i) => (
              <ChatMessageSkeleton key={`chatStartSkeleton${i}`} />
            ))} */}
          </>
        ) : (
          _.range(10).map((i) => <ChatMessageSkeleton key={i} />)
        )}
        <div ref={scrollToEndRef} className="h-px my-2" />
      </div>
    </div>
  );
};

export default ChatContent;
