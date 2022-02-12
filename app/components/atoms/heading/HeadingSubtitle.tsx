interface HeadingSubtitleProps {
  children: string;
  className?: string;
}

export function HeadingSubtitle({ children, className }: HeadingSubtitleProps) {
  return <p className={`py-2 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 ${className || ""}`}>
    {children}
  </p>;
}
