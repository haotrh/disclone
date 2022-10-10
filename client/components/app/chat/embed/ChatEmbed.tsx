import ImageWrapper, { ImageContentType } from "@app/common/media/ImageWrapper";
import { decimalToRgb } from "@utils/colors";
import { getUrlExtension, isEmptyDeep } from "@utils/common.util";
import classNames from "classnames";
import React, { useMemo } from "react";
import { Embed } from "types/message";
import ChatImage from "../content/ChatImage";

interface ChatEmbedProps {
  embed: Embed;
}

const ChatEmbed: React.FC<ChatEmbedProps> = React.memo(({ embed }) => {
  const isInline = useMemo(
    () => embed.url === embed.thumbnail?.url || embed.url === embed.video?.url,
    [embed]
  );

  if (isInline) {
    const type: ImageContentType =
      getUrlExtension(embed.thumbnail?.url ?? "") === "gif"
        ? embed.video
          ? "gifv"
          : "gif"
        : embed.video
        ? "video"
        : "image";

    return (
      <ChatImage
        link={embed.thumbnail?.url ?? embed.url}
        type={type}
        src={
          (type === "image" || type === "gif" ? embed.thumbnail?.url : embed.video?.url) ??
          "/images/image-error.svg"
        }
        imgWidth={
          type === "image" || type === "gif"
            ? embed.thumbnail?.width
            : embed.video?.width ?? embed.thumbnail?.width
        }
        imgHeight={
          type === "image" || type === "gif"
            ? embed.thumbnail?.height
            : embed.video?.height ?? embed.thumbnail?.height
        }
        alt={embed.description}
      />
    );
  }

  return (
    <div
      className={classNames(
        "w-full flex rounded overflow-hidden bg-background-secondary",
        "select-text cursor-auto my-2",
        { "max-w-[512px]": embed.thumbnail, "max-w-[360px]": !embed.thumbnail }
      )}
    >
      <div className="w-1" style={{ backgroundColor: decimalToRgb(embed.color ?? 0) }} />
      <div className="flex-1 min-w-0 px-4 py-2 flex">
        <div className="flex-1 min-w-0 space-y-2">
          {embed.author && (
            <div className="flex gap-2 text-header-primary font-bold text-sm items-center">
              {embed.author.iconUrl && (
                <img className="w-6 h-6 object-contain" src={embed.author.iconUrl} alt="" />
              )}
              <div className="flex-1 min-w-0 break-words">
                {embed.author.url ? (
                  <a
                    href={embed.author.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {embed.author.name}
                  </a>
                ) : (
                  embed.author.name
                )}
              </div>
            </div>
          )}
          {embed.provider && <div className="text-xs">{embed.provider.name}</div>}
          {embed.title && (
            <div className="text-base font-semibold break-words">
              {embed.url ? (
                <a href={embed.url} className="link font-semibold" target="_blank" rel="noreferrer">
                  {embed.title}
                </a>
              ) : (
                embed.title
              )}
            </div>
          )}
          {embed.description && (
            <div className="whitespace-pre-line break-words text-sm">{embed.description}</div>
          )}
          {embed.image && !embed.video && !isEmptyDeep(embed.image) && (
            <ImageWrapper
              src={embed.image.url}
              imgWidth={embed.image.width}
              imgHeight={embed.image.height}
            />
          )}
          {embed.video && !isEmptyDeep(embed.video) && (
            <ImageWrapper
              type="video"
              src={embed.video.url}
              imgWidth={embed.video.width ?? embed.thumbnail?.width}
              imgHeight={embed.video.height ?? embed.thumbnail?.height}
            />
          )}
          {(embed.footer || embed.timestamp) && (
            <div className="flex text-xs items-center">
              {embed.footer && (
                <div className="flex gap-1 items-center">
                  {embed.footer.iconUrl && (
                    <img className="w-5 h-5 object-contain" src={embed.footer.iconUrl} alt="" />
                  )}
                  <span>{embed.footer.text}</span>
                </div>
              )}
              {embed.footer && embed.timestamp && (
                <span className="font-medium inline-block mx-1">•</span>
              )}
            </div>
          )}
        </div>
        {embed.thumbnail && !embed.video && !isEmptyDeep(embed.thumbnail) && (
          <ChatImage
            maxWidth={80}
            maxHeight={80}
            imgWidth={embed.thumbnail.width}
            imgHeight={embed.thumbnail.height}
            className="ml-4 mt-2 !max-h-20 !max-w-20 object-contain object-center flex-grow-0 flex-shrink-0"
            src={embed.thumbnail.url}
            alt=""
          />
        )}
      </div>
    </div>
  );
});

ChatEmbed.displayName = "ChatEmbed";

export default ChatEmbed;
