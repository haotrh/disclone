import {
  Divider,
  LayerModalContent,
  LayerModalDescription,
  LayerModalHeader,
} from "@app/common";
import classNames from "classnames";
import { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import PrivateChannelSettings from "./PrivateChannelSettings";
import { AnimatePresence, motion } from "framer-motion";
import AdvancedPermissionsSettings from "./AdvancedPermissionsSettings";

const ChannelPermissionsSettings = () => {
  const [isExpended, setIsExpended] = useState(true);

  return (
    <LayerModalContent>
      <LayerModalHeader>Channel Permissions</LayerModalHeader>
      <LayerModalDescription>
        Use permissions to customize who can do what in this channel
      </LayerModalDescription>
      <PrivateChannelSettings />
      <Divider spacing="medium" />
      <LayerModalHeader>
        <div
          onClick={() => setIsExpended(!isExpended)}
          className="flex gap-2 items-center select-none cursor-pointer"
        >
          <div>Advanced permissions</div>
          <div
            className={classNames("transition", {
              "-rotate-90": !isExpended,
            })}
          >
            <IoChevronDownOutline size={16} />
          </div>
        </div>
      </LayerModalHeader>
      <AnimatePresence initial={false}>
        {isExpended && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <AdvancedPermissionsSettings />
          </motion.div>
        )}
      </AnimatePresence>
    </LayerModalContent>
  );
};

export default ChannelPermissionsSettings;
