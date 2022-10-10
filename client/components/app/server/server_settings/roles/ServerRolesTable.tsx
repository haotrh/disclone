import { decimalToRgb } from "@utils/colors";
import classNames from "classnames";
import { HTMLProps } from "react";
import { RiShieldUserFill } from "react-icons/ri";
import { Role } from "types/server";

export const RoleRow = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    className={classNames(
      "flex items-center border-b border-divider text-header-secondary -mb-px",
      className
    )}
  />
);
export const RoleNameCol = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div {...props} style={{ flex: "0 1 273px" }} className={classNames(className)} />
);
export const MemberCol = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    style={{ flex: "0 0 112px" }}
    className={classNames(className, "mr-4 flex justify-end items-center")}
  />
);
export const ButtonCol = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    style={{ flex: "1 0 88px" }}
    className={classNames(className, "mr-4 flex justify-end items-center")}
  />
);

export const RoleContainer = ({
  role,
  size = "large",
}: {
  role: Role;
  size?: "small" | "large";
}) => (
  <div
    className={classNames("flex items-center", {
      "gap-1": size === "small",
      "gap-2.5": size === "large",
    })}
  >
    <RiShieldUserFill color={decimalToRgb(role.color)} size={size === "small" ? 20 : 24} />
    <div className="leading-4">{role.name}</div>
  </div>
);
