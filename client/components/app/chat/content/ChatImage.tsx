import { ModalRender } from "@app/common";
import ImageWrapper, { ImageWrapperProps } from "@app/common/media/ImageWrapper";
import React, { useState } from "react";

interface ChatImageProps extends ImageWrapperProps {
  link?: string;
}

const ZOOM_MAX_WIDTH_SCALE = 0.75;
const ZOOM_MAX_HEIGHT_SCALE = 0.65;

const ChatImage: React.FC<ChatImageProps> = ({ link, ...props }) => {
  const [maxWidth, setMaxWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);

  const handleClick = () => {
    setMaxWidth(Math.ceil(window.innerWidth * ZOOM_MAX_WIDTH_SCALE));
    setMaxHeight(Math.ceil(window.innerHeight * ZOOM_MAX_HEIGHT_SCALE));
  };

  if (props.type === "video") return <ImageWrapper {...props} />;

  return (
    <ModalRender
      onClick={handleClick}
      modal={
        <div>
          <ImageWrapper
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            src={props.src}
            imgWidth={props.imgWidth}
            imgHeight={props.imgHeight}
            type={props.type}
          />
          <a
            className="text-sm hover:underline opacity-50 hover:opacity-100 text-white font-medium"
            href={link ?? props.src}
            target="_blank"
            rel="noreferrer"
          >
            Open original
          </a>
        </div>
      }
    >
      <ImageWrapper className="cursor-pointer" {...props} />
    </ModalRender>
  );
};

export default ChatImage;
