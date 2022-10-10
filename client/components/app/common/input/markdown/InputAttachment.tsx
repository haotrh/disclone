import { ModalRender, Spoiler, Tooltip } from "@app/common";
import classNames from "classnames";
import React, { HTMLAttributes, useState } from "react";
import { FcFile } from "react-icons/fc";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import EditAttachmentModal from "./EditAttachmentModal";

export interface NewAttachment {
  fileName: string;
  description?: string;
  spoiler?: boolean;
  id: string | number;
}

interface InputAttachmentProps {
  file: File;
  attachment: NewAttachment;
  onRemove: () => any;
  onChange: (changes: NewAttachment) => any;
}

interface AttachmentButtonProps extends HTMLAttributes<HTMLButtonElement> {
  tooltip: string;
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({ tooltip, className, ...props }) => (
  <Tooltip content={tooltip}>
    <button
      type="button"
      {...props}
      className={classNames(
        "p-1.5 bg-background-primary flex-center hover:bg-background-modifier-hover",
        "active:bg-background-modifier-active w-8 h-8 text-interactive-normal group",
        className
      )}
    >
      <div className="group-active:translate-y-0.5">{props.children}</div>
    </button>
  </Tooltip>
);

const InputAttachment: React.FC<InputAttachmentProps> = ({
  file,
  attachment,
  onRemove,
  onChange,
}) => {
  const [imageBlob] = useState(URL.createObjectURL(file));

  return (
    <div
      className="bg-background-secondary p-2 w-[216px] h-[216px] rounded-md flex-shrink-0
    relative flex flex-col gap-2 select-none"
    >
      <div
        className="-right-6 -top-2 absolute z-30 flex transition-shadow hover:shadow-lg bg-background-primary
      rounded overflow-hidden"
      >
        <AttachmentButton
          tooltip="Spoiler Attachment"
          onClick={() => {
            onChange({ ...attachment, spoiler: !attachment.spoiler });
          }}
        >
          {attachment.spoiler ? <IoMdEyeOff size="100%" /> : <IoMdEye size="100%" />}
        </AttachmentButton>
        <ModalRender modal={<EditAttachmentModal attachment={attachment} onChange={onChange} />}>
          <AttachmentButton tooltip="Modify Attachment">
            <MdEdit size="100%" />
          </AttachmentButton>
        </ModalRender>
        <AttachmentButton
          tooltip="Remove Attachment"
          className="text-button-danger-normal"
          onClick={onRemove}
        >
          <RiDeleteBin5Fill size="100%" />
        </AttachmentButton>
      </div>
      <div className="flex-1 min-h-0 min-w-0 flex-center mt-auto relative">
        {file.type.includes("image") ? (
          <Spoiler disabled={!attachment.spoiler}>
            <img className="max-h-full rounded" src={imageBlob} alt="" />
          </Spoiler>
        ) : (
          <>
            {attachment.spoiler && (
              <div
                className="absolute top-0 left-0 text-[10px] leading-[10px] p-1 font-semibold rounded bg-interactive-normal mt-2
            text-black"
              >
                SPOILER
              </div>
            )}
            <FcFile size="60%" />
          </>
        )}
      </div>
      <div className="overflow-hidden text-ellipsis mt-auto text-sm h-5">{attachment.fileName}</div>
    </div>
  );
};

export default React.memo(InputAttachment);
