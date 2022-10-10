import {
  Button,
  Clickable,
  LayerModalContent,
  LayerModalDescription,
  LayerModalHeader,
  LayerModalNoticeChanges,
  SearchInput,
} from "@app/common";
import useMount from "@hooks/useMount";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppDispatch, useAppSelector } from "@lib/hooks/redux";
import { ServerService } from "@lib/services/server.service";
import { selectServerRoles } from "@lib/store/selectors";
import { addRole } from "@lib/store/slices/roles.slice";
import { addServerRole } from "@lib/store/slices/servers.slice";
import _ from "lodash";
import { useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdChevronRight, MdGroup } from "react-icons/md";
import { Virtuoso } from "react-virtuoso";
import { Role } from "types/server";
import { RoleDragProvider } from "./RoleDragContext";
import ServerRoleRow from "./ServerRoleRow";
import { useServerRolesSettings } from "./ServerRolesSettingsContext";
import { ButtonCol, MemberCol, RoleNameCol, RoleRow } from "./ServerRolesTable";

const ServerRolesList = () => {
  const { server } = useChannel();
  const { setEdit } = useServerRolesSettings();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const mount = useMount();

  const roles = useAppSelector((state) => selectServerRoles(state, server?.id ?? ""));
  const defaultValues = useMemo(() => {
    return { roles };
  }, [roles]);

  const methods = useForm<{ roles: Role[] }>({ defaultValues });
  const formRoles = methods.watch("roles");

  const filterFormRoles = useMemo(() => {
    return formRoles.filter((role) => role.name.includes(search));
  }, [formRoles, search]);

  const handleCreateRole = () => {
    if (!server) return;
    setLoading(true);
    ServerService.createRole(server.id)
      .then(({ data }: { data: Role }) => {
        dispatch(addRole(data));
        dispatch(addServerRole({ id: server.id, roleId: data.id }));
        setEdit(data.id);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handlePositionUpdate = methods.handleSubmit((data) => {
    const oldRoles = data.roles;
    const newRolePositions = oldRoles
      .filter((role, i) => i !== role.position)
      .map((role, i) => ({ id: role.id, position: i }));
    server && ServerService.updateRolePositions(server.id, newRolePositions);
  });

  return (
    <FormProvider {...methods}>
      <LayerModalContent ref={ref}>
        <LayerModalHeader>Roles</LayerModalHeader>
        <LayerModalDescription>
          Use roles to group your server members and assign permissions.
        </LayerModalDescription>
        <Clickable
          onClick={() => {
            server && setEdit(server.id);
          }}
          className="p-4 pr-6 rounded-md flex items-center gap-4 bg-background-secondary"
          bg
        >
          <div className="rounded-full bg-background-primary p-2">
            <MdGroup size={20} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-base">Default Permissions</div>
            <div className="text-xs">@everyone • applies to all server members</div>
          </div>
          <MdChevronRight size={24} />
        </Clickable>
        <div>
          <div className="flex gap-4 pt-4 mb-2">
            <SearchInput
              search={search}
              setSearch={setSearch}
              onChange={(e) => {
                setSearch((e.target as HTMLInputElement).value);
              }}
              placeholder="Search Roles"
            />
            <Button
              loading={loading}
              onClick={handleCreateRole}
              grow
              size="none"
              className="px-4 min-h-full"
            >
              Create Role
            </Button>
          </div>
          <LayerModalDescription>
            Members use the color of the highest role they have on this list. Drag roles to reorder
            them.
          </LayerModalDescription>
        </div>
        <div className="pt-6 select-none pb-12 flex-1 flex flex-col">
          <RoleRow className="text-xs py-2 font-semibold">
            <RoleNameCol>ROLES - {roles.length}</RoleNameCol>
            <MemberCol>MEMBERS</MemberCol>
            <ButtonCol />
          </RoleRow>
          {_.isEmpty(filterFormRoles) && (
            <div className="flex items-center gap-2 py-4 font-semibold text-base text-header-secondary">
              <MdGroup size={30} /> <div>No roles</div>
            </div>
          )}
          <RoleDragProvider>
            <Virtuoso
              customScrollParent={ref.current as HTMLDivElement}
              data={filterFormRoles}
              fixedItemHeight={69}
              increaseViewportBy={300}
              initialItemCount={Math.min(filterFormRoles.length, 6)}
              computeItemKey={(i, role) => role.id}
              itemContent={(i, role) => <ServerRoleRow index={i} role={role} />}
            />
          </RoleDragProvider>
        </div>
      </LayerModalContent>
      <LayerModalNoticeChanges defaultValues={defaultValues} onSubmit={handlePositionUpdate} />
    </FormProvider>
  );
};

export default ServerRolesList;
