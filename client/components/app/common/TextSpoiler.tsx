import classNames from "classnames";
import React, { ReactNode, useState } from "react";

interface TextSpoilerProps {
  disabled?: boolean;
  children?: ReactNode;
}

const TextSpoiler: React.FC<TextSpoilerProps> = ({ children, disabled }) => {
  const [show, setShow] = useState(false);

  return (
    <span
      onClick={() => setShow(true)}
      className={classNames("rounded", {
        "bg-black/60 hover:bg-black/40 transition duration-100 cursor-pointer": !show,
        "bg-white/10": show,
      })}
    >
      <span
        className={classNames({
          "opacity-0": !show,
          "opacity-100": show,
        })}
      >
        {children}
      </span>
    </span>
  );
};

export default TextSpoiler;
