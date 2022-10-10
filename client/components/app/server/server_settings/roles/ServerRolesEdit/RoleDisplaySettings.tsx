import { Divider, Input, Label, Toggle, Tooltip } from "@app/common";
import ColorPickerButton from "@app/common/color_picker/ColorPickerButton";
import { decimalToRgb, hexToHSL } from "@utils/colors";
import classNames from "classnames";
import React, { HTMLProps, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AiOutlineCheck } from "react-icons/ai";
import { rolesColor } from "types/color";
import { Role } from "types/server";

interface RoleColorPickButtonProps extends Omit<HTMLProps<HTMLDivElement>, "color"> {
  color: number;
}

const RoleColorPickButton = React.forwardRef<HTMLDivElement, RoleColorPickButtonProps>(
  ({ color, className, ...props }, ref) => {
    const { control } = useFormContext<Role>();

    return (
      <Controller
        control={control}
        name="color"
        render={({ field: { value, onChange } }) => (
          <div
            ref={ref}
            className={classNames("flex-center cursor-pointer", className)}
            onClick={() => onChange(color)}
            {...props}
            style={{ background: decimalToRgb(color) }}
          >
            {value === color && <AiOutlineCheck color="white" size={18} />}
          </div>
        )}
      />
    );
  }
);

RoleColorPickButton.displayName = "RoleColorPickButton";

const RoleCustomColorButton = React.forwardRef<HTMLDivElement>((_, ref) => {
  const { control } = useFormContext<Role>();
  const [init, setInit] = useState(false);

  return (
    <Controller
      control={control}
      name="color"
      render={({ field: { value, onChange } }) => {
        const isCustomColor = value !== rolesColor.default && !rolesColor.selection.includes(value);
        return (
          <ColorPickerButton
            defaultValues={isCustomColor ? hexToHSL("#" + value.toString(16)) : undefined}
            onChange={(hexColor, number) => {
              if (!isCustomColor && !init) {
                setInit(true);
              } else onChange(number);
            }}
            style={!isCustomColor ? { background: "unset" } : undefined}
            className={classNames({ "border border-background-accent": !isCustomColor })}
          >
            {isCustomColor && <AiOutlineCheck size={18} />}
          </ColorPickerButton>
        );
      }}
    />
  );
});

RoleCustomColorButton.displayName = "RoleCustomColorButton";

const RoleDisplaySettings = () => {
  const { register, control } = useFormContext<Role>();

  return (
    <div className="mt-10">
      <div>
        <Input required label="Role Name" {...register("name")} />
      </div>
      <Divider spacing="medium" />
      <div>
        <Label required>ROLE COLOR</Label>
        <div className="text-sm mb-2">
          Members use the color of the highest role they have on roles list.
        </div>
        <div className="flex gap-2">
          <Tooltip content="Default" placement="bottom">
            <RoleColorPickButton className="basis-[68px] rounded" color={rolesColor.default} />
          </Tooltip>
          <RoleCustomColorButton />
          <div className="flex-1 grid grid-cols-10 grid-rows-2 gap-2 min-h-0 min-w-0">
            {rolesColor.selection.map((color) => (
              <RoleColorPickButton key={color} className="rounded aspect-square" color={color} />
            ))}
          </div>
        </div>
      </div>
      <Divider spacing="medium" />
      <Controller
        control={control}
        name="hoist"
        render={({ field: { value, onChange } }) => (
          <Toggle
            active={value}
            onClick={() => onChange(!value)}
            label="Display role members seperately from online members"
          />
        )}
      ></Controller>
    </div>
  );
};

export default RoleDisplaySettings;
