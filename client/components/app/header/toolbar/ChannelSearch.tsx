import { Input, SearchInput } from "@app/common";
import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdClose, MdOutlineSearch } from "react-icons/md";

const ChannelSearch: React.FC = ({}) => {
  const [search, setSearch] = useState("");

  return (
    <Input
      placeholder="Search"
      inputClassName="!py-0 !pl-1 font-medium text-sm"
      className="py-1 px-0"
      value={search}
      onChange={(e) => {
        setSearch((e.target as HTMLInputElement).value);
      }}
      suffixNode={
        <AnimatePresence exitBeforeEnter initial={false}>
          {_.isEmpty(search) ? (
            <motion.div
              key="searchInputSearchIcon"
              initial={{ rotate: 60 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.075 }}
            >
              <MdOutlineSearch size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="searchInputCloseIcon"
              initial={{ rotate: 60 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.075 }}
            >
              <MdClose
                className="cursor-pointer"
                onClick={() => setSearch("")}
                size={18}
              />
            </motion.div>
          )}
        </AnimatePresence>
      }
    />
  );
};

export default ChannelSearch;
