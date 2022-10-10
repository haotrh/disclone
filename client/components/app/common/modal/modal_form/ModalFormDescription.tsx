import React, { ReactNode } from "react";

interface ModalFormDescriptionProps {
  children?: ReactNode;
}

const ModalFormDescription: React.FC<ModalFormDescriptionProps> = ({ children }) => {
  return <div className="pr-2 text-header-secondary">{children}</div>;
};

export default ModalFormDescription;
