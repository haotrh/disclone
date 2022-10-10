import { Popover } from "@app/common";
import { useChannel } from "@lib/contexts/ChannelContext";
import { imageKitLoader } from "@utils/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { IoChevronDownOutline, IoClose } from "react-icons/io5";
import ServerSidebarHeaderMenu from "./ServerSidebarHeaderMenu";

interface ServerSidebarHeaderProps {
  scrollPosition: MotionValue<number>;
}

const ServerSidebarHeader: React.FC<ServerSidebarHeaderProps> = ({ scrollPosition }) => {
  const opacity = useTransform(scrollPosition, [1, 87], [1, 0]);
  const containerY = useTransform(scrollPosition, [1, 87], [0, -87]);
  const imageY = useTransform(scrollPosition, [1, 87], [0, 60]);
  const scale = useTransform(scrollPosition, [0, 87], [1, 1.2]);

  const [showMenu, setShowMenu] = useState(false);
  const { server } = useChannel();
  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  if (!server) {
    return null;
  }

  return (
    <div className="relative w-full hover:bg-background-primary shadow">
      <Popover
        animation={true}
        handleHide={handleCloseMenu}
        arrow={false}
        interactive={true}
        visible={showMenu}
        content={<ServerSidebarHeaderMenu />}
      >
        <header
          onClick={() => {
            setShowMenu(!showMenu);
          }}
          className="h-[48px] select-none cursor-pointer transition-colors relative shadow-background-tertiary
     items-center px-4 text-header-primary flex justify-between font-semibold flex-shrink-0 z-50 w-full"
        >
          <div className="flex-1 overflow-hidden text-ellipsis mr-2 whitespace-nowrap">{server.name}</div>
          <div className="flex-shrink-0">
            {showMenu ? <IoClose size={20} /> : <IoChevronDownOutline size={20} />}
          </div>
        </header>
      </Popover>
      {server.splash && (
        <motion.div style={{ y: containerY, opacity }} className="absolute top-0 overflow-hidden">
          <motion.div style={{ y: imageY, scale }}>
            <Image loader={imageKitLoader} src={server.splash} width={240} height={135} alt="" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ServerSidebarHeader;
