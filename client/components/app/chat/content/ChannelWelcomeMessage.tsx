import { Avatar } from "@app/common";
import { useChannel } from "@lib/contexts/ChannelContext";
import React from "react";
import { ChannelType } from "types/channel";

const ChannelWelcomeMessage = () => {
  const { channel } = useChannel();

  return (
    <div className="my-4 select-none space-y-2">
      {channel?.type === ChannelType.DM ? (
        <Avatar user={channel.recipients[0]} noStatus size={80} />
      ) : (
        <div className="mt-2 w-16 h-16 rounded-full bg-button-secondary-normal flex-center font-medium text-5xl text-white">
          #
        </div>
      )}
      <div className="text-header-primary text-4xl font-bold">
        {channel?.type === ChannelType.DM
          ? channel.recipients[0].username
          : `Welcome to #${channel?.name!}`}
      </div>
      <div className="text-header-secondary">
        {channel?.type === ChannelType.DM ? (
          <>
            This is the beginning of your direct message history with{" "}
            <strong>@{channel.recipients[0].username}</strong>.
          </>
        ) : (
          `This is the start of the #${channel?.name} channel.`
        )}
      </div>
    </div>
  );
};

export default ChannelWelcomeMessage;
