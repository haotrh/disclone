import { LayerModalContent, LayerModalNoticeChanges } from "@app/common";
import { useChannel } from "@lib/contexts/ChannelContext";
import { TabProvider } from "@lib/contexts/TabContext";
import { useAppDispatch } from "@lib/hooks/redux";
import { ServerService } from "@lib/services/server.service";
import { updateRole } from "@lib/store/slices/roles.slice";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Role } from "types/server";
import { useServerRolesSettings } from "../ServerRolesSettingsContext";
import RoleDisplaySettings from "./RoleDisplaySettings";
import RoleManageMembers from "./RoleManageMembers";
import RolePermissionsSettings from "./RolePermissionsSettings";
import ServerRolesEditTab from "./ServerRolesEditTab";

export type RoleEditTabType = "display" | "permissions" | "manage_members";

const ServerRolesEditContent = () => {
  const { edit, role } = useServerRolesSettings();
  const { server } = useChannel();
  const dispatch = useAppDispatch();
  const isEveryoneRole = useMemo(() => {
    return edit === server?.id;
  }, [edit, server?.id]);
  const methods = useForm<Role>({ defaultValues: role ?? ({} as Role) });
  const [tab, setTab] = useState<RoleEditTabType>("display");
  const onSubmit = methods.handleSubmit(async (data) => {
    if (!server) return;
    try {
      const res = await ServerService.updateRole(server.id, data.id, data);
      dispatch(updateRole(res.data));
    } catch {}
  });
  useEffect(() => {
    role && methods.reset(role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  if (!edit || !role) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <TabProvider tab={tab} setTab={setTab}>
        <div className="w-full">
          <LayerModalContent className="!max-w-[508px]">
            <div className="px-5 flex-1 flex flex-col min-h-0 max-h-full absolute top-0 left-0 w-full">
              <div className="max-w-[508px] w-full">
                <div className="pt-[60px] sticky top-0 bg-background-primary z-40">
                  <h1 className="uppercase font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">
                    EDIT ROLE — {role.name}
                  </h1>
                  <div className="pt-8 mb-4">
                    <ServerRolesEditTab />
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  {isEveryoneRole ? (
                    <RolePermissionsSettings />
                  ) : (
                    <>
                      {tab === "display" && <RoleDisplaySettings />}
                      {tab === "permissions" && <RolePermissionsSettings />}
                      {tab === "manage_members" && <RoleManageMembers />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </LayerModalContent>
        </div>
        <LayerModalNoticeChanges defaultValues={role} onSubmit={onSubmit} />
      </TabProvider>
    </FormProvider>
  );
};

export default ServerRolesEditContent;
