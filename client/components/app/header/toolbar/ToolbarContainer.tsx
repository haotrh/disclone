import React, { ReactNode } from "react";

interface ToolbarContainerProps {
  children?: ReactNode;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({ children }) => {
  return <div className="flex items-center gap-4">{children}</div>;
};

export default ToolbarContainer;
