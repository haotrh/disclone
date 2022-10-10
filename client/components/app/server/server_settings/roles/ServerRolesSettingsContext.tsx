import { useAppSelector } from "@hooks/redux";
import { selectRole } from "@store/selectors";
import React, { ReactNode, useContext } from "react";
import { Role } from "types/server";

interface IServerRolesSettingsContext {
  edit: string | null;
  setEdit: (roleId: string | null) => any;
  role: Role | null;
}

export const ServerRolesSettingsContext =
  React.createContext<IServerRolesSettingsContext>(
    {} as IServerRolesSettingsContext
  );

type ServerRolesSettingsProviderProps = {
  children: ReactNode;
  edit: string | null;
  setEdit: (roleId: string | null) => any;
};

const ServerRolesSettingsProvider = ({
  children,
  edit,
  setEdit,
}: ServerRolesSettingsProviderProps) => {
  const role = useAppSelector((state) =>
    edit ? selectRole(state, edit) : null
  );

  return (
    <ServerRolesSettingsContext.Provider value={{ edit, role, setEdit }}>
      {children}
    </ServerRolesSettingsContext.Provider>
  );
};

const useServerRolesSettings = (): IServerRolesSettingsContext => {
  const context = useContext(ServerRolesSettingsContext);

  if (context == undefined) {
    throw new Error(
      "useServerRolesSettings must be used within a ServerRolesSettingsProvider"
    );
  }

  return context;
};

export { ServerRolesSettingsProvider, useServerRolesSettings };
