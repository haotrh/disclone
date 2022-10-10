import classNames from "classnames";
import React, { ReactNode } from "react";

interface MenuWrapperProps {
  children: ReactNode;
  className?: string;
}

const MenuWrapper: React.FC<MenuWrapperProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        className,
        "p-2 rounded-md shadow-md shadow-background-floating w-[240px]",
        "flex flex-col border border-background-accent bg-background-primary"
      )}
    >
      {children}
    </div>
  );
};

export default MenuWrapper;
