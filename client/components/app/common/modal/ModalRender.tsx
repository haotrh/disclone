import _ from "lodash";
import React, { cloneElement, ReactNode, useState } from "react";
import Modal from "./Modal";

interface ModalRenderProps {
  className?: string;
  modal: ReactNode;
  children: ((isOpen: boolean) => ReactNode) | ReactNode;
  onClick?: (isOpen?: boolean) => any;
}

const ModalRender: React.FC<ModalRenderProps> = ({ children, modal, onClick }) => {
  const [isOpen, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
    onClick && onClick(isOpen);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      {_.isFunction(children)
        ? cloneElement(children(isOpen) as React.ReactElement<any>, {
            onClick: handleClick,
          })
        : cloneElement(children as React.ReactElement<any>, {
            onClick: handleClick,
          })}
      <Modal isOpen={isOpen} onClose={onClose}>
        {isOpen && modal}
      </Modal>
    </>
  );
};

export default ModalRender;
