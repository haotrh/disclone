import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import React from "react";
import { MdClose, MdOutlineSearch } from "react-icons/md";
import { motion } from "framer-motion";
import Input, { InputProps } from "./Input";

interface SearchInputProps extends InputProps {
  search: string;
  setSearch: (search: string) => any;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ ref: LegacyRef, search, setSearch, value, ...props }, ref) => {
    return (
      <Input
        value={search}
        onChange={(e) => {
          setSearch((e.target as HTMLInputElement).value);
        }}
        ref={ref}
        {...props}
        suffixNode={
          <AnimatePresence exitBeforeEnter initial={false}>
            {_.isEmpty(search) ? (
              <motion.div
                key="searchInputSearchIcon"
                initial={{ rotate: 60 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.075 }}
              >
                <MdOutlineSearch size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="searchInputCloseIcon"
                initial={{ rotate: 60 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.075 }}
              >
                <MdClose className="cursor-pointer" onClick={() => setSearch("")} size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        }
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
