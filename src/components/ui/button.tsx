export function Button({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={
        'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 ' +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
