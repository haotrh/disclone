import classNames from "classnames";
import React, { ReactNode } from "react";
import { BsCircleFill } from "react-icons/bs";
import {
  IoIosRadioButtonOn,
  IoMdRadioButtonOff,
  IoMdRadioButtonOn,
} from "react-icons/io";

interface RadioButtonProps {
  name: string;
  description?: string;
  radioCirclePosition?: "left" | "right";
  selected?: boolean;
  icon?: ReactNode;
  onClick?: () => any;
}

const RadioButton = ({
  name,
  description,
  selected = false,
  radioCirclePosition = "left",
  icon,
  onClick,
}: RadioButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "p-[10px] rounded cursor-pointer flex items-center select-none gap-2",
        {
          "bg-background-modifier-selected": selected,
          "bg-background-secondary hover:bg-background-modifier-hover active:bg-background-modifier-selected":
            !selected,
          "flex-row-reverse": radioCirclePosition === "right",
        }
      )}
    >
      {selected ? (
        <IoMdRadioButtonOn className="text-header-primary" size={24} />
      ) : (
        <IoMdRadioButtonOff className="text-header-primary" size={24} />
      )}
      <div className="flex items-center gap-2 flex-1">
        {icon && <div className="text-header-secondary">{icon}</div>}
        <div>
          <div className="font-medium">{name}</div>
          {description && (
            <div className="text-sm text-header-secondary font-medium mt-1">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RadioButton;
