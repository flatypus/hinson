import { useRef, useState } from "react";
import Welcome from "../welcome/welcome";

type Tab = {
  name: string;
  url: string;
  element?: () => JSX.Element;
}[];

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
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- temp
  const [selectedTab, setSelectedTab] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- temp
  const [tabs, setTabs] = useState<Tab>([
    {
      name: "Hinson's Personal Site",
      element: Welcome,
      url: "https://cosmo.flatypus.me",
    },
  ]);
  const shortenedName = tabs[selectedTab].url.split("://")[1].split("/")[0];

  return (
    <GrainyGradient>
      <div className="flex w-full flex-row gap-3 p-3">
        <div className="text-xs">
          <input
            className="rounded-lg border-none bg-[#ffffff31] p-2 text-black text-opacity-70 outline-none"
            defaultValue={shortenedName}
            onBlur={(event) => {
              event.preventDefault();
              if (!inputRef.current) return;
              inputRef.current.value = shortenedName;
            }}
            onFocus={(event) => {
              event.preventDefault();
              if (!inputRef.current) return;
              inputRef.current.value = tabs[selectedTab].url;
              inputRef.current.select();
            }}
            onKeyDown={(event) => {
              const search = event.currentTarget.value;
              if (event.key === "Enter" && search) {
                if (search.startsWith("http")) {
                  window.open(event.currentTarget.value, "_blank");
                } else {
                  window.open(`https://www.google.com/search?q=${search}`);
                }
              }
            }}
            ref={inputRef}
            type="text"
          />
        </div>
        <div className="relative flex h-full w-full flex-col gap-1">
          <div className="h-full w-full overflow-hidden rounded-lg bg-white shadow-lg shadow-gray-600">
            <div className="relative h-full w-full">
              {tabs.map((tab, index) =>
                tab.element ? (
                  <tab.element key={tab.name} />
                ) : (
                  <iframe
                    className={`h-full w-full ${
                      index === selectedTab ? "z-10" : "z-0"
                    } absolute left-0 top-0 overflow-hidden`}
                    key={tab.name}
                    src={tab.url}
                    title={tab.name}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </GrainyGradient>
  );
}
