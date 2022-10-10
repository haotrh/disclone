import classNames from "classnames";
import { ReactNode, useEffect } from "react";
import BaseModal from "../BaseModal";
import { useLayerModal } from "./LayerModalContext";

export const LAYER_MODAL_PORTAL_ID = "layer-modal-portal";

export interface LayerModalProps {
  children?: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => any;
}

const LayerModal = ({ className, isOpen, onClose, children }: LayerModalProps) => {
  const { closeModal, openModal } = useLayerModal();

  useEffect(() => {
    if (isOpen) {
      openModal();
    } else {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      portalId={LAYER_MODAL_PORTAL_ID}
      key="layer_modal"
      initial={{
        scale: 1.2,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.425,
          type: "spring",
          bounce: 0.275,
        },
      }}
      exit={{
        scale: 1.1,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      className={classNames(
        className,
        "w-full h-full z-50 origin-center bg-background-primary",
        "flex justify-center items-center overflow-hidden"
      )}
    >
      {children}
    </BaseModal>
  );
};

export default LayerModal;
