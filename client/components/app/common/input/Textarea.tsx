import classNames from "classnames";
import { forwardRef, ReactNode } from "react";
import ReactTextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize";
import Label from "./Label";
import { MarkdownInput } from "./markdown";
import { MarkdownInputProps } from "./markdown/MarkdownInput";

interface TextareaProps extends Omit<TextareaAutosizeProps, "value" | "onChange"> {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  markdown?: boolean;
  value?: string;
  onChange?: (value: any) => any;
  prefixNode?: ReactNode;
  suffixNode?: ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      prefixNode,
      suffixNode,
      required,
      className,
      markdown,
      value,
      onChange,
      minRows = 3,
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
        {markdown ? (
          <div className="relative">
            <div
              className="h-[136px] flex-1 min-w-0 overflow-y-auto bg-input-background rounded
      custom-scrollbar scrollbar-thin"
            >
              <MarkdownInput
                customRelative
                value={value}
                onChange={onChange}
                expressionProps={{ tabOnly: "emoji" }}
                className={classNames(
                  "bg-transparent w-full flex-1 py-2 placeholder-button-text-disabled"
                )}
              />
            </div>
          </div>
        ) : (
          <div className={classNames("w-full bg-input-background rounded-[4px] flex")}>
            {prefixNode && (
              <div className="select-none flex-shrink-0 pl-2 pr-1.5 h-9 flex-center">
                {prefixNode}
              </div>
            )}
            <ReactTextareaAutosize
              ref={ref}
              minRows={minRows}
              value={value}
              onChange={onChange}
              {...props}
              autoComplete="off"
              className={classNames(
                className,
                "bg-transparent w-full flex-1 py-2 custom-scrollbar placeholder-button-text-disabled resize-none",
                {
                  "pl-2.5": !prefixNode,
                  "pr-2.5": !suffixNode,
                }
              )}
            />
            {suffixNode && (
              <div className="select-none flex-shrink-0 pr-1 pl-1.5 text-interactive-normal relative h-9 flex-center">
                {suffixNode}
              </div>
            )}
          </div>
        )}
      </>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
