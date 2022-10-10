import { useChannel } from "@contexts/ChannelContext";
import { useAppSelector } from "@hooks/redux";
import { selectMember } from "@store/selectors";
import classNames from "classnames";
import React, { ReactNode, useContext, useMemo, useState } from "react";
import { Member } from "types/server";
import { MessageState } from "types/store.interfaces";
import ChatMessageControl from "./ChatMessageControl";

interface IMessageContext {
  message: MessageState;
  setEdit: (value: boolean) => any;
  edit: boolean;
  messageAuthor: Member;
  groupStart?: boolean;
  readOnly?: boolean;
}

export const MessageContext = React.createContext<IMessageContext>({} as IMessageContext);

interface MessageProviderProps extends IMessageContext {
  children?: ReactNode;
}

const MessageProvider: React.FC<MessageProviderProps> = ({ children, ...props }) => {
  return <MessageContext.Provider value={props}>{children}</MessageContext.Provider>;
};

interface MessageWrapperProps {
  children?: ReactNode;
  message: MessageState;
  groupStart?: boolean;
  readOnly?: boolean;
  className?: string;
}

export const useMessage = (): IMessageContext => {
  const context = useContext(MessageContext);
  return context;
};

const MessageWrapper: React.FC<MessageWrapperProps> = ({
  children,
  message,
  groupStart,
  readOnly,
  className,
}) => {
  const [edit, setEdit] = useState(false);
  const { server } = useChannel();
  const me = useAppSelector((state) => state.me.user);
  const isMentioned = useMemo(
    () =>
      readOnly ? false : message.mentionEveryone || (me?.id && message?.mentions?.includes(me.id)),
    [message.mentionEveryone, message.mentions, me?.id,readOnly]
  );

  const messageAuthor = useAppSelector((state) =>
    selectMember(state, {
      id: message.author,
      server: server?.id ?? "",
    })
  );

  return (
    <MessageProvider
      groupStart={groupStart}
      readOnly={readOnly}
      messageAuthor={messageAuthor}
      edit={edit}
      setEdit={setEdit}
      message={message}
    >
      <div
        className={classNames("-mx-4 relative", {
          "bg-[rgba(250,168,26,0.1)]": isMentioned,
          "bg-black/[0.08]": edit && !isMentioned,
        })}
      >
        <div
          className={classNames(className, "flex pl-[72px] pr-[48px] relative group py-px pt-1", {
            "mt-2": groupStart,
            "hover:bg-black/[0.08]": !readOnly,
            "pointer-events-none": readOnly,
          })}
        >
          {isMentioned && (
            <div className="absolute left-0 top-0 h-full w-0.5 bg-[rgb(250,168,26)]" />
          )}
          {!(message.sending || message.fail) && !edit && !readOnly && <ChatMessageControl />}
          {children}
        </div>
      </div>
    </MessageProvider>
  );
};

export default MessageWrapper;
