import { ArcContext } from "@stores/arc.context";
import { ChevronRightIcon } from "@primer/octicons-react";
import { MinimizedSidebar, Sidebar } from "./sidebar";
import { Resume } from "@components/applications/resume/resume";
import { useContext, useEffect, useRef, useState } from "react";
import { useMobile } from "@lib/hooks/use-mobile";
import GrainyGradient from "./grainy-gradient";
import Input from "./input";
import Pinned from "./pinned";
import Playing from "@components/widgets/ytmusic";
import SideTabs from "./sidetabs";
import Slider from "./slider";
import type { Tab } from "@lib/types";
import Welcome from "../welcome/welcome";
import { createTab } from "@lib/createTab";

function InnerElems({ shortenedName }: { shortenedName: string }) {
  const { selectedTab, tabs } = useContext(ArcContext);

  return (
    <>
      <Input
        currentURL={tabs[selectedTab]?.url}
        shortenedName={shortenedName}
      />
      <Pinned />
      <h3 className="text-left font-semibold text-black text-opacity-50">
        DIRECTORY
      </h3>
      <SideTabs />
      <Playing />
    </>
  );
}

export default function Arc() {
  const small = useMobile();
  const [minimized, setMinimized] = useState(small);
  const [showMinimized, setShowMinimized] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);

  const [selectedTab, setSelectedTab] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>([
    createTab({
      name: "Hinson's Personal Site",
      element: Welcome,
    }),
    createTab({
      name: "My Resume!",
      url: "/resume",
      icon: "/images/flatypus.png",
      element: Resume,
    }),
    createTab({
      name: "Play Geoguessr against me!",
      url: "/geoguessr",
      icon: "/images/geoguessr.png",
      element: () => null,
      onClick: () => {
        const games = [
          "https://www.geoguessr.com/challenge/yVsGL9hcIs3vmpW6",
          "https://www.geoguessr.com/challenge/EIE8ypt6s93yQOZd",
        ];
        const randomGame = games[Math.floor(Math.random() * games.length)];
        window.open(randomGame, "_blank");
      },
    }),
    createTab({
      name: "Watch my documentary!",
      url: "/checkerboard",
      icon: "/icons/youtube.png",
      element: () => null,
      onClick: () => {
        window.open("https://www.youtube.com/watch?v=FD1XTU7OsLM", "_blank");
      },
    }),
  ]);

  const shortenedName = tabs[selectedTab]
    ? tabs[selectedTab].url.split("://")[1].split("/")[0]
    : "";

  useEffect(() => {
    if (small === minimized) return;
    setTimeout(() => {
      setMinimized(small);
    }, 300);
  }, [small, minimized]);

  return (
    <ArcContext.Provider
      value={{
        tabs,
        setTabs,
        selectedTab,
        setSelectedTab,
        addTab: (tab: Tab) => {
          setTabs((tabs) => [...tabs, tab]);
          setSelectedTab(tabs.length);
        },
        removeTab: (index: number) => {
          setSelectedTab((selectedTab) =>
            selectedTab === index ? 0 : selectedTab,
          );
          setTabs((tabs) => tabs.filter((_, i) => i !== index));
        },
      }}
    >
      <GrainyGradient>
        <div
          className="relative flex h-full w-full flex-1 flex-row overflow-hidden"
          ref={windowRef}
        >
          {small ? (
            <>
              <div className="absolute z-20 grid h-full place-items-center">
                <button
                  onClick={() => {
                    if (showMinimized) return;
                    setShowMinimized(true);
                  }}
                >
                  <ChevronRightIcon size={48} fill="#00000099" />
                </button>
              </div>
              <MinimizedSidebar show={showMinimized} small={small}>
                <InnerElems shortenedName={shortenedName} />
              </MinimizedSidebar>
              {showMinimized && (
                <div
                  className="absolute z-[19] h-full w-full"
                  onClick={() => {
                    if (showMinimized) setShowMinimized(false);
                  }}
                />
              )}
            </>
          ) : null}
          <Slider
            componentA={
              <Sidebar small={small}>
                {/* for maximized/desktop view */}
                <InnerElems shortenedName={shortenedName} />
              </Sidebar>
            }
            componentB={
              <div className="relative flex h-full w-full flex-col gap-1">
                <div className="h-full w-full overflow-hidden rounded-lg shadow-lg shadow-gray-600">
                  {tabs.length > 0 ? (
                    <div className="relative h-full w-full">
                      {tabs.map((tab, index) => (
                        <div
                          className={`h-full w-full ${
                            index === selectedTab
                              ? "z-10 opacity-100"
                              : "z-0 opacity-0"
                          } absolute left-0 top-0 overflow-hidden`}
                          key={tab.key}
                        >
                          {tab.element ? (
                            <tab.element />
                          ) : (
                            <iframe
                              className="h-full w-full"
                              src={tab.url}
                              title={tab.name}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            }
            one={minimized}
          />
        </div>
      </GrainyGradient>
    </ArcContext.Provider>
  );
}
