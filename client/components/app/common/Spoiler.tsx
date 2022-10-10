import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface SpoilerProps {
  disabled?: boolean;
  children?: ReactNode;
}

const Spoiler: React.FC<SpoilerProps> = ({ children, disabled }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative h-full w-full flex-center">
      <AnimatePresence>
        {!disabled && !show && (
          <motion.div
            exit={{ scale: [1.05, 0.7], opacity: 0.5 }}
            transition={{ duration: 0.05 }}
            onClick={() => setShow(true)}
            className="absolute flex-center inset-0 backdrop-blur-2xl bg-black/10 cursor-pointer group z-20"
          >
            <div className="rounded-full py-1.5 px-3 bg-black/50 group-hover:bg-black/80 transition-colors font-semibold">
              SPOILER
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export default Spoiler;
