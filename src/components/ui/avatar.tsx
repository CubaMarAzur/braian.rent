export const Avatar = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={
      'flex h-9 w-9 items-center justify-center rounded-full ' + className
    }
  >
    {children}
  </div>
);
export const AvatarFallback = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <span className={'text-sm font-medium ' + className}>{children}</span>;
