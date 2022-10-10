export type GifFormat = "gif" | "webm" | "mp4" | "preview";

export interface GifCategory {
  name: string;
  src: string;
}

export interface GifObject {
  id: string;
  title: string;
  preview: string;
  width: number;
  height: number;
  gif_src: string;
  src: string;
  url: string;
}
