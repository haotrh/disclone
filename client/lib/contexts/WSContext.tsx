import { useAppDispatch } from "@lib/hooks/redux";
import {
  addChannel,
  addChannels,
  deleteChannel,
  updateChannel,
} from "@lib/store/slices/channels.slice";
import {
  addInfo,
  addRelationship,
  removeRelationship,
  updateInfo,
  updateSettings,
} from "@lib/store/slices/me.slice";
import {
  addMessage,
  deleteMessage,
  updateMessage,
  convertMessageToMessageState,
} from "@lib/store/slices/messages.slice";
import {
  addServer,
  addServerChannel,
  addServerRole,
  addServers,
  deleteServer,
  removeServerChannel,
  removeServerRole,
  updateServer,
} from "@lib/store/slices/servers.slice";
import { addEmoji, deleteEmoji, updateEmoji } from "@store/slices/emoji.slice";
import {
  addMember,
  addMemberRole,
  deleteMember,
  removeMemberRole,
  updateMember,
} from "@store/slices/members.slice";
import { addRole, deleteRole, updateRole } from "@store/slices/roles.slice";
import { addUser, updateUser } from "@store/slices/users.slice";
import _ from "lodash";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { ComponentType, ReactNode, useContext, useMemo, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Message } from "types/message";
import { WSResponseEventMap } from "types/ws.interfaces";

interface IWSContext {
  socket: Socket | null;
  isInitialized: boolean;
  reconnecting: boolean;
  disconnected: boolean;
  retry: string | undefined;
}

export const WSContext = React.createContext<IWSContext>({} as IWSContext);

type WSProviderProps = { children: ReactNode };

const WSProvider = React.memo(({ children }: WSProviderProps) => {
  const session = useSession();
  const [isInitialized, setInitialized] = useState(false);
  const [retry, setRetry] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userId = useRef<string>("");

  const socket = useMemo(() => {
    try {
      const socket: Socket<WSResponseEventMap> = io(process.env.NEXT_PUBLIC_WS_URL, {
        query: { token: session.data?.accessToken },
      });

      socket.on("READY", (data) => {
        const { user, servers, settings, relationships, dmChannels } = data;
        dispatch(addServers(servers));
        dispatch(addInfo(user));
        dispatch(updateSettings(settings));
        dispatch(addChannels(dmChannels));
        relationships.forEach((relationship) => dispatch(addRelationship(relationship)));
        userId.current = user.id;
        setInitialized(true);
      });

      socket.on("SERVER_CREATE", (server) => {
        dispatch(addServer(server));
      });

      socket.on("SERVER_UPDATE", (server) => {
        dispatch(updateServer(server));
      });

      socket.on("SERVER_DELETE", (server) => {
        router.push("/channels/@me");
        dispatch(deleteServer(server));
      });

      socket.on("MESSAGE_CREATE", (message) => {
        dispatch(addMessage(message));
      });

      socket.on("MESSAGE_UPDATE", (message) => {
        const messageState = convertMessageToMessageState(message as Message);
        dispatch(updateMessage({ ...messageState, assign: true }));
      });

      socket.on("MESSAGE_DELETE", (deletedMessage) => {
        dispatch(deleteMessage(deletedMessage));
      });

      socket.on("CHANNEL_CREATE", (channel) => {
        dispatch(addChannel(channel));
        dispatch(addServerChannel({ id: channel.serverId, channelId: channel.id }));
      });

      socket.on("CHANNEL_UPDATE", (updatedChannel) => {
        dispatch(updateChannel(updatedChannel));
      });

      socket.on("CHANNEL_DELETE", (channel) => {
        dispatch(deleteChannel(channel));
        channel.serverId &&
          dispatch(removeServerChannel({ id: channel.serverId, channelId: channel.id }));
      });

      socket.on("SERVER_MEMBER_ADD", (data) => {
        dispatch(addMember(data));
        dispatch(addUser(data.member.user));
      });

      socket.on("SERVER_MEMBER_REMOVE", (member) => {
        dispatch(deleteMember(member));
      });

      socket.on("SERVER_MEMBER_UPDATE", (data) => {
        dispatch(updateMember(data));
      });

      socket.on("SERVER_MEMBER_ROLE_ADD", (data) => {
        dispatch(addMemberRole(data));
      });

      socket.on("SERVER_MEMBER_ROLE_REMOVE", (data) => {
        dispatch(removeMemberRole(data));
      });

      socket.on("SERVER_ROLE_CREATE", ({ role, serverId }) => {
        dispatch(addRole(role));
        dispatch(addServerRole({ id: serverId, roleId: role.id }));
      });

      socket.on("SERVER_ROLE_DELETE", ({ id, serverId }) => {
        dispatch(deleteRole({ id }));
        dispatch(removeServerRole({ id: serverId, roleId: id }));
      });

      socket.on("SERVER_ROLE_UPDATE", (role) => {
        dispatch(updateRole(role));
      });

      socket.on("USER_UPDATE", (user) => {
        dispatch(updateUser(user));
        if (user.id === userId.current) {
          dispatch(updateInfo(user));
        }
      });

      socket.on("USER_SETTINGS_UPDATE", (settings) => {
        dispatch(updateSettings(settings));
      });

      socket.on("EMOJI_CREATE", (data) => {
        dispatch(addEmoji(data));
      });

      socket.on("EMOJI_DELETE", (data) => {
        dispatch(deleteEmoji(data));
      });

      socket.on("EMOJI_UPDATE", (data) => {
        dispatch(updateEmoji(data));
      });

      socket.on("RELATIONSHIP_ADD", (data) => {
        dispatch(addRelationship(data));
      });

      socket.on("RELATIONSHIP_REMOVE", (data) => {
        dispatch(removeRelationship(data));
      });

      const debounceTyping = _.debounce(function ({
        userId,
        serverId,
      }: {
        userId: string;
        serverId: string;
      }) {
        dispatch(updateMember({ serverId, userId, member: { typing: false } }));
      },
      10000);

      socket.on("TYPING", ({ userId, serverId }) => {
        dispatch(updateMember({ serverId, userId, member: { typing: true } }));
        debounceTyping({ userId, serverId });
      });

      socket.on("ERROR", async (error) => {
        console.log({ socketError: error });
        if (error.message.includes("jwt") || error.message.includes("Token")) {
          // socket.disconnect();
          if (retry) {
            // signOut({
            //   redirect: true,
            //   callbackUrl: "/login",
            // });
          } else {
            const session = await getSession();
            setRetry(session?.accessToken ?? "none");
          }
        }
      });

      return socket;
    } catch {
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retry]);

  return (
    <WSContext.Provider
      value={{
        retry,
        socket,
        isInitialized,
        reconnecting: false,
        disconnected: false,
      }}
    >
      {children}
    </WSContext.Provider>
  );
});

WSProvider.displayName = "WSContext";

const withWS =
  <P extends object>(Component: ComponentType<P>) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }: P) =>
    (
      <WSProvider>
        <Component {...props} />
      </WSProvider>
    );

const useWS = (): IWSContext => {
  const context = useContext(WSContext);

  if (context == undefined) {
    throw new Error("useWS must be used within a WSProvider");
  }

  return context;
};

export { WSProvider, useWS, withWS };
