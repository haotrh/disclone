import useMount from "@hooks/useMount";
import Tippy, { TippyProps } from "@tippyjs/react/headless";
import classNames from "classnames";
import { motion, useSpring } from "framer-motion";
import _ from "lodash";
import React, { cloneElement, useMemo, useState } from "react";
import { followCursor as followCursorPlugin } from "tippy.js";
import { PopoverProvider } from "./PopoverContext";

interface PopoverProps extends TippyProps {
  isContextMenu?: boolean;
  handleHide?: () => any;
  customStyling?: boolean;
  disabled?: boolean;
  lazyRender?: boolean;
}

const Popover = React.forwardRef<any, PopoverProps>(
  (
    {
      isContextMenu,
      followCursor,
      visible: customVisible,
      handleHide: customHandleHide,
      animation,
      children,
      offset,
      className,
      disabled,
      lazyRender,
      customStyling,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const mount = useMount();

    const handleShow = () => {
      setVisible(true);
    };

    const handleHide = () => {
      if (customHandleHide) {
        customHandleHide();
      } else {
        setVisible(false);
      }
    };

    const handleCick = (onClick: any) => {
      if (!isContextMenu && !customHandleHide) {
        visible ? handleHide() : handleShow();
      }
      onClick && onClick();
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      visible ? handleHide() : handleShow();
    };

    const opacity = useSpring(animation ? 0 : 1, {
      duration: 100,
    });
    const scale = useSpring(animation ? 0.7 : 1, { duration: 50, bounce: 10 });

    const onMount = () => {
      if (animation) {
        opacity.set(1);
        scale.set(1);
      }
    };

    const onHide = ({ unmount }: any) => {
      if (animation) {
        const cleanup = scale.onChange((value) => {
          if (value <= 0.9) {
            cleanup();
            unmount();
          }
        });

        scale.set(0.9);
        opacity.set(0.4);
      }
    };

    const isVisible = useMemo(
      () => (_.isUndefined(customVisible) ? visible : customVisible),
      [customVisible, visible]
    );

    if (disabled) return <>{children}</>;

    return (
      <PopoverProvider isOpen={isVisible} close={handleHide}>
        <Tippy
          {...props}
          appendTo={mount ? document.body : "parent"}
          onMount={onMount}
          onHide={onHide}
          onClickOutside={handleHide}
          ref={ref}
          interactive={true}
          visible={isVisible}
          followCursor={followCursor ? "initial" : false}
          plugins={[followCursorPlugin]}
          offset={offset ?? [0, 8]}
          render={(attrs, content) => (
            <motion.div
              tabIndex={-1}
              style={{ opacity, scale }}
              className={classNames(className, {
                "bg-background-floating rounded shadow-lg text-sm font-medium min-w-[188px]":
                  !customStyling,
              })}
              {...attrs}
            >
              {((lazyRender && isVisible) || !lazyRender) && (content ?? props.content)}
            </motion.div>
          )}
        >
          {children &&
            cloneElement(children, {
              onClick: () => handleCick(children.props.onClick),
              onContextMenu: handleContextMenu,
            })}
        </Tippy>
      </PopoverProvider>
    );
  }
);

Popover.displayName = "Popover";

export default Popover;
