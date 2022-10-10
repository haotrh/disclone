import { Button } from "@app/common/button";
import { Label, SearchInput } from "@app/common/input";
import { RoundLoading } from "@components/common";
import useDebounce from "@hooks/useDebounce";
import useGifCategories from "@lib/react-query/useGifCategories";
import useGifSearch from "@lib/react-query/useGifSearch";
import useGifTrending from "@lib/react-query/useGifTrending";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { GifObject } from "types/gif.type";
import GifCategoryList from "./GifCategoryList";
import { GifPickerProvider } from "./GifPickerContext";
import GifSearchList from "./GifSearchList";
import GifSearchSkeleton from "./GifSearchSkeleton";

export type GifTab = "favorites" | "trending" | "default";

const GifPicker = () => {
  const [tab, setTab] = useState<GifTab>("default");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce<string>(search, 300);
  const categoriesQuery = useGifCategories();
  const searchQuery = useGifSearch(debouncedSearch);
  const trendingQuery = useGifTrending(tab === "trending");
  const [searchList, setSearchList] = useState<GifObject[] | null>(null);

  useEffect(() => {
    if (tab === "default" && searchQuery.isSuccess) {
      setSearchList(searchQuery.data);
    }
  }, [searchQuery.isSuccess, searchQuery.data, tab]);

  useEffect(() => {
    if (tab === "trending" && trendingQuery.isSuccess) {
      setSearchList(trendingQuery.data);
    }
  }, [trendingQuery.isSuccess, trendingQuery.data, tab]);

  return (
    <GifPickerProvider
      search={search}
      setSearchList={setSearchList}
      setSearch={setSearch}
      tab={tab}
      setTab={setTab}
      debouncedSearch={debouncedSearch}
    >
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex gap-2 items-center p-4 pt-0 border-b border-background-tertiary">
          {(search || tab !== "default") && (
            <Button
              onClick={() => {
                setTab("default");
                setSearch("");
              }}
              theme="blank"
            >
              <HiArrowNarrowLeft size={20} />
            </Button>
          )}
          {tab === "default" ? (
            <SearchInput placeholder="Search Tenor" search={search} setSearch={setSearch} />
          ) : (
            <Label className="mb-0 ml-2">{tab}</Label>
          )}
        </div>
        <div className="flex-1 min-h-0 flex relative">
          {!(search || tab !== "default") && (
            <>
              {categoriesQuery.isLoading && (
                <div className="absolute inset-0 flex-center">
                  <RoundLoading />
                </div>
              )}
              {categoriesQuery.data && (
                <GifCategoryList
                  trendingGifPlaceholder={categoriesQuery.data.gifs[0]}
                  categories={categoriesQuery.data.categories}
                />
              )}
            </>
          )}
          {(search || tab === "trending") && !searchList && <GifSearchSkeleton />}
          {(search || tab === "trending") && searchList && <GifSearchList gifs={searchList} />}
        </div>
      </div>
    </GifPickerProvider>
  );
};

export default GifPicker;
