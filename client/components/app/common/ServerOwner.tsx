import React from "react";
import { AiTwotoneCrown } from "react-icons/ai";
import Tooltip from "./tooltip/Tooltip";

const ServerOwner: React.FC = ({}) => {
  return (
    <Tooltip content="Server Owner">
      <span>
        <AiTwotoneCrown className="text-[#FAA81A]" />
      </span>
    </Tooltip>
  );
};

export default ServerOwner;
