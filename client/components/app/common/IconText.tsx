import classNames from "classnames";
import React, { ReactNode } from "react";

interface IconTextProps {
  icon: ReactNode;
  text: ReactNode;
  className?: string;
}

const IconText: React.FC<IconTextProps> = ({ icon, text, className }) => {
  return (
    <div className={classNames("flex items-center gap-3 px-2", className)}>
      <div className="w-8 h-8 flex-center">{icon}</div>
      <div>{text}</div>
    </div>
  );
};

export default IconText;
