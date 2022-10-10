import React from "react";
import { AiFillStar } from "react-icons/ai";
import { IoMdTrendingUp } from "react-icons/io";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";
import { GifCategory, GifObject } from "types/gif.type";
import GifButton from "./GifButton";
import { useGifPicker } from "./GifPickerContext";

interface GifCategoryListProps {
  categories: GifCategory[];
  trendingGifPlaceholder: GifObject;
}

const GifCategoryList: React.FC<GifCategoryListProps> = ({
  categories,
  trendingGifPlaceholder,
}) => {
  const { setTab } = useGifPicker();

  return (
    <ReactVirtualizedAutoSizer>
      {({ height, width }) => (
        <Grid
          width={width}
          height={height}
          columnCount={2}
          columnWidth={(width - 16 - 8) / 2}
          rowCount={Math.floor((categories.length ?? 0) / 2) + 1}
          rowHeight={118}
          itemData={categories}
          className="flex-1 min-h-0 custom-scrollbar scrollbar-thin
          overflow-y-auto relative min-w-0 overflow-x-hidden"
        >
          {({ columnIndex, rowIndex, style }) => (
            <div
              style={{
                ...style,
                left: parseInt(style.left?.toString() ?? "0") + (columnIndex === 0 ? 8 : 16),
                top: parseInt(style.top?.toString() ?? "0") + 8,
                height: 110,
              }}
            >
              {rowIndex === 0 ? (
                columnIndex === 0 ? (
                  <GifButton
                    favorite
                    customOnclick={() => setTab("favorites")}
                    categoryIcon={<AiFillStar size={17} />}
                    category={{
                      name: "Favorites",
                      src: "https://media.giphy.com/media/1TOSaJsWtnhe0/giphy.gif",
                    }}
                  />
                ) : (
                  <GifButton
                    customOnclick={() => setTab("trending")}
                    categoryIcon={<IoMdTrendingUp size={18} />}
                    category={{ name: "Trending GIFs", src: trendingGifPlaceholder.gif_src }}
                  />
                )
              ) : (
                <GifButton category={categories[(rowIndex - 1) * 2 + columnIndex]} />
              )}
            </div>
          )}
        </Grid>
      )}
    </ReactVirtualizedAutoSizer>
  );
};

export default GifCategoryList;
