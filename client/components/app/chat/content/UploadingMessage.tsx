import { ProgressBar } from "@app/common";
import fileSize from "filesize";
import React from "react";
import { FcFile } from "react-icons/fc";
import { MessageState } from "types/store.interfaces";

interface UploadingMessageProps {
  message: MessageState;
}

const UploadingMessage: React.FC<UploadingMessageProps> = ({ message }) => {
  return (
    <div className="flex mx-[50px] my-2 select-none">
      <div className="p-2 bg-background-secondary border border-background-secondary-alt rounded flex items-center">
        <FcFile size={48} />
        <div>
          <div className="text-header-primary">
            {message.uploadingAttachments?.length === 1
              ? message.uploadingAttachments[0].fileName
              : `Uploading ${message.uploadingAttachments?.length ?? 1} files`}{" "}
            - {fileSize(message.size ?? 0)}
          </div>
          <div className="text-xs text-button-text-disabled">
            {message.process === 100 ? (
              "Processing..."
            ) : (
              <ProgressBar value={message.process ?? 0} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadingMessage;
