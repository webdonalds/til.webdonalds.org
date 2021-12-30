import { ChangeEventHandler } from "react";
import { LabelText } from "~/components/atoms/form";

type InputProp = {
  className?: string | undefined;
  name: string;
  label: string;
  rows?: number | undefined;
  defaultValue?: string | number | undefined;
  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
};

export function LabeledTextarea({
  className,
  name,
  label,
  rows,
  defaultValue,
  onChange,
}: InputProp) {
  return (
    <label className="block py-4">
      <LabelText>{label}</LabelText>
      <textarea
        className={`${className || ""} w-full block rounded`}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </label>
  );
}
