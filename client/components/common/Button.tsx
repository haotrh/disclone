import classNames from "classnames";
import React, { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  size?: "small" | "large";
  theme?: "primary" | "white" | "black";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = "small", theme = "primary", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNames(
          className,
          "font-medium transition-all hover:shadow-xl rounded-full",
          {
            "px-4 py-2 text-sm": size === "small",
            "px-6 py-4 text-xl": size === "large",
            "bg-indigo-500 hover:bg-indigo-400 text-white": theme === "primary",
            "bg-white hover:text-indigo-500 text-black": theme === "white",
            "bg-black hover:bg-zinc-900 text-white": theme === "black",
          }
        )}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
