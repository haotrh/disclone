import { useState } from "react";
import { ServerRolesEdit } from "./ServerRolesEdit";
import ServerRolesList from "./ServerRolesList";
import { ServerRolesSettingsProvider } from "./ServerRolesSettingsContext";

const ServerRolesSettings: React.FC = ({}) => {
  const [edit, setEdit] = useState<string | null>(null);

  return (
    <ServerRolesSettingsProvider edit={edit} setEdit={setEdit}>
      {edit ? <ServerRolesEdit /> : <ServerRolesList />}
    </ServerRolesSettingsProvider>
  );
};

export default ServerRolesSettings;
