import React, { useState } from "react";

interface EmailRevealProps {
  email: string;
}

const EmailReveal: React.FC<EmailRevealProps> = ({ email }) => {
  const [isReveal, setIsReveal] = useState(false);

  return (
    <span>
      {isReveal
        ? email
        : `${email.split("@")[0].replace(/./g, "*")}@${email.split("@")[1]}`}
      <span
        onClick={() => setIsReveal(!isReveal)}
        className="link inline-block ml-1 text-sm"
      >
        {isReveal ? "Hide" : "Reveal"}
      </span>
    </span>
  );
};

export default EmailReveal;
