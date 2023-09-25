import { useState } from "react";

type Tab = string[];

function GrainyGradient({
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

export default function Arc(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- temp
  const [tabs, setTabs] = useState<Tab>(["https://en.wikipedia.org/"]);

  return (
    <GrainyGradient>
      <div className="relative w-[100px]" />

      {/* stack tabs, but have the 'active' tab be the one with index 0. It will appear on top with z index. */}
      <div className="relative flex h-full w-full flex-col gap-1 p-3">
        <div className="h-full w-full overflow-hidden rounded-lg bg-white shadow-lg shadow-gray-600">
          <div className="relative h-full w-full">
            {tabs.map((tab, index) => (
              <iframe
                className={`h-full w-full ${
                  index === 0 ? "z-10" : "z-0"
                } absolute left-0 top-0 overflow-hidden`}
                key={tab}
                src={tab}
                title={tab}
              />
            ))}
          </div>
        </div>
      </div>
    </GrainyGradient>
  );
}
