import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import Clickable, { ClickableProps } from "@app/common/button/Clickable";

interface UserListItemProps extends ClickableProps {
  children: ReactNode;
}

const UserListItem = React.forwardRef<HTMLLIElement, UserListItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.li
        ref={ref}
        layout
        initial={{ opacity: 0.7, height: 0, y: -31 }}
        animate={{
          opacity: 1,
          height: "auto",
          y: 0,
          transition: { duration: 0.3 },
        }}
        exit={{
          y: -31,
          height: 0,
          opacity: -1,
          transition: { duration: 0.3 },
        }}
        className="border-t border-divider"
      >
        <Clickable bg className="p-3 !rounded-lg -mx-2 flex group justify-between group" {...props}>
          {children}
        </Clickable>
      </motion.li>
    );
  }
);

UserListItem.displayName = "UserListItem";

export default UserListItem;
