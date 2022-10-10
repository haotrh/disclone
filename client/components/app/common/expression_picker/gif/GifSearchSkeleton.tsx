import useMasonryPositioner from "@hooks/useMasonryPositioner";
import { motion, Variants } from "framer-motion";
import { useSize } from "mini-virtual-list";
import React, { useRef } from "react";

const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

interface GifButtonSkeletonProps {
  left: number;
  top: number;
  height: number;
  width: number;
}

export const GifButtonSkeleton: React.FC<GifButtonSkeletonProps> = (props) => {
  return (
    <motion.div
      transition={{ duration: 0.1, ease: "linear" }}
      style={props}
      variants={item}
      className="bg-channeltextarea-background rounded-md absolute"
    />
  );
};

const GifSearchSkeleton: React.FC = ({}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(containerRef);
  const positioner = useMasonryPositioner({
    width,
    elements: [140, 200, 120, 100, 80, 100],
    columnGap: 8,
    rowGap: 8,
  });

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 min-w-0 overflow-y-auto custom-scrollbar scrollbar-thin"
    >
      <motion.div
        transition={{ staggerChildren: 0.07 }}
        initial="hidden"
        animate="show"
        style={{ height: positioner.height + 400 }}
        className="relative w-full"
      >
        {positioner.cellStyles.map((cell, i) => (
          <GifButtonSkeleton
            key={i}
            {...cell}
            width={positioner.columnWidth}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default GifSearchSkeleton;
