import { LayerModalDescription, SearchInput, Toggle } from "@app/common";
import { permissionCheck } from "@utils/permissions";
import _ from "lodash";
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MdSearchOff } from "react-icons/md";
import { rolePermissionsList } from "types/permissions";
import { Role } from "types/server";

const RolePermissionsSettings = () => {
  const [search, setSearch] = useState("");

  const { control } = useFormContext<Role>();

  const filteredRolePermissionsList = useMemo(() => {
    return rolePermissionsList.filter((permission) =>
      permission.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  }, [search]);

  const newPermission = (currentPermission: string, permission: number) => {
    return (parseInt(currentPermission) ^ permission).toString();
  };

  return (
    <div>
      <SearchInput
        search={search}
        setSearch={setSearch}
        placeholder="Search permissions"
      />
      {_.isEmpty(filteredRolePermissionsList) && (
        <div className="flex-center flex-col p-10">
          <MdSearchOff size={100} />
          <div className="text-sm">No permissions found</div>
        </div>
      )}
      {filteredRolePermissionsList.map((permission) => (
        <div
          key={permission.name}
          className="border-b border-divider py-5"
        >
          <Controller
            control={control}
            name="permissions"
            render={({ field: { value: currentPermissions, onChange } }) => (
              <Toggle
                active={permissionCheck(
                  currentPermissions,
                  permission.permission
                )}
                onClick={() =>
                  onChange(
                    newPermission(currentPermissions, permission.permission)
                  )
                }
                className="mb-2"
                label={permission.name}
              />
            )}
          />
          <LayerModalDescription>
            {permission.description}
          </LayerModalDescription>
        </div>
      ))}
    </div>
  );
};

export default RolePermissionsSettings;
