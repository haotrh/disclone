import React from "react";
import { IoMdClose } from "react-icons/io";

interface TableDeleteButtonProps {
  onClick: () => any;
}

const TableDeleteButton: React.FC<TableDeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-[calc(100%+8px)] p-1 flex-center invisible group-hover:visible
      rounded-full border border-background-tertiary text-button-danger-normal"
    >
      <IoMdClose size={18} />
    </button>
  );
};

export default TableDeleteButton;
