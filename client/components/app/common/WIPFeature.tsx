import React from "react";

const WIPFeature = () => {
  return (
    <div className="flex-center py-10 flex-col gap-2 text-text-muted select-none">
      <img src="/images/construction.svg" alt="work in progress" />
      <div className="text-lg font-semibold mt-2">WORK IN PROGRESS</div>
      <div className="max-w-[400px] text-center">
        This feature is currently under development. Please wait for next
        updates!
      </div>
    </div>
  );
};

export default WIPFeature;
