import React, { useState } from "react";
import Button, { ButtonProps } from "./Button";

interface CopyButtonProps extends ButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, ...props }) => {
  const [copied, setCopied] = useState(false);

  const onClick = () => {
    if (!copied) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  return (
    <Button
      size="small"
      className="w-[75px]"
      theme={copied ? "success" : "primary"}
      onClick={onClick}
      {...props}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};

export default CopyButton;
