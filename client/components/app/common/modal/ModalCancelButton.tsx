import React from "react";
import { useModal } from "./ModalContext";

interface ModalCancelButtonProps {
  onClick?: () => any;
  close?: boolean;
}

const ModalCancelButton = ({
  onClick,
  close = true,
}: ModalCancelButtonProps) => {
  const { close: onClose } = useModal();

  const handleClick = () => {
    onClick && onClick();
    close && onClose();
  };

  return (
    <button
      type="button"
      className="hover:underline p-2 text-header-primary text-sm font-medium"
      onClick={handleClick}
    >
      Cancel
    </button>
  );
};

export default ModalCancelButton;
