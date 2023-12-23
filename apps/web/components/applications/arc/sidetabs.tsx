import Image from "next/image";
import { XIcon } from "@primer/octicons-react";
import type { Tab } from "@lib/types";

export default function SideTabs({
  selectedTab,
  setSelectedTab,
  tabs,
  setTabs,
}: {
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  tabs: Tab[];
  setTabs: ((tabs: Tab[]) => void) &
    ((tabs: ((tabs: Tab[]) => Tab[]) | Tab[]) => void);
}): JSX.Element {
  return (
    <div className="flex h-full flex-col gap-1 overflow-y-scroll">
      {tabs.map((tab, index) => (
        <div className="group relative w-full" key={tab.key}>
          <div className="absolute right-1 top-[50%] -translate-y-1/2 transform">
            <button
              className="cursor-default rounded-lg px-[2px] pt-[2px] hover:bg-black hover:bg-opacity-5"
              onClick={() => {
                const newTabs = [...tabs];
                newTabs.splice(index, 1);
                setTabs(newTabs);
                if (index === selectedTab) {
                  setSelectedTab(newTabs.length - 1);
                }
              }}
              type="button"
            >
              <XIcon className="opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          <button
            className={`flex w-full cursor-default items-center justify-start gap-2 rounded-md p-2 ${
              index === selectedTab
                ? "bg-white bg-opacity-80"
                : "bg-transparent hover:bg-white hover:bg-opacity-10"
            }`}
            onClick={() => {
              setSelectedTab(index);
            }}
            type="button"
          >
            <Image
              alt={tab.name}
              className="w-[10px] rounded-md"
              height={16}
              src={tab.icon}
              width={16}
            />
            {selectedTab === index ? (
              <div className="w-[80%] border-none bg-transparent text-left text-black outline-none">
                {tab.name}
              </div>
            ) : (
              <input
                className="w-full border-none bg-transparent text-left text-black outline-none group-hover:w-[80%]"
                defaultValue={tab.name}
                onBlur={(event) => {
                  event.preventDefault();
                }}
                type="text"
              />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
