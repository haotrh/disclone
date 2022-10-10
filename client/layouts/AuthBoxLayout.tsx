import Head from "next/head";
import React, { ReactNode } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";

interface AuthBoxLayoutProps {
  title: string;
  expanded?: boolean;
  children?: ReactNode;
}

const AuthBoxLayout: React.FC<AuthBoxLayoutProps> = ({ title, expanded, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="w-screen min-h-screen flex-center bg-[#5865F2] theme-dark">
        <motion.div
          initial={{ opacity: 0.7, scale: 1.05, y: -75 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.5, type: "spring", bounce: 0.4 },
          }}
          exit={{
            opacity: 0,
            scale: 1.05,
            y: -50,
            transition: { duration: 0.1 },
          }}
          className={classNames("p-7 bg-background-primary rounded-lg shadow-lg text-gray-300", {
            "w-[784px]": expanded,
            "w-[480px] ": !expanded,
          })}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
};

export default AuthBoxLayout;
