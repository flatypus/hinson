export default function GrainyGradient({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-500 to-blue-600">
      <div className="grainy-gradient flex h-full w-full flex-row">
        {children}
      </div>
    </div>
  );
}
