// import { usePopover } from "contexts/PopoverContext";
import classNames from "classnames";
import React, { forwardRef, HTMLAttributes, KeyboardEventHandler, MouseEvent } from "react";
import { usePopover } from "../popover/PopoverContext";

type ClickableTheme = "default" | "primary" | "danger" | "channel" | "row";
type Type = "none" | "popover";

export interface ClickableProps extends HTMLAttributes<HTMLDivElement> {
  theme?: ClickableTheme;
  type?: Type;
  bg?: boolean;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  noClosePopover?: boolean;
  clickSelected?: boolean;
}

const Clickable = forwardRef<HTMLDivElement, ClickableProps>(
  (
    {
      children,
      selected,
      onClick,
      theme = "default",
      type = "none",
      className,
      bg,
      noClosePopover,
      disabled,
      clickSelected,
      ...props
    },
    ref
  ) => {
    const { close } = usePopover();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (!disabled && (!selected || (selected && clickSelected))) {
        e.stopPropagation();
        onClick && onClick(e);
        type === "popover" && !noClosePopover && close && close();
      }
    };
    return (
      <div
        ref={ref}
        {...props}
        onClick={handleClick}
        className={classNames(className, "rounded select-none font-medium flex items-center", {
          "bg-background-secondary h-9 w-9 !rounded-full text-text-normal flex-center": theme === "row",
          "text-interactive-normal": theme === "default" && !disabled,
          "text-header-secondary hover:bg-button-primary-hover hover:text-white":
            theme === "primary" && !disabled,
          "text-red-500 hover:bg-button-danger-normal hover:text-white":
            theme === "danger" && !disabled,
          "text-channels-default hover:text-interactive-hover": theme === "channel" && !disabled,
          "text-interactive-active": selected && (theme === "default" || theme === "channel"),
          "hover:text-interactive-hover active:text-header-primary hover:bg-background-modifier-hover active:bg-background-modifier-active":
            bg && !selected && (theme === "default" || theme === "channel"),
          "bg-background-modifier-active":
            selected && bg && (theme === "default" || theme === "channel"),
          "px-2 py-1.5 flex-center-between": type === "popover",
          "cursor-pointer": !disabled,
          "text-interactive-muted !cursor-not-allowed": disabled,
        })}
      >
        {children}
      </div>
    );
  }
);

Clickable.displayName = "Clickable";

export default Clickable;
