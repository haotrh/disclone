import _ from "lodash";
import React, { ReactNode, useMemo, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Clickable } from "../button";
import { SearchInput } from "../input";
import MenuWrapper from "./MenuWrapper";

type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

type ComboBoxProps<T> = {
  data: T[];
  onClick: (value: T) => any;
  selectedData?: T;
  label: KeysMatching<T, string>;
  idKey: KeysMatching<T, string>;
  render?: (value: T) => ReactNode;
  keyName: string;
  placeholder?: string;
};

const ComboBox = <T extends Object>({
  data,
  onClick,
  placeholder,
  label,
  selectedData,
  idKey,
  render,
  keyName,
}: ComboBoxProps<T>) => {
  const [search, setSearch] = useState("");
  const isSelected = (value: T) => selectedData && selectedData[idKey] === value[idKey];
  const searchedData: T[] = useMemo(
    () =>
      data.filter((value) =>
        (value[label] as unknown as string).toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [data, search, label]
  );

  return (
    <MenuWrapper className="max-h-[300px]">
      <SearchInput placeholder={placeholder ?? "Search"} search={search} setSearch={setSearch} />
      <div className="py-2 flex-1 min-h-0 overflow-y-auto no-scrollbar mt-2 space-y-1">
        {_.isEmpty(searchedData) && (
          <div className="py-2 mb-4 text-center space-y-2">
            <div className="text-lg font-medium text-header-primary">Nope!</div>
            <div className="text-header-secondary">Did you make a typo?</div>
          </div>
        )}
        {searchedData.map((value) => (
          <Clickable
            type="popover"
            key={`${keyName}${value[idKey]}`}
            onClick={() => onClick(value)}
            bg
            theme="default"
            selected={isSelected(value)}
            className="text-base px-2 flex justify-between items-center font-medium gap-2"
          >
            <div className="flex-1 overflow-hidden min-w-0 overflow-ellipsis">
              {render ? render(value) : (value[label] as unknown as string)}
            </div>
            {isSelected(value) && (
              <IoCheckmarkCircle className="flex-shrink-0 text-interactive-normal" size={22} />
            )}
          </Clickable>
        ))}
      </div>
    </MenuWrapper>
  );
};

export default ComboBox;
