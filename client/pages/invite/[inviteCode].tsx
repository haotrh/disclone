import axios from "axios";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiEmotionSadFill } from "react-icons/ri";
import AuthBoxLayout from "@layouts/AuthBoxLayout";
import { AnimatePresence } from "framer-motion";
import { Invite } from "types/server";
import { Avatar, Button, StatusIcon } from "@app/common";
import { ServerService } from "@lib/services/server.service";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let invite: Invite | null = null;
  try {
    invite = (
      await axios.get(`/invites/${context?.params?.inviteCode}`, {
        params: {
          with_counts: true,
        },
      })
    ).data;
  } catch (e: any) {
    console.log(e?.response ?? e);
  }

  return {
    props: { invite },
  };
};

const InvitePage = ({ invite }: { invite: Invite | null }) => {
  const session = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onClick = () => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
    if (session.status === "authenticated") {
      if (invite?.server) {
        setLoading(true);
        ServerService.joinServer(invite.server.id, invite.code)
          .then(() => {
            router.push(
              `/channels/${invite.server.id}/${invite.server.systemChannelId}`
            );
          })
          .catch((e) => {
            console.log(e?.reponse ?? e);
            setLoading(false);
          });
      }
    }
  };

  return (
    <AnimatePresence initial={false}>
      <AuthBoxLayout title="Invite">
        {invite ? (
          <div className="flex-center flex-col">
            <div className="mb-6">
              <Avatar user={invite.inviter} size={80} />
            </div>
            <div className="text-header-secondary font-medium mb-1">
              {invite.inviter.username} đã mời bạn tham gia
            </div>
            <div className="text-3xl font-semibold text-header-primary mb-2">
              {invite.server.name}
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <StatusIcon status="online" />
                <div>{invite.presenceCount} Trực tuyến</div>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIcon status="offline" />
                <div>{invite.memberCount} thành viên</div>
              </div>
            </div>
            <Button
              onClick={onClick}
              loading={session.status === "loading" || loading}
              size="large"
              className="!w-full text-[16px]"
            >
              {session.status === "authenticated" && (
                <div>
                  Tham gia{" "}
                  <span className="font-black">{invite.server.name}</span>
                </div>
              )}
              {session.status === "unauthenticated" && "Đăng nhập để tiếp tục"}
            </Button>
          </div>
        ) : (
          <div className="flex-center flex-col">
            <div className="text-text-muted">
              <RiEmotionSadFill size={80} />
            </div>
            <h1 className="text-header-primary text-2xl font-bold mb-2">
              Lời Mời Không Hợp Lệ
            </h1>
            <div className="text-header-secondary text-center mb-6">
              Lời mời này có thể đã hết hạn, hoặc bạn không được phép tham gia.
            </div>
            <Button
              onClick={() => {
                setLoading(true);
                router.push("/channels/@me");
              }}
              loading={loading}
              size="large"
              className="!w-full text-[17px]"
            >
              Tiếp tục vào Discord
            </Button>
          </div>
        )}
      </AuthBoxLayout>
    </AnimatePresence>
  );
};

export default InvitePage;
