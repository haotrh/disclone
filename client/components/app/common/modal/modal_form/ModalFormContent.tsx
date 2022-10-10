import classNames from "classnames";
import React, { ReactNode } from "react";

interface ModalFormContentProps {
  className?: string;
  children?: ReactNode;
}

const ModalFormContent: React.FC<ModalFormContentProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "flex-1 overflow-y-auto custom-scrollbar min-h-0 mx-0.5 px-4 space-y-5 mb-5",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ModalFormContent;
