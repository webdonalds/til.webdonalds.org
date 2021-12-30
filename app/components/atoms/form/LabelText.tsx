export function LabelText({ children }: { children: string }) {
  return <p className="py-2 font-bold text-gray-700 dark:text-gray-300">
    {children}
  </p>;
}
