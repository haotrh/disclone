import React, { useEffect, useRef, useState } from "react";
import { Input } from "../input";
import { motion, useDragControls } from "framer-motion";
import { Range } from "react-range";
import { hslToHex } from "@utils/colors";
import _ from "lodash";

export interface ColorPickerProps {
  onChange?: (color: string, decimal?: number) => any;
  defaultValues?: { h: number; s: number; l: number };
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onChange,
  defaultValues = { h: 0, s: 0, l: 0 },
}) => {
  const saturationConstraintsRef = useRef<HTMLDivElement>(null);
  const saturationDragControls = useDragControls();
  const dotRef = useRef<HTMLDivElement>(null);

  const [hue, setHue] = useState(defaultValues.h);
  const [saturation, setSaturation] = useState(defaultValues.s);
  const [light, setLight] = useState(defaultValues.l);

  const updateSL = () => {
    const dot = dotRef.current;
    const board = saturationConstraintsRef.current;
    if (dot && board) {
      const style = window.getComputedStyle(dot);
      const matrix = new WebKitCSSMatrix(style.transform);
      const [x, y] = [matrix.m41, matrix.m42];
      const hsv_s = _.clamp(Math.floor(((x + 2) / board.clientWidth) * 100), 0, 100);
      const hsv_v = _.clamp(100 - Math.floor(((y + 2) / board.clientHeight) * 100), 0, 100);

      const hsl_l = ((2 - hsv_s / 100) * hsv_v) / 2;
      const hsl_s =
        hsl_l === 100 || hsl_l === 0
          ? 0
          : (hsv_s * hsv_v) / (hsl_l < 50 ? hsl_l * 2 : 200 - hsl_l * 2);

      hsl_s !== saturation && setSaturation(hsl_s);
      hsl_l !== light && setLight(hsl_l);
    }
  };

  const [hex, setHex] = useState(hslToHex(defaultValues.h, defaultValues.s, defaultValues.l));

  useEffect(() => {
    setHex(hslToHex(hue, saturation, light));
    const hex = hslToHex(hue, saturation, light);
    onChange && onChange(hex, parseInt(hex.replace("#", "0x"), 16));
  }, [hue, saturation, light]);

  return (
    <div className="bg-background-primary border shadow-md rounded-sm border-background-tertiary p-2 w-[220px] h-[220px] flex flex-col">
      <div className="flex-1 flex flex-col">
        <motion.div className="flex-1 flex relative cursor-pointer" ref={saturationConstraintsRef}>
          <div
            onPointerDown={(e) => {
              saturationDragControls.start(e, { snapToCursor: true });
              updateSL();
            }}
            style={{ backgroundColor: hslToHex(hue, 100, 50) }}
            className="flex-1 relative cursor-pointer"
          >
            <div className="absolute inset-0 from-white to-white/0 bg-gradient-to-r"></div>
            <div className="absolute inset-0 from-black to-black/0 bg-gradient-to-t"></div>
            <motion.div
              ref={dotRef}
              drag
              dragElastic={0}
              dragMomentum={false}
              dragConstraints={{
                top: -3,
                left: -3,
                right: saturationConstraintsRef.current?.clientWidth
                  ? saturationConstraintsRef.current?.clientWidth - 2
                  : 0,
                bottom: saturationConstraintsRef.current?.clientHeight
                  ? saturationConstraintsRef.current?.clientHeight - 2
                  : 0,
              }}
              dragControls={saturationDragControls}
              onDrag={updateSL}
              className="w-[6px] h-[6px] rounded-full absolute border border-white bg-black/40"
            />
          </div>
        </motion.div>
        <div className="my-2 relative">
          <Range
            values={[hue]}
            min={0}
            max={360}
            onChange={(value) => {
              setHue(value[0]);
            }}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  background:
                    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                }}
                className="h-2 rounded"
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                className="w-2 h-4 bg-white rounded-[3px] absolute focus:outline-none"
              />
            )}
          />
        </div>
      </div>
      <Input readOnly={true} value={hex} />
    </div>
  );
};

export default ColorPicker;
