import { Tooltip } from "@app/common";
import Clickable, { ClickableProps } from "@app/common/button/Clickable";
import React, { ReactNode } from "react";

interface UserAreaButtonProps extends ClickableProps {
  tooltip: string;
  children?: ReactNode;
}

const UserAreaButton: React.FC<UserAreaButtonProps> = ({ children, tooltip, ...props }) => {
  return (
    <Tooltip content={tooltip}>
      <Clickable {...props} className="p-1.5 rounded-md">
        {children}
      </Clickable>
    </Tooltip>
  );
};

export default UserAreaButton;
