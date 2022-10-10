import React from "react";
import { HTMLMotionProps, motion, Variants } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  duration?: number;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 0.45,
  ...props
}) => {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
