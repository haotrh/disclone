import { UserArea } from "@app/user";
import React, { ReactNode } from "react";

interface SidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <div className="w-60 bg-background-secondary flex flex-col">
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">{children}</div>
      <UserArea />
    </div>
  );
};

export default Sidebar;
