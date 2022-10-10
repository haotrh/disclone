import { EmojiRenderByString } from "@app/common/Emoji";
import TextSpoiler from "@app/common/TextSpoiler";
import { useChannel } from "@contexts/ChannelContext";
import { markdownLanguage } from "@utils/prism";
import _ from "lodash";
import { Token, tokenize } from "prismjs";
import React, { ReactNode, useCallback, useMemo, useRef } from "react";
import Mention from "./Mention";

interface MarkdownRenderProps {
  text: string;
  omitTypes?: (keyof typeof markdownLanguage)[];
  id: string;
}

interface MarkdownRenderLeafProps {
  type: string;
  children?: ReactNode;
  omitTypes?: string[];
}

const MarkdownRenderLeaf: React.FC<MarkdownRenderLeafProps> = ({ type, children, omitTypes }) => {
  const { server } = useChannel();

  if (omitTypes && omitTypes.includes(type)) {
    return <>{children}</>;
  }
  if (type === "syntax") return null;
  if (type === "bold") return <strong>{children}</strong>;
  if (type === "italic") return <em>{children}</em>;
  if (type === "underline") return <u>{children}</u>;
  if (type === "strike") return <s>{children}</s>;
  if (type === "spoiler") return <TextSpoiler>{children}</TextSpoiler>;
  if (type === "url")
    return (
      <a href={children?.toString() ?? ""} className="link" target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  if (type === "emoji") return <EmojiRenderByString text={children?.toString() ?? ""} />;
  if (type === "mention")
    return <Mention serverId={server?.id ?? ""} userId={children?.toString() ?? ""} />;
  if (type === "blockquote")
    return (
      <div className="flex">
        <div className="w-1 bg-interactive-muted rounded flex-shrink-0"></div>
        <blockquote
          className="pl-3 pr-2 max-w-[90%] indent-0 break-words whitespace-pre-wrap
        flex-1 min-w-0 leading-[1.375rem]"
        >
          {children}
        </blockquote>
      </div>
    );
  if (type === "inlineCode")
    return (
      <code className="p-[.2em] -m-[.2em 0] bg-background-secondary text-[85%]">{children}</code>
    );
  if (type === "codeBlock")
    return (
      <pre className="mt-[6px]">
        <code
          className="bg-background-secondary border border-background-tertiary p-[7px] rounded code text-[0.875rem]
          leading-[1.125rem] indent-0 whitespace-pre-wrap block overflow-x-auto text-header-secondary"
        >
          {children}
        </code>
      </pre>
    );
  return <>{children}</>;
};

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ text, omitTypes }) => {
  const tokenizedText = useMemo(() => tokenize(text, markdownLanguage), [text]);
  const position = useRef(0);

  const render = useCallback(
    (token: string | Token): ReactNode => {
      if (typeof token === "string") {
        position.current += token.length;
        return token;
      }
      return (
        <MarkdownRenderLeaf omitTypes={omitTypes} type={token.type}>
          {_.isArray(token.content)
            ? token.content.map((tokenContent) => (
                <React.Fragment key={`${position.current}_${position.current + token.length}`}>
                  {render(tokenContent)}
                </React.Fragment>
              ))
            : render(token.content)}
        </MarkdownRenderLeaf>
      );
    },
    [omitTypes]
  );

  return (
    <div className="break-words whitespace-pre-wrap w-full">
      {tokenizedText.map((token, i) => (
        <React.Fragment key={`${token.toString()}_${i}`}>{render(token)}</React.Fragment>
      ))}
    </div>
  );
};

export default React.memo(MarkdownRender);
