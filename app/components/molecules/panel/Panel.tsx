import { ReactNode } from "react";

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 px-4 md:px-8 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {children}
    </div>
  );
}
