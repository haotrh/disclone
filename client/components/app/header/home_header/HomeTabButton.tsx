import { useTab } from "@lib/contexts/TabContext";
import classNames from "classnames";
import { HomeTabType } from "pages/channels/@me";
import React, { HTMLProps, useMemo } from "react";

interface HomeTabButtonProps extends HTMLProps<HTMLDivElement> {
  targetTab: HomeTabType;
}

const HomeTabButton: React.FC<HomeTabButtonProps> = ({
  className,
  targetTab,
  ...props
}) => {
  const { tab, setTab } = useTab<HomeTabType>();
  const selected = useMemo(() => {
    return tab === targetTab;
  }, [tab, targetTab]);

  const handleClick = () => {
    setTab(targetTab);
  };

  return (
    <div
      {...props}
      onClick={handleClick}
      className={classNames(className, "interactive flex-center", {
        "!cursor-default": selected,
        "text-interactive-active bg-background-modifier-selected": selected && !className,
        "text-interactive-normal hover:text-interactive-hover":
          !selected && !className,
        "hover:bg-background-modifier-hover px-2 py-0.5 rounded active:text-interactive-active":
          !className,
      })}
    />
  );
};

export default HomeTabButton;
