import _ from "lodash";
import React, { cloneElement, ReactNode, useState } from "react";
import LayerModal from "./LayerModal";

interface LayerModalRenderProps {
  className?: string;
  modal: ReactNode;
  children: ((isOpen: boolean) => ReactNode) | ReactNode;
  onClick?: (isOpen?: boolean) => any;
}

const LayerModalRender: React.FC<LayerModalRenderProps> = ({ children, modal, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
    onClick && onClick(isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
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
      <LayerModal isOpen={isOpen} onClose={onClose}>
        {modal}
      </LayerModal>
    </>
  );
};

export default React.memo(LayerModalRender);
