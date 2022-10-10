import React from "react";
import { motion, Transition } from "framer-motion";

const CONTAINER_SIZE = 30;
const DOT_SIZE = 10;
const DISTANCE = 30 - 10;
const DURATION = 2.25;

const DotTransition: Transition = {
  repeat: Infinity,
  duration: DURATION,
  rotate: {
    ease: "linear",
    repeat: Infinity,
    duration: DURATION / 4,
    repeatType: "reverse",
  },
};

const ScaleAnimation = [1, 0.55, 1, 0.55, 1];

const RoundLoading = () => {
  return (
    <div
      style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
      className="relative"
    >
      <motion.div
        style={{ width: DOT_SIZE, height: DOT_SIZE }}
        className="absolute bg-indigo-400"
        initial={{ top: 0, left: 0 }}
        animate={{
          top: [0, 0, DISTANCE, DISTANCE, 0],
          left: [0, DISTANCE, DISTANCE, 0, 0],
          rotate: -90,
          scale: ScaleAnimation,
        }}
        transition={DotTransition}
      />
      <motion.div
        style={{ width: DOT_SIZE, height: DOT_SIZE }}
        className="absolute bg-indigo-400"
        initial={{ top: DISTANCE, left: DISTANCE }}
        animate={{
          top: [DISTANCE, DISTANCE, 0, 0, DISTANCE],
          left: [DISTANCE, 0, 0, DISTANCE, DISTANCE],
          rotate: -90,
          scale: ScaleAnimation,
        }}
        transition={DotTransition}
      />
    </div>
  );
};

export default RoundLoading;
