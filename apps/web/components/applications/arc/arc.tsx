import { useState } from "react";
import Welcome from "../welcome/welcome";
import GrainyGradient from "./grainy-gradient";
import Input from "./input";
import Pinned from "./pinned";

type Tab = {
  name: string;
  url: string;
  element?: () => JSX.Element;
}[];

export default function Arc(): JSX.Element {
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
        <div className="flex w-1/5 flex-col gap-2 text-xs lg:w-1/6">
          <Input
            currentURL={tabs[selectedTab].url}
            shortenedName={shortenedName}
          />
          <Pinned />
          <h3 className="text-left text-[10px] font-semibold text-black text-opacity-50">
            DIRECTORY
          </h3>
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
