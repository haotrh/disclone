import classNames from "classnames";
import React, { ReactNode } from "react";

interface ModalFormHeaderProps {
  className?: string;
  center?: boolean;
  children?: ReactNode;
}

const ModalFormHeader: React.FC<ModalFormHeaderProps> = ({ children, center, className }) => {
  return (
    <h2
      className={classNames(
        "text-header-primary p-4 flex-shrink-0",
        {
          "text-2xl font-bold !pb-2 text-center": center,
          "text-xl font-semibold ": !center,
        },
        className
      )}
    >
      {children}
    </h2>
  );
};

export default ModalFormHeader;
