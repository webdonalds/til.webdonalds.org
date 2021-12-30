import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import { LabelText } from "~/components/atoms/form";

type InputProp = {
  name: string;
  type: HTMLInputTypeAttribute;
  label: string;
  defaultValue?: string | number | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
};

export function LabeledInput({
  name,
  type,
  label,
  defaultValue,
  onChange,
}: InputProp) {
  return (
    <label className="block py-4">
      <LabelText>{label}</LabelText>
      <input
        className="w-full block rounded"
        name={name}
        type={type}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </label>
  );
}
