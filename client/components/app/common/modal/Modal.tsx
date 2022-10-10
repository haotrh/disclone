import classNames from "classnames";
import BaseModal from "./BaseModal";

const MODAL_PORTAL_ID = "modal-portal";

export interface ModalProps {
  children?: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => any;
}

const Modal = ({ isOpen, className, onClose, children }: ModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      portalId={MODAL_PORTAL_ID}
      key="modal"
      initial={{
        scale: 0.7,
        opacity: 0,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.2,
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.125 },
      }}
      backdrop
      className={classNames(
        className,
        "fixed top-1/2 z-50 left-1/2 origin-center flex-center h-full py-12 pointer-events-none"
      )}
    >
      <div className="max-h-full min-h-0 flex pointer-events-auto">{children}</div>
    </BaseModal>
  );
};

export default Modal;
