import React from "react";
import { HTMLMotionProps, motion, Variants } from "framer-motion";

interface FadeInUpProps extends HTMLMotionProps<"div"> {
  duration?: number;
}

const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  duration = 0.45,
  ...props
}) => {
  return (
    <motion.div
      {...props}
      initial={{ y: "30%", opacity: 0, scale: 0.85 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInUp;
