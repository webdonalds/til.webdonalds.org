import { MouseEventHandler } from "react";

type ButtonProp = {
  type?: "submit" | "button" | "reset";
  color?: ButtonColor;
  text: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type ButtonColor = "gray" | "red" | "blue";

export function Button({ color, text, type, disabled, onClick }: ButtonProp) {
  let bgClass;
  let shadowClass;
  let fontClass;
  switch (color || "gray") {
    case "gray":
      bgClass = "bg-gray-300";
      shadowClass = "shadow-gray-300/50";
      break;
    case "red":
      bgClass = "bg-red-500";
      shadowClass = "shadow-red-500/50";
      fontClass = "text-white";
      break;
    case "blue":
      bgClass = "bg-blue-500";
      shadowClass = "shadow-blue-500/50";
      fontClass = "text-white";
      break;
  }

  const opacityClass = disabled ? "opacity-75" : "hover:opacity-75 transition";

  return (
    <button
      type={type}
      className={`px-4 py-2 ${bgClass} ${shadowClass} shadow-lg rounded-lg font-bold ${fontClass} ${opacityClass}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
