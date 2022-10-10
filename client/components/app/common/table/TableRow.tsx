import classNames from "classnames";
import React, { HTMLProps, ReactNode } from "react";

interface TableRowProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  type: "header" | "data";
}

const TableRow: React.FC<TableRowProps> = ({ className, type, ...props }) => {
  return (
    <div
      {...props}
      className={classNames(
        "flex items-center border-b border-divider -mb-px text-sm",
        {
          "font-semibold uppercase select-none border-b-0 text-header-secondary text-[13px]":
            type === "header",
          "h-[64px] relative group before:-mr-9 before:content-[''] before:absolute before:inset-0": type === "data",
        },
        className
      )}
    />
  );
};

export default TableRow;
