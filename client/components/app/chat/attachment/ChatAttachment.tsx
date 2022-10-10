import { Clickable, ModalRender, Spoiler } from "@app/common";
import ImageWrapper from "@app/common/media/ImageWrapper";
import { RoundLoading } from "@components/common";
import { imageKitLoader, resizeChatImage } from "@utils/image";
import classNames from "classnames";
import filesize from "filesize";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { FcFile } from "react-icons/fc";
import { MdClose, MdOutlineFileDownload } from "react-icons/md";
import { Attachment } from "types/message";
import ChatImage from "../content/ChatImage";
import { useMessage } from "../content/MessageWrapper";
import RemoveAttachmentModal from "./RemoveAttachmentModal";

interface ChatAttachmentProps {
  attachment: Attachment;
}

const ChatAttachment: React.FC<ChatAttachmentProps> = ({ attachment }) => {
  const { message } = useMessage();
  const [loading, setLoading] = useState(attachment.contentType.includes("image"));

  const isImage = useMemo(() => {
    return attachment.contentType.includes("image");
  }, [attachment.contentType]);

  const removable = useMemo(() => {
    return (message.attachments?.length ?? 0) > 1 || message.content;
  }, [message.attachments, message.content]);

  return (
    <div className="my-1.5 flex">
      <div className="relative attachment">
        <Spoiler disabled={!attachment.spoiler || loading}>
          {isImage ? (
            <ChatImage
              imgHeight={attachment.height ?? 0}
              imgWidth={attachment.width ?? 0}
              src={attachment.url}
              alt={attachment.description}
              onLoad={() => {
                setLoading(false);
              }}
            />
          ) : (
            <div className="flex">
              <div className="p-2 bg-background-secondary border border-background-secondary-alt rounded flex items-center">
                <FcFile size={48} />
                <div>
                  <a className="link" href={attachment.url} download>
                    {attachment.fileName}
                  </a>
                  <div className="text-xs text-button-text-disabled">
                    {attachment.size ? filesize(attachment.size) : "Unknown size"}
                  </div>
                </div>
                <Clickable className="ml-1">
                  <a href={attachment.url} download>
                    <MdOutlineFileDownload size={24} />
                  </a>
                </Clickable>
              </div>
            </div>
          )}
        </Spoiler>
        {removable && (
          <ModalRender modal={<RemoveAttachmentModal attachment={attachment} />}>
            <Clickable className="absolute attachment-remove left-full top-0">
              <MdClose size={18} />
            </Clickable>
          </ModalRender>
        )}
      </div>
    </div>
  );
};

export default ChatAttachment;
