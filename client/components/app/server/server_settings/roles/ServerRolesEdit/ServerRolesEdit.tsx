import React from "react";
import ServerRolesEditContent from "./ServerRolesEditContent";
import ServerRolesEditSidebar from "./ServerRolesEditSidebar";

const ServerRolesEdit = ({}) => {
  return (
    <div className="flex h-full">
      <ServerRolesEditSidebar />
      <ServerRolesEditContent />
    </div>
  );
};

export default ServerRolesEdit;
