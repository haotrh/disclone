import React from "react";
import { MdInbox } from "react-icons/md";
import ToolbarButton from "./ToolbarButton";

const InboxButton = () => {
  return (
    <ToolbarButton tooltip="Inbox">
      <MdInbox size={24} />
    </ToolbarButton>
  );
};

export default InboxButton;
