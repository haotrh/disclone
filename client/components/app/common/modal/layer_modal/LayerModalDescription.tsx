import classNames from "classnames";
import React, { ReactNode } from "react";

interface LayerModalDescriptionProps {
  children?: ReactNode;
  className?: string;
}

const LayerModalDescription: React.FC<LayerModalDescriptionProps> = ({ children, className }) => {
  return (
    <div className={classNames("text-sm text-header-secondary select-none", className)}>
      {children}
    </div>
  );
};

export default LayerModalDescription;
