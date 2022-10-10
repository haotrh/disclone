import classNames from "classnames";
import React, { ReactNode } from "react";

interface ModalFormContainerProps {
  className?: string;
  theme?: "light" | "dark";
  children?: ReactNode;
}

const ModalFormContainer: React.FC<ModalFormContainerProps> = ({
  children,
  theme = "dark",
  className,
}) => {
  return (
    <div
      className={classNames(
        className,
        "w-[440px] rounded relative min-h-0 flex flex-col",
        {
          "theme-light bg-background-primary": theme === "light",
          "bg-background-primary": theme === "dark",
        }
      )}
    >
      {children}
    </div>
  );
};

export default ModalFormContainer;
