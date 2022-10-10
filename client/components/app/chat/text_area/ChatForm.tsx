import useSendMessage from "@hooks/useSendMessage";
import { useChannel } from "@lib/contexts/ChannelContext";
import _ from "lodash";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { EitherOrBoth } from "types/common";
import { Embed } from "types/message";
import ChatTextArea from "./ChatTextArea";

export interface NewAttachment {
  fileName: string;
  description?: string;
  spoiler?: boolean;
  id: string | number;
}

interface MessageWithAttachments {
  files: File[];
  attachments: NewAttachment[];
}

interface MessageWithText {
  content: string;
}

export type NewMessageData = EitherOrBoth<MessageWithText, MessageWithAttachments> & {
  embed?: Embed;
};

const ChatForm: React.FC = ({}) => {
  const methods = useForm<NewMessageData>();
  const { channel } = useChannel();
  const handleSendMessage = useSendMessage();
  const { append } = useFieldArray({
    control: methods.control,
    name: "attachments",
    keyName: "none",
  });

  const onSubmit = methods.handleSubmit((data) => {
    handleSendMessage(data);
    methods.reset();
  });

  const handleAddFiles = (files: FileList) => {
    methods.setValue("files", [...(methods.getValues("files") ?? []), ...Array.from(files)]);
    append(
      Array.from(files).map((file) => ({
        fileName: file.name,
        id: _.uniqueId(),
      }))
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-4 mb-6 ">
        <ChatTextArea
          withAttachment
          withEmbed
          handleAddFiles={handleAddFiles}
          placeholder={`Message ${
            channel?.name ? "#" + channel?.name : "@" + channel?.recipients?.[0].username
          }`}
          onSubmit={onSubmit}
        />
      </div>
    </FormProvider>
  );
};

export default ChatForm;
