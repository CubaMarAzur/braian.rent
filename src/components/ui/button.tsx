export function Button({
  children,
  className = '',
  variant = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}) {
  const baseClasses =
    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium';

  const variantClasses = {
    default: 'shadow-sm ring-1 ring-black/5',
    outline: '', // Custom styles handled in className
    ghost: 'hover:bg-gray-100',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
