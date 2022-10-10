import {
  Avatar,
  Divider,
  LayerModalContent,
  LayerModalDescription,
  LayerModalHeader,
  NameWithNumber,
  Table,
} from "@app/common";
import Countdown from "@app/common/Countdown";
import { useChannel } from "@contexts/ChannelContext";
import { ServerService } from "@services/server.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { Invite } from "types/server";

const ServerInviteSettings = () => {
  const { server } = useChannel();
  const queryClient = useQueryClient();
  const { data } = useQuery(["invite", server?.id], () =>
    ServerService.getInvites(server?.id ?? "")
  );
  const { mutate } = useMutation(ServerService.deleteInvite, {
    onSuccess: (data, inviteCode) => {
      queryClient.setQueryData<Invite[]>(["invite", server?.id], (old) =>
        old?.filter((invite) => invite.code !== inviteCode)
      );
    },
  });

  return (
    <LayerModalContent>
      <LayerModalHeader>Invites</LayerModalHeader>
      <LayerModalDescription>
        Here&apos;s a list of all active invite links. You can revoke any one.
      </LayerModalDescription>
      <Divider className="!m-0" />
      {data && !_.isEmpty(data) ? (
        <Table
          data={data}
          columns={[
            {
              title: "Inviter",
              field: "inviter",
              flexStyle: "3 1 0px",
              render: ({ inviter }) => (
                <div className="flex items-center gap-2 min-w-0 overflow-hidden mr-2">
                  <Avatar noStatus size={24} user={inviter} />
                  <NameWithNumber
                    user={inviter}
                    className="overflow-ellipsis overflow-hidden whitespace-nowrap"
                  />
                </div>
              ),
            },
            {
              title: "Invite Code",
              field: "code",
              flexStyle: "3 1 0px",
              render: ({ code }) => <div className="font-[Consolas]">{code}</div>,
            },
            {
              title: "Uses",
              field: "uses",
              className: "text-right",
              flexStyle: "1 1 0px",
              render: ({ uses, maxUses }) => (
                <div className="font-[Consolas]">{maxUses === 0 ? 0 : `${uses}/${maxUses}`}</div>
              ),
            },
            {
              title: "Expires",
              field: "code",
              className: "text-right",
              flexStyle: "2 1 0px",
              render: ({ expiresAt }) => (
                <div className="font-[Consolas]">
                  {expiresAt ? <Countdown targetDate={expiresAt} /> : "∞"}
                </div>
              ),
            },
          ]}
          rowKey="code"
          handleDeleteRow={({ code }) => mutate(code)}
        />
      ) : (
        <div className="flex-center flex-col gap-2 text-text-muted select-none">
          <img className="select-none" src="/images/invite.svg" alt="" />
          <div className="text-[17px] font-semibold mt-6">NO INVITES YET</div>
          <div className="max-w-[440px] text-center">
            Feeling aimless? Like a paper plane drifting through the skies? Get some friends in here
            by creating an invite link!
          </div>
        </div>
      )}
    </LayerModalContent>
  );
};

export default ServerInviteSettings;
