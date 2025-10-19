export function Card(p: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        'rounded-2xl bg-white shadow-xl ring-1 ring-black/5 ' +
        (p.className || '')
      }
      {...p}
    />
  );
}
export const CardHeader = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="p-6" {...p} />
);
export const CardContent = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="p-6 pt-0" {...p} />
);
export const CardTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
