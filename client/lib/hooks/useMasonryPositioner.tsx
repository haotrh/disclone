import _ from "lodash";
import { useMemo } from "react";

interface CellStyle {
  left: number;
  top: number;
  height: number;
}

interface Positioner {
  columnWidth: number;
  cellStyles: CellStyle[];
  cellRelativeHeight: number[];
  height: number;
}

interface Element {
  width: number;
  height: number;
  [key: string]: any;
}

interface useMasonryPositionerProps {
  width: number;
  elements: number[] | Element[];
  columnGap?: number;
  rowGap?: number;
  extraSpaceBottom?: number;
  columnCount?: number;
}

export default function useMasonryPositioner({
  columnCount = 2,
  columnGap = 0,
  rowGap = 0,
  elements,
  width,
}: useMasonryPositionerProps): Positioner {
  return useMemo(() => {
    const columnWidth = Math.floor((width - columnGap * 3) / columnCount);
    const cellRelativeHeight: number[] = [];
    const colHeight: number[] = _.range(columnCount).map(() => 0);

    const cellStyles: CellStyle[] = elements.map((element, i) => {
      const height = _.isNumber(element)
        ? element
        : Math.floor((columnWidth / element.width) * element.height);
      const minHeightCol = Math.min(...colHeight);
      const oldMaxHeightCol = Math.max(...colHeight);
      const colIndex = colHeight.indexOf(minHeightCol);
      const left = columnGap + (columnWidth + columnGap) * colIndex;
      const top = minHeightCol + rowGap;
      colHeight[colIndex] = colHeight[colIndex] + rowGap + height;
      const newMaxHeightCol = Math.max(...colHeight);
      cellRelativeHeight.push(
        Math.max(
          0.5,
          Math.floor(newMaxHeightCol - oldMaxHeightCol) + (i === elements.length - 1 ? rowGap : 0)
        )
      );
      return { height, left, top };
    });

    const height = _.sum(cellRelativeHeight);

    return { columnWidth, cellStyles, cellRelativeHeight, height };
  }, [columnCount, columnGap, rowGap, width, elements]);
}
