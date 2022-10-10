import { Button, Tooltip } from "@app/common";
import { ButtonProps } from "@app/common/button/Button";
import React from "react";

interface ToolbarButtonProps extends ButtonProps {
  tooltip: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ tooltip, ...props }) => {
  return (
    <Tooltip content={tooltip}>
      <Button theme="blank" {...props} />
    </Tooltip>
  );
};

export default ToolbarButton;
