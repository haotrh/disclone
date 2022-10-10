import useMount from "@hooks/useMount";
import createPortalRoot from "@utils/createPortalRoot";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCloseModal } from "./CloseModalContext";
import { ModalProvider } from "./ModalContext";

export interface BaseModalProps extends HTMLMotionProps<"div"> {
  isOpen: boolean;
  children?: React.ReactNode;
  className?: string;
  onClose: () => any;
  backdrop?: boolean;
  portalId: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  backdrop,
  portalId,
  ...props
}) => {
  const portalRootRef = useRef<HTMLElement | null>(null);
  const mounted = useMount();
  const [animationEnd, setAnimationEnd] = useState(false);
  const closeCallbackId = useRef<string | null>(null);
  const { addCloseCallback, removeCloseCallback } = useCloseModal();

  useEffect(() => {
    const bodyElement = document.querySelector("body");
    portalRootRef.current = document.getElementById(portalId) ?? createPortalRoot(portalId);
    if (bodyElement) {
      bodyElement.appendChild(portalRootRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (_.isNull(closeCallbackId.current)) closeCallbackId.current = addCloseCallback(onClose);
    } else {
      if (closeCallbackId.current) {
        removeCloseCallback(closeCallbackId.current);
        closeCallbackId.current = null;
      }
    }
  }, [isOpen]);

  return !mounted
    ? null
    : createPortal(
        <ModalProvider close={onClose}>
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  aria-hidden={isOpen ? "false" : "true"}
                  onAnimationStart={() => {
                    setAnimationEnd(false);
                  }}
                  onAnimationComplete={() => {
                    setAnimationEnd(true);
                  }}
                  {...props}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={className}
                >
                  {!(!isOpen && animationEnd) && children}
                </motion.div>
                {/* Backdrop */}
                {backdrop && (
                  <motion.div
                    key="modal-background"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        type: "keyframes",
                        duration: 0.1,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.1 },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="fixed inset-0 bg-black/[0.85] z-40"
                  />
                )}
              </>
            )}
          </AnimatePresence>
        </ModalProvider>,
        portalRootRef.current as Element
      );
};

export default BaseModal;
