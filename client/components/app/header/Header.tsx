import classNames from "classnames";
import React, { ReactNode } from "react";
import HeaderDivider from "./HeaderDivider";

interface HeaderProps {
  name?: ReactNode;
  icon: ReactNode;
  toolbar?: ReactNode;
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children, toolbar, name, icon }) => {
  return (
    <div
      className="h-12 shadow select-none shadow-background-secondary
      px-4 flex items-center justify-between shrink-0"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="text-text-muted">{icon}</div>
        <div className="text-header-primary font-semibold text-[17px]">{name}</div>
        {children && (
          <>
            <HeaderDivider />
            <div
              className="flex-1 min-w-0 overflow-hidden text-ellipsis
            whitespace-nowrap mr-1 text-header-secondary text-sm"
            >
              {children}
            </div>
          </>
        )}
      </div>
      {toolbar}
    </div>
  );
};

export default Header;
