import React, { ReactNode } from "react";

const LayerModalHeader = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-header-primary font-semibold text-[22px] mb-2">{children}</h1>;
};

export default LayerModalHeader;
