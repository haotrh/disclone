import { decimalToRgb, hexIsLight } from "@utils/colors";
import classNames from "classnames";
import React, { CSSProperties, ReactNode, useState } from "react";
import { CgColorPicker } from "react-icons/cg";
import { Popover } from "../popover";
import { Tooltip } from "../tooltip";
import ColorPicker, { ColorPickerProps } from "./ColorPicker";

interface ColorPickerButtonProps extends ColorPickerProps {
  tooltip?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  tooltip,
  defaultValues,
  onChange,
  children,
  className,
  style,
}) => {
  const [bright, setBright] = useState(false);
  const [color, setColor] = useState(0);

  return (
    <Popover
      placement="right-start"
      content={
        <ColorPicker
          defaultValues={defaultValues}
          onChange={(hexColor, number) => {
            if (hexIsLight(hexColor)) {
              setBright(true);
            } else {
              setBright(false);
            }
            setColor(parseInt(hexColor.replace("#", "0x"), 16));
            onChange && onChange(hexColor, number);
          }}
        />
      }
    >
      <Tooltip content={tooltip} visible={Boolean(tooltip)}>
        <div
          style={{ background: decimalToRgb(color), ...style }}
          className={classNames(
            "flex-center cursor-pointer w-[68px] min-h-[30px] rounded relative",
            className,
            {
              "text-black": bright,
              "text-white": !bright,
            }
          )}
        >
          <div className="absolute right-0 top-0 p-1">
            <CgColorPicker />
          </div>
          {children}
        </div>
      </Tooltip>
    </Popover>
  );
};

export default ColorPickerButton;
