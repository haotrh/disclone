import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import _ from "lodash";
import { GifObject } from "types/gif.type";

const fetchGifTrending = () =>
  axios
    .get<GifObject[]>("api/gifs/trending-gifs", {
      params: { media_filter: "mp4", limit: 100 },
      baseURL: "/",
    })
    .then(({ data }) => data);

const useGifTrending = (enabled: boolean) =>
  useQuery(["gifTrending"], fetchGifTrending, {
    refetchInterval: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled,
  });

export default useGifTrending;
