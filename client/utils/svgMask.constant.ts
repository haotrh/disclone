import { UserStatus } from "../types/user";

export const SVG_MASK_AVATAR_ROUND_20 = "svg-mask-avatar-status-round-20";
export const SVG_MASK_AVATAR_ROUND_24 = "svg-mask-avatar-status-round-24";
export const SVG_MASK_AVATAR_ROUND_32 = "svg-mask-avatar-status-round-32";
export const SVG_MASK_AVATAR_ROUND_40 = "svg-mask-avatar-status-round-40";
export const SVG_MASK_AVATAR_ROUND_80 = "svg-mask-avatar-status-round-80";
export const SVG_MASK_STATUS_ONLINE = "svg-mask-status_online";
export const SVG_MASK_STATUS_IDLE = "svg-mask-status_idle";
export const SVG_MASK_STATUS_DND = "svg-mask-status_dnd";
export const SVG_MASK_STATUS_OFFLINE = "svg-mask-status_offline";
export const SVG_MASK_STATUS_STREAMING = "svg-mask-status_streaming";
export const SVG_MASK_STATUS_TYPING = "svg-mask-status_typing";

export const avatarStatusMaskId: {
  [key in UserStatus]: string;
} = {
  dnd: SVG_MASK_STATUS_DND,
  idle: SVG_MASK_STATUS_IDLE,
  offline: SVG_MASK_STATUS_OFFLINE,
  online: SVG_MASK_STATUS_ONLINE,
};
