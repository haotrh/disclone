import useOnClickOutside from "@lib/hooks/useOnClickOutside";
import classNames from "classnames";
import _, { uniqueId } from "lodash";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import SimpleBar from "simplebar-react";

export interface SelectOption {
  label: ReactNode;
  value: any;
}

interface SelectProps {
  className?: string;
  options: SelectOption[];
  onChange?: (value: any) => any;
  defaultValue?: any;
  maxHeight?: number;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  className,
  onChange,
  maxHeight = 400,
  disabled,
  defaultValue,
}) => {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const id = useRef(uniqueId());

  const [selectedIndex, setSelectedIndex] = useState<number>(
    _.max([options.findIndex((option) => option.value === defaultValue), 0]) || 0
  );

  //open
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectClick = () => {
    if (!isExpanded) {
      setIsExpanded(!isExpanded);
    } else {
      handleClickOutside();
    }
  };

  const handleClickOutside = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  useOnClickOutside(selectRef, handleClickOutside);

  const handleOptionClick = (value: any, index: number) => {
    if (index === selectedIndex) return;
    onChange && onChange(value);
    setSelectedIndex(index);
  };

  //Scroll when expanded
  useEffect(() => {
    if (isExpanded && selectedIndex && optionRefs.current[selectedIndex]) {
      optionRefs.current[selectedIndex]?.scrollIntoView({
        block: "end",
      });
    }
  }, [isExpanded]);

  return (
    <div
      ref={selectRef}
      onClick={handleSelectClick}
      className={classNames(
        className,
        "bg-input-background rounded text-[17px] select-none cursor-pointer",
        {
          "opacity-50 pointer-events-none": disabled,
        }
      )}
    >
      <div className="px-3 py-2.5 flex justify-between">
        <div className="font-medium">{options[selectedIndex].label}</div>
        <div
          className={classNames("font-medium origin-center transition", {
            "-rotate-180": isExpanded,
          })}
        >
          <IoChevronDownOutline />
        </div>
      </div>
      <div className="relative">
        {isExpanded && (
          <div
            className="absolute overflow-y-auto top-full z-20 w-full left-0
          rounded-sm border border-background-tertiary bg-background-secondary-alt"
          >
            <SimpleBar style={{ maxHeight }} className="select-scrollbar font-medium">
              <div>
                {options.map((option, i) => (
                  <div
                    key={id.current + i}
                    ref={(el) => (optionRefs.current[i] = el)}
                    onClick={() => handleOptionClick(option.value, i)}
                    className={classNames("select-none px-3 py-2.5 cursor-pointer", {
                      "bg-background-modifier-hover flex justify-between items-center":
                        selectedIndex === i,
                      "hover:bg-background-modifier-hover bg-background-secondary-alt":
                        selectedIndex !== i,
                    })}
                  >
                    <div>{option.label}</div>
                    {selectedIndex === i && (
                      <div className="bg-primary rounded-full text-white">
                        <IoMdCheckmark size={18} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SimpleBar>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
