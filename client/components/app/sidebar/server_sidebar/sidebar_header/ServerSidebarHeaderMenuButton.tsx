import { Clickable } from "@app/common";
import { ClickableProps } from "@app/common/button/Clickable";
import classNames from "classnames";
import React, { ReactNode } from "react";

interface ServerSidebarHeaderMenuButtonProps extends ClickableProps {
  text: string;
  icon?: ReactNode;
}

const ServerSidebarHeaderMenuButton: React.FC<
  ServerSidebarHeaderMenuButtonProps
> = ({ text, icon, theme = "primary", className, ...props }) => {
  return (
    <Clickable
      {...props}
      theme={theme}
      type="popover"
      className={classNames("flex-center-between", className)}
      {...props}
    >
      <div>{text}</div>
      <div>{icon}</div>
    </Clickable>
  );
};

export default ServerSidebarHeaderMenuButton;
