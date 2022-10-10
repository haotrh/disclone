import classNames from "classnames";
import React, { ReactNode } from "react";

export interface TableColProps {
  flexStyle?: string;
  children?: ReactNode;
  className?: string;
}

const TableCol: React.FC<TableColProps> = ({ flexStyle, children, className }) => {
  return (
    <div style={{ flex: flexStyle }} className={classNames("min-w-0", className)}>
      {children}
    </div>
  );
};

export default TableCol;
