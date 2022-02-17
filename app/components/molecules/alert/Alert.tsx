import { ReactNode } from "react";

type AlertColor = "gray" | "red" | "green";

type AlertProps = {
  color?: AlertColor;
  children: ReactNode;
}

export const Alert = ({ color, children }: AlertProps) => {
  let bgClass;
  let shadowClass;
  let fontClass;
  switch (color || "gray") {
    case "gray":
      bgClass = "bg-gray-300";
      shadowClass = "shadow-gray-300/50";
      fontClass = "text-gray-700";
      break;
    case "red":
      bgClass = "bg-red-500";
      shadowClass = "shadow-red-500/50";
      fontClass = "text-white";
      break;
    case "green":
      bgClass = "bg-green-500";
      shadowClass = "shadow-green-500/50";
      fontClass = "text-white";
      break;
  }

  return (
    <div className={`w-full p-4 ${bgClass} ${shadowClass} shadow-lg rounded-lg ${fontClass} text-base`}>
      {children}
    </div>
  );
};
