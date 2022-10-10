import { Avatar, MarkdownRender } from "@app/common";
import MemberNameWrapper from "@components/common/MemberNameWrapper";
import { useChannel } from "@contexts/ChannelContext";
import { isUrlOnly, timestampToString } from "@utils/common.util";
import classNames from "classnames";
import moment from "moment";
import React, { useMemo } from "react";
import { Member } from "types/server";
import ChatAttachment from "../attachment/ChatAttachment";
import ChatEmbed from "../embed/ChatEmbed";
import ChatMessageEdit from "./ChatMessageEdit";
import { useMessage } from "./MessageWrapper";

const ChatMessageContent = () => {
  const { message, edit } = useMessage();
  const mediaOnly = useMemo(
    () =>
      message.embeds?.length === 1 &&
      isUrlOnly(message.content.trim()) &&
      (message.embeds[0].url === message.embeds[0].thumbnail?.url ??
        message.embeds[0].url === message.embeds[0].video?.url),
    [message]
  );

  return (
    <div
      className={classNames("flex flex-wrap whitespace-pre-line leading-6", {
        "opacity-40": message.sending,
      })}
    >
      {edit ? (
        <ChatMessageEdit />
      ) : (
        <>{!mediaOnly && <MarkdownRender id={message.id} text={message.content ?? ""} />}</>
      )}
    </div>
  );
};

const ChatMessageGroupStartHeader: React.FC<{ author?: Member }> = React.memo(({ author }) => {
  const { message, messageAuthor } = useMessage();
  const { server } = useChannel();

  return (
    <>
      <div className="absolute left-0 pl-4 pt-0.5">
        <Avatar noStatus user={author ?? messageAuthor} size={40} />
      </div>
      <div className="mb-1 flex font-medium space-x-2 items-center">
        <MemberNameWrapper serverId={server?.id ?? ""} member={author ?? messageAuthor} />
        <span className="text-header-secondary text-xs cursor-default">
          {timestampToString(message.createdAt)}
        </span>
      </div>
    </>
  );
});

ChatMessageGroupStartHeader.displayName = "ChatMessageGroupStartHeader";

interface UserMessageProps {
  author?: Member;
}

const UserMessage: React.FC<UserMessageProps> = ({ author }) => {
  const { groupStart, message } = useMessage();

  return (
    <>
      {!groupStart && (
        <div className="absolute left-0 pl-4 pt-0.5">
          <span className="text-[10px] font-medium cursor-default text-header-secondary hidden group-hover:block">
            {moment(message.createdAt).format("hh:mm A").toString()}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        {groupStart && <ChatMessageGroupStartHeader author={author} />}
        <ChatMessageContent />
        {message.attachments &&
          message.attachments.map((attachment) => (
            <ChatAttachment attachment={attachment} key={attachment.id} />
          ))}
        {message.embeds &&
          message.embeds.map((embed, i) => <ChatEmbed key={embed.title ?? "" + i} embed={embed} />)}
      </div>
    </>
  );
};

export default UserMessage;
