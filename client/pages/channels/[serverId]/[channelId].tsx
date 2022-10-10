import { MemberSidebar } from "@app/channel";
import { ChatContent, ChatForm } from "@app/chat";
import { ChannelHeader } from "@app/header";
import { ServerSidebar } from "@app/sidebar";
import AppLayout from "@layouts/AppLayout";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useAppDispatch } from "@lib/hooks/redux";
import { ServerService } from "@lib/services/server.service";
import { addMembers } from "@lib/store/slices/members.slice";
import { updateServer } from "@lib/store/slices/servers.slice";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { ReactElement, useEffect } from "react";

const ChannelPage: NextPageWithLayout = () => {
  const { server, channel } = useChannel();
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (server && !server.fetchMembers) {
      (async () => {
        try {
          const members = await ServerService.getServerMembers(server.id);

          dispatch(addMembers({ members: members.data, serverId: server.id }));
          dispatch(
            updateServer({
              id: server.id,
              fetchMembers: true,
            })
          );
        } catch (e: any) {
          console.log(e);
        }
      })();
    }
  }, [server?.id]);

  if (!server) {
    router.push("/channels/@me");
    return null;
  }

  if (!channel) {
    return null;
  }

  return (
    <>
      <ChannelHeader />
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <ChatContent />
          <ChatForm />
        </div>
        <MemberSidebar />
      </div>
    </>
  );
};

export default ChannelPage;

ChannelPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout sidebar={<ServerSidebar />}>{page}</AppLayout>;
};
