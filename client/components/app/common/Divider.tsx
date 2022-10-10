import classNames from "classnames";
import React from "react";

interface DividerProps {
  spacing?: "xs" | "small" | "medium" | "large";
  className?: string;
}

const Divider = ({ spacing = "small", className }: DividerProps) => {
  return (
    <div
      className={classNames(className, "h-0 border-t border-divider", {
        "my-1 mx-1": spacing === "xs",
        "my-2": spacing === "small",
        "my-6": spacing === "medium",
        "my-10": spacing === "large",
      })}
    />
  );
};

export default Divider;
