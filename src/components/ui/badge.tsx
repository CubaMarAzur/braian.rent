export function Badge({
  children,
  className = '',
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive';
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _variant = variant; // For future use

  return (
    <span
      className={
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' +
        className
      }
    >
      {children}
    </span>
  );
}
