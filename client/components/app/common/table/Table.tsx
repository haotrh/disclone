import classNames from "classnames";
import _ from "lodash";
import React, { ReactNode } from "react";
import TableCol from "./TableCol";
import TableDeleteButton from "./TableDeleteButton";
import TableRow from "./TableRow";

type Column<T> = {
  title?: string;
  field: keyof T;
  flexStyle?: string;
  className?: string;
  render?: (data: T) => ReactNode | ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: Extract<keyof T, string>;
  className?: string;
  handleDeleteRow?: (rowData: T) => any;
};

const Table = <T extends unknown>({
  columns,
  data,
  rowKey,
  className,
  handleDeleteRow,
}: TableProps<T>) => {
  return (
    <div>
      {/* Header */}
      <TableRow type="header">
        {columns.map((column) => (
          <TableCol
            className={column.className}
            key={column.field as string}
            flexStyle={column.flexStyle}
          >
            {column.title}
          </TableCol>
        ))}
      </TableRow>
      {/* Data */}
      {data.map((row) => (
        <TableRow
          className={classNames(className, "group")}
          type="data"
          key={row[rowKey] as unknown as string}
        >
          {columns.map((col) => (
            <TableCol className={col.className} flexStyle={col.flexStyle} key={col.field as string}>
              {col?.render
                ? _.isFunction(col.render)
                  ? col.render(row)
                  : col.render
                : typeof row[col.field] === "string"
                ? (row[col.field] as unknown as string)
                : null}
            </TableCol>
          ))}
          {handleDeleteRow && <TableDeleteButton onClick={() => handleDeleteRow(row)} />}
        </TableRow>
      ))}
    </div>
  );
};

export default Table;
