import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GifCategory, GifObject } from "types/gif.type";

const fetchGifCategories = () =>
  axios
    .get<{
      categories: GifCategory[];
      gifs: GifObject[];
    }>("api/gifs/categories", { params: { media_filter: "mp4" }, baseURL: "/" })
    .then(({ data }) => data);

const useGifCategories = () => {
  return useQuery(["gifCategories"], fetchGifCategories, {
    refetchInterval: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export default useGifCategories;
