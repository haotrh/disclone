import { CopyButton } from "@app/common";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useTab } from "@lib/contexts/TabContext";
import { useAppDispatch } from "@lib/hooks/redux";
import { ServerService } from "@lib/services/server.service";
import { updateServer } from "@lib/store/slices/servers.slice";
import React, { useEffect } from "react";
import { InviteFormTab } from "./InviteForm";

const InviteLink = () => {
  const { server } = useChannel();
  const dispatch = useAppDispatch();
  const { setTab } = useTab<InviteFormTab>();

  useEffect(() => {
    if (!server) return;
    if (!server.currentInviteCode) {
      (async () => {
        try {
          const invite = (await ServerService.createInvite(server.id, 604800, 0)).data;

          dispatch(
            updateServer({
              id: server.id,
              currentInviteCode: invite.code,
            })
          );
        } catch (e: any) {
          console.log(e?.response || e);
        }
      })();
    }
  }, []);

  return (
    <div>
      <div className="px-4 py-2 shadow shadow-background-tertiary">
        <h1 className="text-header-primary font-semibold text-[17px] my-2">
          Invite friends to {server?.name}
        </h1>
      </div>
      <div className="p-4">
        <div className="text-header-secondary font-semibold select-none text-[13px] mb-2">
          SEND THIS INVITE LINK TO A FRIEND
        </div>
        <div className="p-1 rounded bg-input-background flex justify-between items-center">
          <div className="p-1 overflow-hidden text-ellipsis">
            http://localhost:3000/invite/{server?.currentInviteCode}
          </div>
          <CopyButton text={`http://localhost:3000/invite/${server?.currentInviteCode}`} />
        </div>
        <div className="text-text-muted text-xs mt-1">
          Your invite link expires in 7 days.{" "}
          <span
            onClick={() => {
              setTab("create");
            }}
            className="text-sky-400 hover:underline cursor-pointer"
          >
            Edit invite link.
          </span>
        </div>
      </div>
    </div>
  );
};

export default InviteLink;
