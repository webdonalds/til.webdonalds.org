import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

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
      <p className="font-bold">{label}</p>
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
