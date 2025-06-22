import { ArcContext } from "@stores/arc.context";
import { useContext } from "react";
import { XIcon } from "@primer/octicons-react";
import Image from "next/image";

export default function SideTabs() {
  const { tabs, setTabs, selectedTab, setSelectedTab } = useContext(ArcContext);

  return (
    <div className="flex h-full flex-col gap-1 overflow-y-scroll">
      {tabs.map((tab, index) => (
        <div className="group relative w-full" key={tab.key}>
          <div className="absolute right-1 top-[50%] -translate-y-1/2 transform">
            <button
              className="cursor-default rounded-lg px-[2px] pt-[2px] hover:bg-black/5"
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
                ? "bg-white/80"
                : "bg-transparent hover:bg-white/10"
            }`}
            onClick={() => {
              if (tab.onClick) {
                tab.onClick();
                return;
              }

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

            <div className="w-[80%] border-none bg-transparent text-left text-black outline-none">
              {tab.name}
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
