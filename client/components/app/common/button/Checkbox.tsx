import classNames from "classnames";
import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";

interface CheckboxProps {
  onChange: (checked: boolean) => any;
  label?: string;
  defaultChecked?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  onChange,
  label,
  defaultChecked = false,
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    onChange(!checked);
    setChecked(!checked);
  };

  return (
    <label className="relative flex items-center cursor-pointer">
      <div
        className={classNames(
          "w-6 h-6 rounded-md border  flex-center text-primary transition",
          {
            "border-indigo-400": checked,
            "border-button-text-disabled": !checked,
          }
        )}
      >
        {checked && <IoMdCheckmark size={18} />}
      </div>
      <input
        onChange={handleChange}
        checked={checked}
        type="checkbox"
        className="absolute w-6 h-6 opacity-0"
      />
      {label && (
        <div className="ml-2 text-sm text-interactive-normal font-medium">
          {label}
        </div>
      )}
    </label>
  );
};

export default Checkbox;
