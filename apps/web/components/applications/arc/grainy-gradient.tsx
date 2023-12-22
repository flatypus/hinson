export default function GrainyGradient({
  className,
  children,
  innerClassName,
}: {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      className={`h-full w-full bg-gradient-to-br from-purple-500 to-blue-600 ${className}`}
    >
      <div
        className={`grainy-gradient flex h-full w-full flex-row ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
