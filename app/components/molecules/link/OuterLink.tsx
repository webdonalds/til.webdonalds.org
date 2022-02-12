export function OuterLink({ className, url, children }: {
  className?: string,
  url: string,
  children: string,
}) {
  return (
    <a
      className={`${className || ""} hover:opacity-75 hover:underline transition`}
      href={url}
      target="_blank"
    >
      {children}
    </a>
  );
}
