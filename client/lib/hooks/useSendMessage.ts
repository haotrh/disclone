import { NewMessageData } from "@app/chat/text_area/ChatForm";
import { useChannel } from "@contexts/ChannelContext";
import { ChannelService } from "@services/channel.service";
import { addSendingMessage, updateMessage } from "@store/slices/messages.slice";
import { CustomFormData } from "@utils/customFormData";
import _ from "lodash";
import { Message, MessageType } from "types/message";
import { MessageState } from "types/store.interfaces";
import { useAppDispatch, useAppSelector } from "./redux";

function useSendMessage() {
  const me = useAppSelector((state) => state.me.user);
  const dispatch = useAppDispatch();
  const { channel } = useChannel();

  const handleSendMessage = async (data: NewMessageData) => {
    if (!channel) return;
    if (data.content) {
      data.content = data.content.trim();
      if (_.isEmpty(data.content.trim())) return;
    }
    try {
      if (!_.isEmpty(data.files) || data.content || data.embed) {
        const nonce = _.uniqueId();
        const content = data.content ?? "";
        const embed = data.embed;
        const sendingMessage: MessageState = {
          content,
          author: me?.id ?? "",
          type: MessageType.DEFAULT,
          channelId: channel?.id ?? "",
          createdAt: new Date(),
          id: nonce,
          sending: true,
        };
        let sendData: Partial<Message> | CustomFormData;
        if (data.files) {
          const formData = new CustomFormData();
          Array.from(data.files).forEach((file) => formData.append("files", file));
          const attachments = data.attachments.map((attachment, index) => ({
            description: attachment.description,
            fileName: attachment.fileName,
            id: index,
            spoiler: attachment.spoiler,
          }));
          formData.dataAppend("attachments", attachments);
          formData.dataAppend("content", data.content);
          formData.dataAppend("nonce", nonce);
          if (embed) {
            formData.dataAppend("embeds", [embed]);
          }
          sendingMessage.uploadingAttachments = attachments;
          sendingMessage.process = 0;
          sendingMessage.size =
            data.files?.reduce((prev, curr) => {
              return prev + curr.size;
            }, 0) ?? 0;
          sendData = formData.data();
        } else {
          sendData = { nonce, content };
          if (embed) {
            sendData.embeds = [embed];
          }
        }
        ChannelService.createMessage(
          channel.id,
          sendData,
          data.files
            ? (progressEvent) => {
                let percentComplete = Math.floor(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                dispatch(
                  updateMessage({
                    channelId: channel.id,
                    id: nonce,
                    process: percentComplete,
                  })
                );
              }
            : undefined
        );
        dispatch(addSendingMessage(sendingMessage));
      }
    } catch (e: any) {
      console.log(e?.response ?? e);
    }
  };

  return handleSendMessage;
}

export default useSendMessage;
