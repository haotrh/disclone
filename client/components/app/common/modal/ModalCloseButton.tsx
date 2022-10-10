import React from "react";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Button } from "../button";
import { useModal } from "./ModalContext";

const ModalCloseButton = () => {
  const { close } = useModal();

  return (
    <button
      onClick={close}
      className="absolute m-4 top-0 right-0 transition-all opacity-50
      text-interactive-normal hover:text-interactive-hover hover:opacity-100"
    >
      <IoMdClose size={28} />
    </button>
  );
};

export default ModalCloseButton;
