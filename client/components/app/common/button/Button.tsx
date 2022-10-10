import { ThreeDotsLoading } from "@components/common";
import classNames from "classnames";
import React, { forwardRef, HTMLAttributes } from "react";

type ButtonTheme =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "danger-outline"
  | "secondary-outline"
  | "channel"
  | "blank"
  | "row";

type ButtonSize = "small" | "medium" | "large" | "none";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  theme?: ButtonTheme;
  size?: ButtonSize;
  disabled?: boolean;
  grow?: boolean;
  loading?: boolean;
  closeModal?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      disabled,
      role = "button",
      theme = "primary",
      size = "none",
      grow,
      className,
      loading = false,
      type = "button",
      onClick,
      closeModal,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      onClick && onClick(e);
    };

    return (
      <button
        type={type}
        ref={ref}
        {...props}
        onClick={handleClick}
        className={classNames(
          className,
          "select-none text-header-primary transition flex-center text-sm font-medium rounded flex-shrink-0",
          {
            "bg-background-secondary h-9 w-9 !rounded-full text-text-normal": theme === "row",
            "bg-button-primary-normal text-white hover:bg-button-primary-hover active:bg-button-primary-active":
              !disabled && theme === "primary",
            "bg-button-secondary-normal text-white hover:bg-button-secondary-hover active:bg-button-secondary-active":
              !disabled && theme === "secondary",
            "bg-button-danger-normal text-white hover:bg-button-danger-hover active:bg-button-danger-active":
              !disabled && theme === "danger",
            "bg-button-success-normal text-white hover:bg-button-success-hover active:bg-button-success-active":
              !disabled && theme === "success",
            "text-interactive-normal hover:text-interactive-hover": !disabled && theme === "blank",
            "ring-1 ring-button-danger-normal hover:bg-button-danger-normal":
              !disabled && theme === "danger-outline",
            "ring-1 ring-button-secondary-normal hover:text-white hover:bg-button-secondary-normal active:bg-button-secondary-hover":
              !disabled && theme === "secondary-outline",
            [`opacity-50 bg-button-${theme}-normal`]: disabled,
            "pointer-events-none": loading,
            "text-white cursor-not-allowed": disabled,
            "w-[60px] h-8 min-w-[60px] min-h-[32px] px-4": size === "small",
            "w-[96px] h-[38px] min-w-[96px] min-h-[38px] px-4": size === "medium",
            "w-[120px] h-[46px] min-w-[120px] min-h-[46px] px-4 text-[17px]": size === "large",
            "!w-auto": grow,
          }
        )}
      >
        {loading ? <ThreeDotsLoading /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
