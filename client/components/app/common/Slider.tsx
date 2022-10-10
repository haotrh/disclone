import classNames from "classnames";
import React, { useState } from "react";
import { Range } from "react-range";

interface SliderProps {
  min?: number;
  max?: number;
  initialValue?: number;
  className?: string;
  onChange: (value: number) => any;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  onChange,
  className,
}) => {
  const [values, setValues] = useState([0]);

  return (
    <Range
      step={1}
      min={min}
      max={max}
      values={values}
      onChange={(values) => {
        setValues(values);
        onChange(values[0]);
      }}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
          }}
          className={classNames(
            className,
            "bg-background-modifier-normal h-2 rounded-full relative"
          )}
        >
          <div
            style={{ width: `${(values[0] / (max - min)) * 100}%` }}
            className="absolute inset-0 bg-primary rounded-full"
          ></div>
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          style={{
            ...props.style,
          }}
          className="w-3 h-[26px] bg-white rounded"
        />
      )}
    />
  );
};

export default Slider;
