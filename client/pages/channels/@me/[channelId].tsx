import { MemberSidebar } from "@app/channel";
import { ChatContent, ChatForm } from "@app/chat";
import { ChannelHeader } from "@app/header";
import { HomeSidebar } from "@app/sidebar";
import { useAppSelector } from "@hooks/redux";
import AppLayout from "@layouts/AppLayout";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { ReactElement } from "react";

const HomeChannel: NextPageWithLayout = () => {
  const router = useRouter();
  const channel = useAppSelector((state) => state.channels[router.query.channelId as string]);

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
      </div>
    </>
  );
};

export default HomeChannel;

HomeChannel.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout sidebar={<HomeSidebar />}>{page}</AppLayout>;
};
