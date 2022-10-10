import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

interface SlideUpProps extends HTMLMotionProps<"div"> {
  duration?: number;
}

const SlideUp: React.FC<SlideUpProps> = ({
  children,
  duration = 0.6,
  ...props
}) => {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        {...props}
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SlideUp;
