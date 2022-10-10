import React, { ReactNode } from "react";
import SimpleBar from "simplebar-react";

interface LayerModalSidebarProps {
  children?: ReactNode;
}

const LayerModalSidebar: React.FC<LayerModalSidebarProps> = ({ children }) => {
  return (
    <div className="flex-grow flex-shrink-0 basis-[220px] bg-background-secondary flex justify-end h-full">
      <SimpleBar className="w-[220px] h-full">
        <div className="py-[60px] pl-[20px] pr-[6px]">{children}</div>
      </SimpleBar>
    </div>
  );
};

export default LayerModalSidebar;
