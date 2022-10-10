import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@components/common";
import { useSize } from "mini-virtual-list";

const HeroBanner: React.FC = () => {
  const { status } = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useSize(ref);

  return (
    <div className="bg-[#404EED] relative mb-4 overflow-hidden">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-center-between max-w-7xl pt-7 px-7 mx-auto text-white"
      >
        <div className="flex-center space-x-2 select-none">
          <FaDiscord size={36} />
          <div className="text-lg font-bold">Discord</div>
        </div>
        <Link href={status === "authenticated" ? "channels/@me" : "login"}>
          <Button size="small" theme="white">
            {status === "authenticated" ? "Open Discord" : "Login"}
          </Button>
        </Link>
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="flex items-start md:items-center flex-col mx-auto pt-20 md:pt-36 lg:pt-48 pb-48 xs:pb-60 sm:pb-72 md:pb-32 z-20 relative text-white px-4 md:px-2"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-8 max-w-3xl sm:text-center">
          IMAGINE A PLACE...
        </h1>
        <h2 className="md:text-center text-lg sm:text-xl max-w-3xl mb-4">
          ...where you can belong to a school club, a gaming group, or a worldwide art community.
          Where just you and a handful of friends can spend time together. A place that makes it
          easy to talk every day and hang out more often.
        </h2>
        <Link href="/channels/@me" passHref>
          <Button size="large" className="!text-[16px] sm:!text-xl" theme="black">
            Open Discord in your browser
          </Button>
        </Link>
      </motion.div>
      <div
        ref={ref}
        className="absolute bottom-0 inset-0 select-none z-10 w-full h-full pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 300 }}
          whileInView={{
            opacity: 1,
            y: 0,
            backgroundPosition: ["0  100%", "100vw 100%"],
          }}
          viewport={{ once: true }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            opacity: { duration: 0.5 },
            y: { duration: 0.75 },
          }}
          className="bottom-0 absolute max-w-none w-[500vw] sm:w-screen h-[600px]"
          style={{
            background: `url("/images/bg-sky.svg") repeat-x 100% / 100% auto`,
          }}
        />
        {width > 750 && (
          <motion.div
            className="bottom-0 absolute max-w-[80%] md:max-w-[50%]"
            initial={{ right: "20%", opacity: 0 }}
            whileInView={{
              y: [0, -6],
              right: "-15%",
              opacity: 1,
            }}
            viewport={{ margin: "-10%", once: true }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 1.2,
              right: { duration: 0.92 },
              opacity: { duration: 0.84 },
            }}
          >
            <img className="relative" alt="" src="/images/bg-group-1.svg" />
          </motion.div>
        )}
        <motion.div
          className="bottom-0 absolute max-w-[85%] sm:max-w-[75%] md:max-w-[50%]"
          initial={{ left: "20%", opacity: 0 }}
          whileInView={{ y: [0, -6], left: "-15%", opacity: 1 }}
          viewport={{ margin: "-10%", once: true }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1.4,
            left: { duration: 0.92 },
            opacity: { duration: 0.84 },
          }}
        >
          <img className="relative" alt="" src="/images/bg-group-2.svg" />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
