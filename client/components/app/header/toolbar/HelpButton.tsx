import { Button, Tooltip } from "@app/common";
import Link from "next/link";
import React from "react";
import { IoMdHelpCircle } from "react-icons/io";
import ToolbarButton from "./ToolbarButton";

const HelpButton = () => {
  return (
    <ToolbarButton tooltip="Help">
      <Link href={"https://www.google.com/?gws_rd=ssl"}>
        <a target="_blank">
          <IoMdHelpCircle size={24} />
        </a>
      </Link>
    </ToolbarButton>
  );
};

export default HelpButton;
