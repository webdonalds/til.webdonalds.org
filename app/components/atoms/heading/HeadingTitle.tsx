export function HeadingTitle({ children, className }: {
  children: string,
  className?: string,
}) {
  return <p className={`${className || ""} text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100`}>
    {children}
  </p>;
}
