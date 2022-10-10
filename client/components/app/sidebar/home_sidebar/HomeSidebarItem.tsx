import { Clickable } from "@app/common";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

interface HomeSidebarItemProps {
  path: string;
  children?: ReactNode;
  className?: string;
}

const HomeSidebarItem: React.FC<HomeSidebarItemProps> = ({ path, children, className }) => {
  const router = useRouter();

  return (
    <li className="px-2">
      <Link href={path} passHref>
        <Clickable bg selected={router.asPath === path} className="h-[42px]">
          <a className={className}>{children}</a>
        </Clickable>
      </Link>
    </li>
  );
};

export default HomeSidebarItem;
