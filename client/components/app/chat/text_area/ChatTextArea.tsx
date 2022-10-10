import { MarkdownInput } from "@app/common";
import { MarkdownInputProps } from "@app/common/input/markdown/MarkdownInput";
import React, { KeyboardEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { NewMessageData } from "./ChatForm";

interface ChatTextAreaProps extends MarkdownInputProps {
  onSubmit: () => any;
  placeholder?: string;
  className?: string;
  handleAddFiles?: (files: FileList) => any;
}

const ChatTextArea: React.FC<ChatTextAreaProps> = ({
  onSubmit,
  placeholder,
  handleAddFiles,
  ...props
}) => {
  const { control } = useFormContext<NewMessageData>();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-full bg-channeltextarea-background rounded-lg">
      <Controller
        control={control}
        name="content"
        render={({ field: { value, onChange } }) => (
          <MarkdownInput
            {...props}
            onPaste={(e) => {
              if (handleAddFiles && e.clipboardData.files) {
                handleAddFiles(e.clipboardData.files);
              }
            }}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            onAddFiles={handleAddFiles}
          />
        )}
      />
    </form>
  );
};

export default ChatTextArea;
