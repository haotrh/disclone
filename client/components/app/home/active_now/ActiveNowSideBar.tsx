import React from "react";

const ActiveNowSidebar = () => {
  return (
    <div className="select-none">
      <h3 className="mt-2 mb-4 font-bold text-white text-[22px]">Active Now</h3>
      <div className="text-center pt-3">
        <h4 className="mb-1 font-semibold text-white text-[17px]">
          It&apos;s quiet for now
        </h4>
        <div className="text-interactive-normal text-sm px-6">
          {`When a friend starts an activity—like playing a game or hanging out on
          voice—we'll show it here!`}
        </div>
      </div>
    </div>
  );
};

export default ActiveNowSidebar;
