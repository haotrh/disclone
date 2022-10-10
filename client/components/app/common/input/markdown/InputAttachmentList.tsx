import { NewMessageData } from "@app/chat/text_area/ChatForm";
import _ from "lodash";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import InputAttachment from "./InputAttachment";

interface InputAttachmentListProps {}

const InputAttachmentList: React.FC<InputAttachmentListProps> = ({}) => {
  const { control, watch, setValue, getValues } = useFormContext<NewMessageData>();
  const files = watch("files");
  const attachments = watch("attachments");
  const { remove, update: updateAttachment } = useFieldArray({
    name: "attachments",
    keyName: "none",
  });

  return (
    <>
      {attachments && files && !_.isEmpty(attachments) && (
        <div
          className="border-b border-background-modifier-selected flex min-w-0 overflow-x-auto
  overflow-y-hidden custom-scrollbar m-2 px-2 py-3 gap-6"
        >
          {attachments.map((attachment, index) => (
            <InputAttachment
              key={attachment.id}
              file={files[index]}
              attachment={attachment}
              onChange={(changes) => {
                updateAttachment(index, changes);
              }}
              onRemove={() => {
                remove(index);
                setValue(
                  "files",
                  getValues("files")?.filter((file, fileIndex) => index !== fileIndex)
                );
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default InputAttachmentList;
