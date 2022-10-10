import classNames from "classnames";
import React from "react";
import { User } from "types/user";

interface NameWithNumberProps {
  user: User;
  className?: string;
}

const NameWithNumber: React.FC<NameWithNumberProps> = ({ user, className }) => {
  return (
    <span className={classNames("text-header-primary", className)}>
      {user.username}
      <span className="text-text-muted">#{user.discrimination}</span>
    </span>
  );
};

export default NameWithNumber;
