import { HomeHeader } from "@app/header";
import { ActiveNowSideBar, AddFriend, FriendList, FriendPending } from "@app/home";
import { HomeSidebar } from "@app/sidebar";
import AppLayout from "@layouts/AppLayout";
import { TabProvider } from "@lib/contexts/TabContext";
import { NextPageWithLayout } from "pages/_app";
import { ReactElement, useState } from "react";

export type HomeTabType = "online" | "all" | "pending" | "add_friend";

const Home: NextPageWithLayout = () => {
  const [tab, setTab] = useState<HomeTabType>("online");
  return (
    <TabProvider tab={tab} setTab={setTab}>
      <HomeHeader />
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 min-h-0">
          {tab !== "add_friend" && <FriendList />}
          {tab === "add_friend" && <AddFriend />}
        </div>
        <div className="border-l border-divider flex-[0_1_30%] p-4 pr-2 min-w-[360px] max-w-[420px]">
          <ActiveNowSideBar />
        </div>
      </div>
    </TabProvider>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout sidebar={<HomeSidebar />}>{page}</AppLayout>;
};
