import { RoundLoading } from "@components/common";
import React from "react";
import { Modal, ModalFormContainer, ModalFormDescription, ModalFormHeader } from "../modal";

interface ImageFileInputProps {
  onChange: (base64: string | null, file: File, type?: string) => any;
  uploadingModal?: boolean;
  disabled?: boolean;
}

const ImageFileInput: React.FC<ImageFileInputProps> = ({ onChange, uploadingModal, disabled }) => {
  return (
    <>
      <Modal isOpen={Boolean(uploadingModal)} onClose={() => {}}>
        <ModalFormContainer className="flex flex-col items-center text-center pb-16">
          <div className="pt-10 pb-5">
            <RoundLoading />
          </div>
          <ModalFormHeader center className="font-semibold">
            Uploading...
          </ModalFormHeader>
          <ModalFormDescription>Your files are being prepared. Please wait.</ModalFormDescription>
        </ModalFormContainer>
      </Modal>
      <input
        className="opacity-0 absolute inset-0 cursor-pointer"
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            const type = file.type;
            reader.onload = function () {
              onChange(reader.result?.toString() || null, file, type);
              e.target.value = "";
            };
          }
        }}
      />
    </>
  );
};

export default ImageFileInput;
