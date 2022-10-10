import createPortalRoot from "@utils/createPortalRoot";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  portalId?: string;
  children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ portalId, children }) => {
  const [mount, setMount] = useState(false);
  const bodyRef = useRef<HTMLBodyElement | null>(null);
  const portalRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMount(true);
    bodyRef.current = document.querySelector("body");
    if (portalId) {
      portalRootRef.current = document.getElementById(portalId) ?? createPortalRoot(portalId);
      if (bodyRef.current) {
        bodyRef.current.appendChild(portalRootRef.current);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !mount
    ? null
    : createPortal(
        children,
        document && (portalId ? (portalRootRef.current as Element) : (bodyRef.current as Element))
      );
};

export default Portal;
