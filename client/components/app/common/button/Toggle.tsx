import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface ToggleProps {
  active: boolean;
  onClick: () => any;
  width?: number;
  circleSize?: number;
  className?: string;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  active,
  onClick,
  width = 40,
  circleSize = 18,
  className,
  label,
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        className,
        "flex-center-between text-header-primary font-medium cursor-pointer"
      )}
    >
      {label && <div>{label}</div>}
      <AnimatePresence initial={false}>
        <div
          style={{ width }}
          className={classNames("rounded-full transition-colors p-1", {
            "bg-green-600": active,
            "bg-zinc-500": !active,
          })}
        >
          <motion.svg
            viewBox="0 0 28 20"
            animate={active ? { x: width - circleSize - 8 } : { x: 0 }}
            style={{
              width: (28 / 20) * circleSize,
              height: circleSize,
              // left: active ? width - circleSize - 8 : 0,
            }}
            className={"relative top-0"}
          >
            <motion.rect
              x={0}
              y="0"
              height={20}
              animate={{
                width: 20,
                height: 20,
              }}
              rx="10"
              fill="white"
            />
            <svg viewBox="4 0 20 20">
              <motion.path
                className={active ? "fill-green-500" : "fill-zinc-500"}
                animate={{
                  d: active
                    ? "M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"
                    : "M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z",
                }}
                // d={
                //   active
                //     ? "M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"
                //     : "M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"
                // }
              />
              <motion.path
                className={active ? "fill-green-500" : "fill-zinc-500"}
                animate={{
                  d: active
                    ? "M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"
                    : "M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z",
                }}
              />
            </svg>
          </motion.svg>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Toggle;
