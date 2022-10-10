import useOnClickOutside from "@lib/hooks/useOnClickOutside";
import classNames from "classnames";
import _ from "lodash";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import SimpleBar from "simplebar-react";

interface SearchSelectOption {
  label: string;
  value: any;
}

interface SearchSelectProps {
  className?: string;
  options: SearchSelectOption[];
  onChange?: (value: any) => any;
  // defaultValue?: string | null;
}

const SearchSelect = ({
  className,
  options,
  onChange,
}: // defaultValue,
SearchSelectProps) => {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  //search list
  const filterList = useMemo(() => {
    return options.filter((option) => option.label.includes(search));
  }, [search, options]);

  //open
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectClick = () => {
    if (!isExpanded) {
      setIsExpanded(!isExpanded);
      inputRef.current?.focus();
    } else {
      handleClickOutside();
    }
  };

  const handleClickOutside = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setSearch("");
    }
  };

  useOnClickOutside(selectRef, handleClickOutside);

  const handleOptionClick = (value: any, index: number) => {
    if (index === selectedIndex) return;
    onChange && onChange(value);
    setSelectedIndex(index);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  //Scroll when expanded
  useEffect(() => {
    if (isExpanded && selectedIndex && optionRefs.current[selectedIndex]) {
      optionRefs.current[selectedIndex]?.scrollIntoView({
        block: "end",
      });
    }
  }, [isExpanded]);

  useEffect(() => {
    if (optionRefs.current[0]) {
      optionRefs.current[0].scrollIntoView();
    }
  }, [search]);

  return (
    <div
      ref={selectRef}
      onClick={handleSelectClick}
      className={classNames("dark-container p-2 relative flex text-[17px]", className)}
    >
      {/* No select and no search */}
      {!search && _.isNull(selectedIndex) && (
        <div className="absolute text-channels-default">Chọn</div>
      )}
      {/* Selected and not search */}
      {!search && !_.isNull(selectedIndex) && (
        <div className="absolute">{options[selectedIndex].label}</div>
      )}
      {/* search input */}
      <div className="relative w-full overflow-hidden flex-1">
        <input
          onChange={handleSearch}
          ref={inputRef as any}
          value={search}
          spellCheck={false}
          className="bg-transparent select-none max-w-full cursor-default focus:cursor-text"
        />
      </div>
      {isExpanded && (
        <div className="absolute overflow-y-auto bottom-full dark-container w-[calc(100%+2px)] -mx-[1px] left-0 shadow-md">
          <SimpleBar className="max-h-[200px] select-scrollbar">
            <div>
              {_.isEmpty(filterList) ? (
                <div
                  onClick={handleClickOutside}
                  className="p-2 text-center select-none text-channels-default"
                >
                  Không tìm thấy kết quả nào!
                </div>
              ) : (
                filterList.map((option, i) => {
                  return (
                    <div
                      key={option.label + i}
                      ref={(el) => (optionRefs.current[i] = el)}
                      onClick={() => handleOptionClick(option.value, i)}
                      className={classNames(
                        "select-none py-2 px-3 duration-75 transition cursor-pointer",
                        {
                          "bg-background-tertiary": selectedIndex === i,
                          "hover:bg-background-secondary-alt": selectedIndex !== i,
                        }
                      )}
                    >
                      {option.label}
                    </div>
                  );
                })
              )}
            </div>
          </SimpleBar>
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
