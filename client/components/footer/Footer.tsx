import { Button } from "@components/common";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaDiscord, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import RouteSection, { RouteSectionProps } from "./RouteSection";

const routeSections: RouteSectionProps[] = [
  {
    sectionName: "Product",
    sectionLinks: [{ name: "Download" }, { name: "Nitro" }, { name: "Status" }],
  },
  {
    sectionName: "Company",
    sectionLinks: [{ name: "About" }, { name: "Jobs" }, { name: "Branding" }, { name: "Newsroom" }],
  },
  {
    sectionName: "Resources",
    sectionLinks: [
      { name: "College" },
      { name: "Support" },
      { name: "Safety" },
      { name: "Blog" },
      { name: "Feedback" },
      { name: "Developers" },
      { name: "StreamKit" },
    ],
  },
  {
    sectionName: "Policies",
    sectionLinks: [
      { name: "Terms" },
      { name: "Privacy" },
      { name: "Cookie Settings" },
      { name: "Guidelines" },
      { name: "Acknowledgements" },
      { name: "Licenses" },
      { name: "Moderation" },
    ],
  },
];

const Footer = () => {
  const { status } = useSession();

  return (
    <footer className="bg-[#23272A] text-white theme-dark">
      <div className="p-8 lg:py-16 lg:px-28 xl:py-20 xl:px-40">
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="mr-8 md:mr-24 xl:mr-48 flex-shrink mb-12">
            <h3 className="text-indigo-400 font-bold text-3xl mb-3">IMAGINE A PLACE</h3>
            <div className="gap-4 flex text-2xl">
              <FaTwitter />
              <FaInstagram />
              <FaFacebook />
              <FaYoutube />
            </div>
          </div>
          <div className="flex flex-wrap flex-1 gap-2">
            {routeSections.map((routeSection) => (
              <RouteSection {...routeSection} key={routeSection.sectionName} />
            ))}
          </div>
        </div>
        <div className="w-full h-0 border-t border-indigo-500 my-10" />
        <div className="flex-center-between">
          <div className="flex-center space-x-2 select-none">
            <FaDiscord size={36} />
            <div className="text-lg font-bold">Discord</div>
          </div>
          <Link href={status === "authenticated" ? "channels/@me" : "register"}>
            <Button>{status === "authenticated" ? "Open Discord" : "Sign up"}</Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
