import { useAppSelector } from "@lib/hooks/redux";
import _ from "lodash";
import { useRouter } from "next/router";
import {
  CreateServerButton,
  ExplorePublicServerButton,
  HomeButton,
  ServerButton,
} from "./ServerNavbarItem";

const ServerNavbarDivider = () => {
  return <div className="mb-2 mx-auto w-[32px] h-0.5 bg-background-secondary"></div>;
};

const ServerNavbar = () => {
  const serverList = useAppSelector((selector) => selector.servers);
  const router = useRouter();

  return (
    <nav className="w-[72px] bg-background-tertiary flex-col justify-center py-3 flex-shrink-0 space-y-2 no-scrollbar overflow-scroll">
      <HomeButton />
      <ServerNavbarDivider />
      {_.values(serverList).map((server) => (
        <ServerButton
          active={server.id === router.query.serverId}
          key={server.id}
          server={server}
        />
      ))}
      <CreateServerButton />
      {/* <ExplorePublicServerButton /> */}
    </nav>
  );
};

export default ServerNavbar;
