import { ModalRender, Tooltip } from "@app/common";
import { CreateServerForm } from "@app/server";
import serverShortname from "@utils/serverShortname";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { HTMLProps, ReactNode, useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { MdExplore } from "react-icons/md";
import { ServerState } from "types/store.interfaces";

type ServerNavbarItemTheme = "blue" | "green" | "none";

interface ServerNavbarItemProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  active?: boolean;
  theme?: ServerNavbarItemTheme;
  noPill?: boolean;
  tooltipContent: ReactNode;
}

const ServerNavbarItem: React.FC<ServerNavbarItemProps> = ({
  children,
  href,
  active,
  theme = "blue",
  noPill = false,
  onClick,
  tooltipContent,
  ...props
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { asPath, isReady, push } = useRouter();

  useEffect(() => {
    (() => {
      if (!_.isUndefined(active)) {
        setIsActive(active);
        return;
      }
      if (isReady) {
        const linkPathname = new URL(href || "", location.href).pathname;

        const activePathname = new URL(asPath, location.href).pathname;

        setIsActive(linkPathname === activePathname || activePathname.includes(linkPathname));
        return;
      }
      setIsActive(false);
    })();
  }, [isReady, asPath, href, active]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (href) {
      push(href);
    } else {
      onClick && onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (!active) {
      setIsSelected(true);
    }
  };

  const handleMouseLeave = () => {
    setIsSelected(false);
  };

  return (
    <Tooltip
      content={
        <div className="text-base font-semibold overflow-hidden text-ellipsis line-clamp-2">
          {tooltipContent}
        </div>
      }
      placement="right"
    >
      <div {...props} className={classNames("w-full flex-center select-none relative")}>
        <div className="absolute top-0 left-0 h-full flex-center">
          <AnimatePresence>
            {!noPill && (isActive || isSelected) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, height: isActive ? 40 : 20 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.125 }}
                className="w-2 bg-header-primary -ml-1 rounded"
              />
            )}
          </AnimatePresence>
        </div>
        <div
          className={classNames(
            "h-12 w-12 transition-all duration-300 flex-center overflow-hidden",
            "cursor-pointer active:translate-y-0.5 font-medium",
            {
              "text-white rounded-2xl": isActive || isSelected,
              "bg-primary": (isActive || isSelected) && theme === "blue",
              "bg-green-0": (isActive || isSelected) && theme === "green",
              "text-green-0": !(isActive || isSelected) && theme === "green",
              "bg-background-primary": !isSelected && !isActive && theme !== "none",
              "rounded-[24px]": !isSelected && !isActive,
            }
          )}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </div>
    </Tooltip>
  );
};

const HomeButton = () => {
  return (
    <ServerNavbarItem tooltipContent="Home" href="/channels/@me">
      <FaDiscord size={28} />
    </ServerNavbarItem>
  );
};

const ExplorePublicServerButton = () => {
  return (
    <ServerNavbarItem tooltipContent="Explore Public Servers" theme="green" href="/guild-discovery">
      <MdExplore size={24} />
    </ServerNavbarItem>
  );
};

const ServerButton = ({ server, active }: { server: ServerState; active: boolean }) => {
  return (
    <ServerNavbarItem
      tooltipContent={server.name}
      href={`/channels/${server.id}/${server.systemChannelId ?? server.channels[0]}`}
      theme={server.icon ? "none" : "blue"}
      active={active}
    >
      {server.icon ? (
        <img src={server.icon} className="w-full h-full" />
      ) : (
        serverShortname(server.name)
      )}
    </ServerNavbarItem>
  );
};

const CreateServerButton = () => {
  return (
    <ModalRender modal={<CreateServerForm />}>
      {(isOpen) => (
        <ServerNavbarItem tooltipContent="Add a Server" theme="green" noPill={true} active={isOpen}>
          <IoAdd size={26} />
        </ServerNavbarItem>
      )}
    </ModalRender>
  );
};

export { HomeButton, ExplorePublicServerButton, ServerButton, CreateServerButton };

export default ServerNavbarItem;
