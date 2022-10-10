import React, { HTMLProps } from "react";
import { IoSearchOutline } from "react-icons/io5";

interface HomeSearchBarProps extends HTMLProps<HTMLInputElement> {}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({ ...props }) => {
  return (
    <div className="px-2.5">
      <div className="bg-background-tertiary py-1.5 px-2.5 rounded flex m-4">
        <input {...props} className="bg-transparent flex-1" />
        <div className="flex-center text-header-secondary">
          <IoSearchOutline size={20} />
        </div>
      </div>
    </div>
  );
};

export default HomeSearchBar;
