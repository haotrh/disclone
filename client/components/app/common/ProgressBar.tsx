import classNames from "classnames";
import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  total?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  total = 100,
}) => {
  return (
    <div
      className={classNames(
        className,
        "bg-background-modifier-normal h-2 rounded-full relative overflow-hidden"
      )}
    >
      <motion.div
        style={{ width: `${(value / total) * 100}%` }}
        className="absolute inset-0 bg-primary"
      />
    </div>
  );
};

export default ProgressBar;
