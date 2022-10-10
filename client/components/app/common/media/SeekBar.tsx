import formatDuration from "format-duration";
import { motion, Variants } from "framer-motion";
import _ from "lodash";
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { followCursor } from "tippy.js";
import { Tooltip } from "../tooltip";

interface SeekBarProps {
  videoTime: number;
  videoRef: RefObject<HTMLVideoElement>;
}

const knobVariants: Variants = {
  progressBarMouseOver: {
    scale: 1,
  },
  progressBarMouseLeave: {
    scale: 0,
  },
};

const SeekBar: React.FC<SeekBarProps> = ({ videoTime, videoRef }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [previewPercent, setPreviewPercent] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const seekInSeconds = useMemo(
    () => Math.trunc((previewPercent / 100) * videoTime),
    [previewPercent, videoTime]
  );

  const progress = useMemo(
    () => Math.floor((currentTime / videoTime) * 100),
    [currentTime, videoTime]
  );

  const goTo = () => {
    if (videoRef.current) videoRef.current.currentTime = seekInSeconds;
  };

  const seeking = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  }, []);

  useEffect(() => {
    seeking();
    const id = window.setInterval(seeking, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  return (
    <>
      <div className="font-[Consolas] text-white text-xs mx-1">
        {formatDuration(currentTime * 1000)}
        <span className="mx-0.5">/</span>
        {formatDuration(videoTime * 1000)}
      </div>
      <Tooltip
        appendTo="parent"
        offset={[0, 10]}
        noPadding
        className="theme-dark text-text-normal text-xs font-bold py-1 px-2 !bg-black leading-3"
        hideOnClick={false}
        plugins={[followCursor]}
        followCursor="horizontal"
        content={formatDuration(seekInSeconds * 1000)}
      >
        {/* Progress Bar */}
        <motion.div
          onMouseMove={(e) => {
            const rect = (e.target as HTMLDivElement).getBoundingClientRect();
            let x = e.clientX - rect.left;
            const preview = _.clamp((x / rect.width) * 100, 0, 100);
            setPreviewPercent(preview);
          }}
          onClick={goTo}
          ref={progressBarRef}
          whileHover="progressBarMouseOver"
          initial="progressBarMouseLeave"
          className="flex-1 flex rounded-full items-center h-full relative cursor-pointer"
        >
          <div className="h-1.5 rounded-full bg-[#737374] w-full absolute z-0"></div>
          <div
            style={{ width: `${progress}%` }}
            className="h-1.5 rounded-full bg-[rgb(88,101,242)] absolute z-10"
          >
            <motion.div
              variants={knobVariants}
              transition={{ duration: 0.25, type: "spring" }}
              className="w-2.5 h-2.5 bg-[rgb(88,101,242)] border absolute -right-[5px] -top-1/2 z-20 rounded-full cursor-grab"
            />
          </div>
        </motion.div>
      </Tooltip>
    </>
  );
};

export default SeekBar;
