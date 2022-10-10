import { Label } from "@app/common/input";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";
import { useModal } from "../ModalContext";

interface LayerModalContentProps {
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
  customContainer?: boolean;
  customContent?: boolean;
}

const LayerModalContent = React.forwardRef<HTMLDivElement, LayerModalContentProps>(
  ({ children, className, containerClassName, customContainer, customContent }, ref) => {
    const { close } = useModal();

    return (
      <div
        ref={ref}
        className={classNames(
          {
            "h-full w-full overflow-y-scroll custom-scrollbar flex overflow-x-hidden relative":
              !customContainer,
          },
          containerClassName
        )}
      >
        <div
          className={classNames(
            {
              "max-w-[740px] w-full min-w-[460px] relative h-fit pb-[40px] px-[40px] pt-[60px] flex flex-col gap-4":
                !customContent,
            },
            className
          )}
        >
          {children}
        </div>
        <div className="pt-[60px] relative select-none">
          <div
            className="flex flex-col justify-center fixed text-interactive-normal hover:text-interactive-hover
            active:text-interactive-active group cursor-pointer"
          >
            <button
              onClick={close}
              className="p-1.5 rounded-full border-2 border-interactive-normal hover:border-interactive-hover
              active:border-interactive-active hover:bg-background-modifier-hover active:translate-y-px"
            >
              <IoMdClose size={20} />
            </button>
            <Label className="text-center pt-1 text-inherit absolute w-full top-full left-0 mt-1 pointer-events-none">
              ESC
            </Label>
          </div>
        </div>
      </div>
    );
  }
);

LayerModalContent.displayName = "LayerModalContent";

export default LayerModalContent;
