import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import _ from "lodash";
import { GifObject } from "types/gif.type";

const fetchGifSearch = (q: string) =>
  axios
    .get<GifObject[]>("api/gifs/search", {
      params: { media_filter: "mp4", q, limit: 100 },
      baseURL: "/",
    })
    .then(({ data }) => data);

const useGifSearch = (search: string) => {
  return useQuery(
    ["gifSearch", search],
    () => (_.isEmpty(search) ? null : fetchGifSearch(search)),
    {
      refetchInterval: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      }
  );
};

export default useGifSearch;
