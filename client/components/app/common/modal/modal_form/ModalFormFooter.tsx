import React, { ReactNode } from "react";

interface ModalFormFooterProps {
  children?: ReactNode;
}

const ModalFormFooter: React.FC<ModalFormFooterProps> = ({ children }) => {
  return (
    <div className="p-4 bg-background-secondary-alt rounded-b-lg flex justify-end space-x-4 items-center flex-shrink-0">
      {children}
    </div>
  );
};

export default ModalFormFooter;
