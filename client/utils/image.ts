import _ from "lodash";
import { ImageLoader } from "next/image";
import { BASE64_REGEX } from "./regex";

export interface ImageDimension {
  width: number;
  height: number;
}

export const resizeCropImage: (info: {
  imgWidth: number;
  imgHeight: number;
  zoom?: number;
  cropRatio?: number;
  maxWidth: number;
  maxHeight: number;
}) => ImageDimension = ({ imgWidth, imgHeight, zoom = 1, cropRatio = 1, maxHeight, maxWidth }) => {
  let height = 0,
    width = 0,
    overlayMaxWidth = 0,
    overlayMaxHeight = 0;

  let imageRatio = imgWidth / imgHeight;
  imageRatio = +imageRatio.toFixed(2);

  if (cropRatio <= 1 || (cropRatio > 1 && maxWidth / cropRatio > maxHeight)) {
    overlayMaxHeight = maxHeight;
    overlayMaxWidth = overlayMaxHeight * cropRatio;
  } else {
    overlayMaxWidth = maxWidth;
    overlayMaxHeight = overlayMaxWidth / cropRatio;
  }

  if (imageRatio < cropRatio && imgWidth >= overlayMaxWidth) {
    width = maxWidth * zoom;
    height = width / imageRatio;
  } else if (imageRatio <= 1) {
    height = maxHeight * zoom;
    width = imageRatio * height;
  } else {
    height = overlayMaxHeight * zoom;
    width = imageRatio * height;
  }

  return { width, height };
};

export const resizeChatImage = ({
  imgWidth,
  imgHeight,
  maxWidth = 400,
  maxHeight = 300,
}: {
  imgWidth: number;
  imgHeight: number;
  maxWidth?: number;
  maxHeight?: number;
}) => {
  let height,
    width = 0;

  if (imgWidth > imgHeight) {
    width = _.min([imgWidth, maxWidth]) as number;
    height = (imgHeight / imgWidth) * width;
  } else {
    height = _.min([imgHeight, maxHeight]) as number;
    width = (imgWidth / imgHeight) * height;
  }
  width = Math.ceil(width);
  height = Math.ceil(height);

  return { width, height };
};

interface ImgaeKitLoader {
  src: string;
  width: number;
}

export const imageKitLoader = ({ src, width }: ImgaeKitLoader) => {
  try {
    if (src.match(BASE64_REGEX) || new URL(src).hostname !== "ik.imagekit.io") {
      return src;
    }
  } catch {
    return src;
  }

  const params = [`w-${Math.ceil(width)}`, "f-webp"];
  const paramsString = params.join(",");
  if (src[src.length - 1] === "/") src = src.substring(0, src.length - 1);
  return `${src}?tr=${paramsString}`;
};

export const getAvatarSrc = (user: any) => {
  if (user?.avatar && typeof user.avatar === "string") {
    return user.avatar;
  } else if (user?.user?.avatar && typeof user.user.avatar === "string") {
    return user.user.avatar;
  }
  return undefined;
};
