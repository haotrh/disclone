import classNames from "classnames";
import React, { forwardRef, HTMLProps, ReactNode } from "react";
import Label from "./Label";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  prefixNode?: ReactNode;
  suffixNode?: ReactNode;
  error?: string;
  label?: string;
  required?: boolean;
  inputClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      prefixNode,
      suffixNode,
      disabled,
      required,
      label,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <>
        {label && (
          <Label error={error} required={required}>
            {label}
          </Label>
        )}
        <div
          className={classNames(
            className,
            "w-full bg-input-background rounded-[4px] flex items-center"
          )}
        >
          {prefixNode && <div className="select-none flex-shrink-0 pl-2 pr-1.5">{prefixNode}</div>}
          <input
            ref={ref}
            autoComplete="random-string"
            name=""
            disabled={disabled}
            {...props}
            className={classNames(
              inputClassName,
              "bg-transparent w-full flex-1 py-2 placeholder-button-text-disabled",
              {
                "pl-2.5": !prefixNode,
                "pr-2.5": !suffixNode,
                "opacity-50 cursor-not-allowed select-none": disabled,
              }
            )}
          />
          {suffixNode && (
            <div className="select-none flex-shrink-0 pr-1 pl-1.5 text-interactive-normal relative">
              {suffixNode}
            </div>
          )}
        </div>
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
