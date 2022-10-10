import React from "react";

const SearchBar = () => {
  return (
    <div className="shadow-sm shadow-background-tertiary h-12 p-2.5 flex-center">
      <button
        className="bg-background-tertiary rounded flex-1 h-full
      text-text-muted px-1.5 text-sm text-left font-medium"
      >
        Find or start a conversation
      </button>
    </div>
  );
};

export default SearchBar;
