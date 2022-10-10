import classNames from "classnames";
import React, { forwardRef, HTMLAttributes, MouseEvent } from "react";
import Tooltip from "../tooltip/Tooltip";

interface CircleButtonProps extends HTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
}

const CircleButton = forwardRef<HTMLButtonElement, CircleButtonProps>(
  ({ tooltip, onClick, className, ...props }, ref) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick && onClick(e);
    };

    return (
      // <Tooltip content={tooltip} disabled={!tooltip}>
      <button
        ref={ref}
        onClick={handleClick}
        className={classNames(
          "group-hover:bg-background-tertiary duration-150 p-2.5 bg-background-secondary",
          "text-header-secondary hover:text-header-primary rounded-full",
          className
        )}
        {...props}
      />
      // </Tooltip>
    );
  }
);

CircleButton.displayName = "CircleButton";

export default CircleButton;
