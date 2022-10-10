import _ from "lodash";
import React, { useState } from "react";
import CropImageModal, { CropImageModalProps } from "../CropImageModal";
import { ImageFileInput } from "../input";
import { Modal } from "../modal";
import Button, { ButtonProps } from "./Button";

interface SelectImageButtonProps extends Omit<ButtonProps, "onChange"> {
  onChange: (base64: string | null) => any;
  cropProps?: Partial<CropImageModalProps>;
}

const SelectImageButton: React.FC<SelectImageButtonProps> = ({
  onChange,
  children,
  cropProps,
  ...props
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onClose = () => {
    setSelectedImage(null);
  };

  return (
    <Button size="small" className="relative" grow {...props}>
      {children ?? "Upload Image"}
      {!props.disabled && (
        <ImageFileInput
          onChange={(base64, _, type) => {
            if (type?.includes("gif")) {
              onChange(base64);
            } else {
              setSelectedImage(base64);
            }
          }}
        />
      )}
      <Modal isOpen={!_.isEmpty(selectedImage)} onClose={onClose}>
        <CropImageModal
          {...cropProps}
          onSelect={onChange}
          image={selectedImage || ""}
          onClose={onClose}
        />
      </Modal>
    </Button>
  );
};

export default SelectImageButton;
