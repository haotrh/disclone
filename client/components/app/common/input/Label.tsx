import classNames from "classnames";
import { HTMLProps, ReactNode } from "react";

interface LabelProps extends HTMLProps<HTMLLabelElement> {
  htmlFor?: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
}

const Label = ({
  htmlFor,
  children,
  className,
  error,
  required,
  ...props
}: LabelProps) => {
  return (
    <div
      className={classNames(
        className,
        "mb-1.5 text-[13px] font-semibold select-none uppercase",
        {
          "text-header-secondary": !error,
          "text-[#F38688]": error,
        }
      )}
    >
      <label htmlFor={htmlFor} {...props}>
        {children}
        {required && <span className="text-button-danger-normal ml-1">*</span>}
        <span
          className={classNames(
            "text-[13px] italic absolute text-trans normal-case",
            {
              visible: error,
              invisible: !error,
            }
          )}
        >
          &nbsp; &#8208; {error}
        </span>
      </label>
    </div>
  );
};

export default Label;
