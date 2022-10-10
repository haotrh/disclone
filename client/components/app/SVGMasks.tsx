import React from "react";
import {
  SVG_MASK_AVATAR_ROUND_20,
  SVG_MASK_AVATAR_ROUND_24,
  SVG_MASK_AVATAR_ROUND_32,
  SVG_MASK_AVATAR_ROUND_80,
  SVG_MASK_STATUS_DND,
  SVG_MASK_STATUS_IDLE,
  SVG_MASK_STATUS_OFFLINE,
  SVG_MASK_STATUS_ONLINE,
} from "@utils/svgMask.constant";

const SVGMasks = () => {
  return (
    <svg className="absolute pointer-events-none -top-px -left-px w-px h-px" aria-hidden="true">
      <mask id={SVG_MASK_AVATAR_ROUND_20} maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
        <circle fill="white" cx="0.5" cy="0.5" r="0.5" />
        <circle fill="black" cx="0.85" cy="0.85" r="0.25" />
      </mask>
      <mask id={SVG_MASK_AVATAR_ROUND_24} maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
        <circle fill="white" cx="0.5" cy="0.5" r="0.5" />
        <circle
          fill="black"
          cx="0.8333333333333334"
          cy="0.8333333333333334"
          r="0.2916666666666667"
        />
      </mask>

      <mask id={SVG_MASK_AVATAR_ROUND_32} maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
        <circle fill="white" cx="0.5" cy="0.5" r="0.5" />
        <circle fill="black" cx="0.84375" cy="0.84375" r="0.25" />
      </mask>
      <mask id={SVG_MASK_AVATAR_ROUND_80} maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
        <circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle>
        <circle fill="black" cx="0.85" cy="0.85" r="0.175"></circle>
      </mask>
      <mask id={SVG_MASK_STATUS_ONLINE} maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
        <circle fill="white" cx="0.5" cy="0.5" r="0.5" />
      </mask>
      <mask id={SVG_MASK_STATUS_IDLE} maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
        <circle fill="white" cx="0.5" cy="0.5" r="0.5" />
        <circle fill="black" cx="0.25" cy="0.25" r="0.375" />
      </mask>
      <mask id={SVG_MASK_STATUS_DND} maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
        <circle fill="white" cx="0.5" cy="0.5" r="0.5" />
        <rect
          fill="black"
          x="0.125"
          y="0.375"
          width="0.75"
          height="0.25"
          rx="0.125"
          ry="0.125"
        ></rect>
      </mask>
      <mask id={SVG_MASK_STATUS_OFFLINE} maskContentUnits="objectBoundingBox" viewBox="0 0 1 1">
        <circle fill="white" cx="0.5" cy="0.5" r="0.5" />
        <circle fill="black" cx="0.5" cy="0.5" r="0.25" />
      </mask>
    </svg>
  );
};

export default SVGMasks;
