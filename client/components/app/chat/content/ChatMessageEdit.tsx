import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppDispatch } from "@lib/hooks/redux";
import { ChannelService } from "@lib/services/channel.service";
import { updateMessage } from "@lib/store/slices/messages.slice";
import _ from "lodash";
import { KeyboardEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ChatTextArea from "../text_area/ChatTextArea";
import { useMessage } from "./MessageWrapper";

const ChatMessageEdit = () => {
  const { message, setEdit } = useMessage();
  const { channel } = useChannel();
  const dispatch = useAppDispatch();
  const methods = useForm<{ content: string }>({
    defaultValues: { content: message.content },
  });

  const onSubmit = methods.handleSubmit((data) => {
    if (!_.isEmpty(data.content)) {
      if (data.content !== message.content) {
        ChannelService.updateMessage(channel?.id ?? "", message.id, {
          content: data.content,
        }).then(() => {
          dispatch(
            updateMessage({
              channelId: channel?.id ?? "",
              id: message.id,
              content: data.content,
            })
          );
        });
      }
      setEdit(false);
    }
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setEdit(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div onKeyDown={handleKeyDown} className="w-full my-2">
        <ChatTextArea expressionProps={{ tabOnly: "emoji" }} onSubmit={onSubmit} />
        <div className="text-xs">
          escape to{" "}
          <span className="link" onClick={() => setEdit(false)}>
            cancel
          </span>{" "}
          • enter to{" "}
          <span className="link" onClick={onSubmit}>
            save
          </span>
        </div>
      </div>
    </FormProvider>
  );
};

export default ChatMessageEdit;
