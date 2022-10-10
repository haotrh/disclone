import ChatMessage from "@app/chat/content/ChatMessage";
import { Button, Popover, Tooltip } from "@app/common";
import { useChannel } from "@contexts/ChannelContext";
import { ChannelService } from "@services/channel.service";
import { convertMessageToMessageState } from "@store/slices/messages.slice";
import { useQuery } from "@tanstack/react-query";
import { AiFillPushpin } from "react-icons/ai";

const PinMessagesModal = () => {
  const { channel } = useChannel();
  const { data: messages } = useQuery(["pinMessage", channel?.id], () =>
    channel ? ChannelService.getPinMessage(channel?.id) : null
  );

  return (
    <div
      className="w-[420px] bg-background-secondary rounded overflow-hidden shadow-lg shadow-background-tertiary
border border-background-secondary-alt max-h-[80vh] flex flex-col"
    >
      <div className="bg-background-tertiary p-3 text-lg font-medium flex-shrink-0">
        Pinned Messages
      </div>
      <div className="p-2 space-y-1 flex-1 min-h-0 overflow-auto custom-scrollbar scrollbar-thin">
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className="border rounded bg-background-primary border-background-tertiary p-2"
            >
              <ChatMessage
                className="!mt-0"
                readOnly
                groupStart
                message={convertMessageToMessageState(message)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

const PinShowButton = () => {
  return (
    <Popover lazyRender customStyling placement="bottom-start" content={<PinMessagesModal />}>
      <Tooltip content="Pin">
        <Button theme="blank">
          <AiFillPushpin size={24} />
        </Button>
      </Tooltip>
    </Popover>
  );
};

export default PinShowButton;
