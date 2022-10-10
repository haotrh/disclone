import { RoundLoading } from "@components/common";
import { imageKitLoader, resizeChatImage } from "@utils/image";
import classNames from "classnames";
import React, { HTMLProps, ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";

export type ImageContentType = "image" | "video" | "gif" | "gifv";

export interface ImageWrapperProps extends HTMLProps<HTMLImageElement> {
  src: string;
  imgWidth?: number | null;
  imgHeight?: number | null;
  maxWidth?: number;
  maxHeight?: number;
  children?: ReactNode;
  type?: ImageContentType;
}

const ImageWrapper: React.FC<ImageWrapperProps> = React.memo(
  ({
    src,
    imgWidth,
    imgHeight,
    className,
    children,
    crossOrigin,
    onClick,
    type = "image",
    maxHeight = 300,
    maxWidth = 400,
    ...props
  }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [loading, setLoading] = useState(true);
    const [naturalWidth, setNaturalWidth] = useState<number | null>(imgWidth ?? null);
    const [naturalHeight, setNaturalHeight] = useState<number | null>(imgHeight ?? null);
    const { height, width } = useMemo(
      () =>
        naturalWidth && naturalHeight
          ? resizeChatImage({
              imgWidth: naturalWidth,
              imgHeight: naturalHeight,
              maxHeight,
              maxWidth,
            })
          : { width: 200, height: 200 },
      [naturalWidth, naturalHeight, maxHeight, maxWidth]
    );

    useLayoutEffect(() => {
      if (type === "gifv" || type === "video") {
      } else {
        const image = imageRef.current;
        if (image) {
          if (image.complete) setLoading(false);
          else {
            image.onload = (e) => {
              setLoading(false);
              if (!imgWidth || !imgHeight) {
                setNaturalWidth(image.naturalWidth);
                setNaturalHeight(image.naturalHeight);
              }
            };
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        onClick={onClick}
        style={loading ? { width, height } : { maxWidth: width, maxHeight: height }}
        className={classNames("relative h-full w-full rounded overflow-hidden my-2", className, {
          "bg-background-secondary": loading,
        })}
      >
        {type === "gifv" || type === "video" ? (
          <ReactPlayer
            playing={type === "gifv"}
            playsinline={type === "gifv"}
            controls={type === "video"}
            width={width}
            height={height}
            loop={type === "gifv"}
            muted={type === "gifv"}
            url={src}
          />
        ) : (
          <img
            {...props}
            ref={imageRef}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = "/images/image-error.svg";
            }}
            src={imageKitLoader({ src, width: width * 1.2 })}
            alt="Image"
            style={{ maxWidth: width, maxHeight: height, aspectRatio: `${width}/${height}` }}
            className={classNames(
              { hidden: loading },
              "block w-full rounded object-cover cursor-pointer"
            )}
          />
        )}
        {loading && false && (
          <div className="absolute inset-0 flex-center overflow-hidden bg-black/60">
            <RoundLoading />
          </div>
        )}
        {children}
      </div>
    );
  }
);

ImageWrapper.displayName = "ImageWrapper";

export default ImageWrapper;
