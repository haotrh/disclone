import Tippy, { TippyProps } from "@tippyjs/react/headless";
import classNames from "classnames";
import { motion, useSpring } from "framer-motion";
import React, { cloneElement, useEffect, useState } from "react";

interface TooltipProps extends TippyProps {
  onClick?: () => any;
  arrow?: boolean;
  grow?: boolean;
  noPadding?: boolean;
  onContextMenu?: React.MouseEventHandler<HTMLElement>;
}

const Tooltip = React.forwardRef<any, TooltipProps>(
  (
    {
      onClick,
      className,
      noPadding,
      appendTo,
      grow,
      offset = [0, 8],
      children,
      arrow = true,
      animation = true,
      onContextMenu,
      ...props
    },
    ref
  ) => {
    const [init, setInit] = useState(false);

    const opacity = useSpring(0, {
      duration: 50,
    });
    const scale = useSpring(0.8, { duration: 50, bounce: 10 });

    const onMount = () => {
      opacity.set(1);
      scale.set(1);
    };

    const onHide = ({ unmount }: any) => {
      const cleanup = scale.onChange((value) => {
        if (value <= 0.95) {
          cleanup();
          unmount();
        }
      });

      scale.set(0.9);
      opacity.set(0.4);
    };

    useEffect(() => {
      setInit(true);
    }, []);

    return (
      <Tippy
        appendTo={appendTo ?? (init ? document.body : "parent")}
        onMount={onMount}
        onHide={onHide}
        {...props}
        animation={animation}
        ref={ref}
        render={(attrs, content) => (
          <motion.div
            id="tooltip"
            tabIndex={-1}
            style={{
              opacity: animation ? opacity : 1,
              scale: animation ? scale : 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className={classNames(
              className,
              "bg-background-floating rounded shadow-md text-sm font-medium",
              {
                "max-w-[200px]": !grow,
                "py-1.5 px-3": !noPadding,
              }
            )}
            {...attrs}
          >
            <div>
              {content ?? props.content}
              {arrow && <div id="arrow" data-popper-arrow />}
            </div>
          </motion.div>
        )}
      >
        {children &&
          cloneElement(children, onClick ? { onClick, onContextMenu } : { onContextMenu })}
      </Tippy>
    );
  }
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
