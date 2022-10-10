import React from "react";
import { HTMLMotionProps, motion, Variants } from "framer-motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  from?: "top-left" | "bottom-right";
  duration?: number;
}

const RevealFromTopLeftVariants: Variants = {
  hidden: { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)" },
  show: { clipPath: "polygon(0% 0%, 200% 0%, 0% 200%)" },
};

const RevealFromBottomRightVariants: Variants = {
  hidden: {
    clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)",
  },
  show: {
    clipPath: "polygon(100% 100%,  100% -200%, -200% 100%)",
  },
};

const Reveal: React.FC<RevealProps> = ({
  children,
  duration = 1,
  from = "top-left",
  ...props
}) => {
  return (
    <motion.div
      {...props}
      variants={
        from === "top-left"
          ? RevealFromTopLeftVariants
          : RevealFromBottomRightVariants
      }
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
