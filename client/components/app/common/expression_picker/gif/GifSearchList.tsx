import useMasonryPositioner from "@hooks/useMasonryPositioner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "framer-motion";
import _ from "lodash";
import { useSize } from "mini-virtual-list";
import React, { useEffect, useRef } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { VariableSizeList } from "react-window";
import { GifObject } from "types/gif.type";
import GifButton from "./GifButton";
import { useGifPicker } from "./GifPickerContext";

interface GifSearchListProps {
  gifs: GifObject[];
}

const fetchGifSearchSuggest = (q: string) =>
  axios
    .get<string[]>("api/gifs/suggest", {
      params: { q, limit: 5 },
      baseURL: "/",
    })
    .then(({ data }) => data);

const GifSearchSuggest: React.FC = React.memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const { debouncedSearch, setSearch, tab, setSearchList } = useGifPicker();
  const { isSuccess, data } = useQuery(
    ["searchSuggestQuery", debouncedSearch],
    () => fetchGifSearchSuggest(debouncedSearch),
    {
      enabled: inView && tab === "default",
      refetchInterval: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  if (tab !== "default") {
    return null;
  }

  return (
    <div ref={ref}>
      {isSuccess && !_.isEmpty(data) && data && (
        <div className="py-6">
          <div className="text-interactive-normal font-medium text-center">
            Your perfect GIF is in another castle. Try the suggested keywords below!
          </div>
          <div className="flex-center flex-wrap gap-1 mt-2">
            {data.map((suggest) => (
              <button
                onClick={() => {
                  setSearch("");
                  setSearchList(null);
                  setSearch(suggest);
                }}
                key={`${suggest}_${debouncedSearch}`}
                className="px-4 py-1 border border-divider rounded hover:bg-primary transition-colors text-white"
              >
                {suggest}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

GifSearchSuggest.displayName = "GifSearchSuggest";

const GifSearchList: React.FC<GifSearchListProps> = ({ gifs }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<VirtuosoHandle>(null);
  const { width } = useSize(containerRef);
  const positioner = useMasonryPositioner({
    width,
    elements: gifs,
    columnCount: 2,
    columnGap: 8,
    rowGap: 8,
  });

  useEffect(() => {
    listRef.current?.scrollToIndex(0);
  }, [gifs]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 relative min-w-0 overflow-y-auto scrollbar-thin custom-scrollbar"
    >
      <Virtuoso
        customScrollParent={containerRef.current as HTMLDivElement}
        data={gifs}
        ref={listRef}
        computeItemKey={(index, gif) =>gif.gif_src}
        className="scrollbar-thin custom-scrollbar min-h-full"
        itemSize={(e) => {
          const index = parseInt(e.getAttribute("data-index") ?? "0");
          return positioner.cellRelativeHeight[index];
        }}
        increaseViewportBy={300}
        itemContent={(index, gif) => (
          <GifButton
            className="!absolute"
            style={{
              width: positioner.columnWidth,
              height: positioner.cellStyles[index].height,
              left: positioner.cellStyles[index].left,
              top: positioner.cellStyles[index].top,
            }}
            gif={gif}
          />
        )}
      />
      <div>
        <GifSearchSuggest />
        <div
          className="min-h-[220px] bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(/images/no-more-1.svg)` }}
        />
      </div>
    </div>
  );
};

export default React.memo(GifSearchList);
