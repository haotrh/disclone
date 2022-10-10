import MemberNameWrapper from "@components/common/MemberNameWrapper";
import { useChannel } from "@contexts/ChannelContext";
import { timestampToString } from "@utils/common.util";
import React from "react";
import { AiFillPushpin } from "react-icons/ai";
import { MessageType } from "types/message";
import { useMessage } from "./MessageWrapper";

const SystemMessage: React.FC = () => {
  const { message, messageAuthor } = useMessage();
  const { server } = useChannel();

  return (
    <>
      {message.type === MessageType.CHANNEL_PINNED_MESSAGE && (
        <>
          <div className="left-0 absolute flex-center w-[72px] h-6 text-channels-default">
            <AiFillPushpin size={20} />
          </div>
          <div className="text-channels-default relative pb-1">
            <MemberNameWrapper member={messageAuthor} serverId={server?.id} /> pinned{" "}
            <span className="text-header-primary font-medium">a message</span> to this channel. See
            all <span className="text-header-primary font-medium">pinned messages</span>.{" "}
            <span className="text-header-secondary text-xs cursor-default">
              {timestampToString(message.createdAt)}
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default SystemMessage;
