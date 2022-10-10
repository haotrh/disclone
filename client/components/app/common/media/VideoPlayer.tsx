import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { MdFullscreen } from "react-icons/md";
import { RiVolumeDownFill, RiVolumeMuteFill, RiVolumeUpFill } from "react-icons/ri";
import { Button } from "../button";
import SeekBar from "./SeekBar";

interface VideoPlayerProps {
  src: string;
}

const controlVariants: Variants = {
  hidden: {
    y: 32,
  },
  shown: {
    y: 0,
  },
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  };

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (videoRef.current?.duration) {
        setVideoTime(Math.floor(videoRef.current.duration));
      } else {
        videoRef.current.onloadedmetadata = (ev) => {
          setVideoTime(videoRef.current?.duration ?? 0);
        };
      }
    }
    const fullscreenExitHandler = () => {
      if (
        !document.fullscreenElement &&
        //@ts-ignore
        !document.webkitIsFullScreen &&
        //@ts-ignore
        !document.mozFullScreen &&
        //@ts-ignore
        !document.msFullscreenElement
      ) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener("webkitfullscreenchange", fullscreenExitHandler, false);
    document.addEventListener("mozfullscreenchange", fullscreenExitHandler, false);
    document.addEventListener("fullscreenchange", fullscreenExitHandler, false);
    document.addEventListener("MSFullscreenChange", fullscreenExitHandler, false);
    return () => {
      document.removeEventListener("webkitfullscreenchange", fullscreenExitHandler, false);
      document.removeEventListener("mozfullscreenchange", fullscreenExitHandler, false);
      document.removeEventListener("fullscreenchange", fullscreenExitHandler, false);
      document.removeEventListener("MSFullscreenChange", fullscreenExitHandler, false);
    };
  }, []);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else {
      const container = containerRef.current as
        | null
        | (HTMLElement & {
            mozRequestFullScreen(): Promise<void>;
            webkitRequestFullscreen(): Promise<void>;
            msRequestFullscreen(): Promise<void>;
          });
      if (container?.requestFullscreen) {
        container.requestFullscreen();
      } else if (container?.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container?.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container?.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
      setIsFullScreen(true);
    }
  };

  return (
    <div className="flex">
      <motion.div
        ref={containerRef}
        initial="hidden"
        whileHover="shown"
        animate={!isPlaying && "shown"}
        className="relative overflow-hidden"
        onClick={handlePlay}
      >
        <AnimatePresence initial={false}>
          {isPlaying ? (
            <motion.div
              initial={{ width: 72, height: 72, opacity: 0.6, y: "-50%", x: "-50%" }}
              animate={{ width: 100, height: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              key="playing"
              className="absolute rounded-full bg-black left-1/2 top-1/2 text-white flex-center"
            >
              <BsFillPlayFill size={48} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ width: 72, height: 72, opacity: 0.6, y: "-50%", x: "-50%" }}
              animate={{ width: 100, height: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              key="Pause"
              className="absolute rounded-full bg-black left-1/2 top-1/2 text-white flex-center"
            >
              <BsFillPauseFill size={48} />
            </motion.div>
          )}
        </AnimatePresence>
        <video
          style={isFullScreen ? { width: "100%", height: "100%" } : {}}
          ref={videoRef}
          playsInline
          src={src}
        />
        <motion.div
          variants={controlVariants}
          transition={{ duration: 0.3, type: "spring" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute bottom-0 bg-black/0.6 h-8 flex items-center w-full select-none"
        >
          <Button theme="blank" className="!bg-none p-1" onClick={handlePlay}>
            {isPlaying ? <BsFillPauseFill size={24} /> : <BsFillPlayFill size={24} />}
          </Button>
          <SeekBar videoRef={videoRef} videoTime={videoTime} />
          <Button theme="blank" className="!bg-none p-1" onClick={toggleMute}>
            {muted || volume === 0 ? (
              <RiVolumeMuteFill size={24} />
            ) : volume >= 50 ? (
              <RiVolumeUpFill size={24} />
            ) : (
              <RiVolumeDownFill size={24} />
            )}
          </Button>
          <Button theme="blank" className="!bg-none p-1" onClick={toggleFullScreen}>
            <MdFullscreen size={24} />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VideoPlayer;
