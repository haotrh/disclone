import { Clickable } from "@app/common/button";
import { ClickableProps } from "@app/common/button/Clickable";
import React from "react";

interface LayerModalTabProps extends ClickableProps {}

const LayerModalTab: React.FC<LayerModalTabProps> = ({
  children,
  ...props
}) => {
  return (
    <Clickable
      {...props}
      bg
      className="py-1.5 px-2.5 -mx-2 flex justify-between items-center mb-0.5 relative"
    >
      {children}
    </Clickable>
  );
};

export default LayerModalTab;
