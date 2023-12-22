import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { XIcon } from "@primer/octicons-react";
import { WindowContext } from "@stores/window.context";
import type { Tab } from "@lib/types";
import Welcome from "../welcome/welcome";
import GrainyGradient from "./grainy-gradient";
import Input from "./input";
import Pinned from "./pinned";
import { MinimizedSidebar, Sidebar } from "./sidebar";
import Slider from "./slider";

const innerElems = (
  selectedTab: number,
  setSelectedTab: (index: number) => void,
  tabs: Tab[],
  setTabs: ((tabs: Tab[]) => void) &
    ((tabs: ((tabs: Tab[]) => Tab[]) | Tab[]) => void),
  shortenedName: string,
): JSX.Element => (
  <>
    <Input currentURL={tabs[selectedTab]?.url} shortenedName={shortenedName} />
    <Pinned setSelectedTab={setSelectedTab} setTabs={setTabs} tabs={tabs} />
    <h3 className="text-left font-semibold text-black text-opacity-50">
      DIRECTORY
    </h3>
    <div className="flex h-full flex-col gap-1 overflow-y-scroll">
      {tabs.map((tab, index) => (
        <button
          className={`group relative flex cursor-default items-center justify-start gap-2 rounded-md p-2 ${
            index === selectedTab
              ? "bg-white bg-opacity-80"
              : "bg-transparent hover:bg-white hover:bg-opacity-10"
          }`}
          key={tab.key}
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
            <div className="w-[85%] border-none bg-transparent text-left text-black outline-none">
              {tab.name}
            </div>
          ) : (
            <input
              className="w-full border-none bg-transparent text-left text-black outline-none group-hover:w-[85%]"
              defaultValue={tab.name}
              onBlur={(event) => {
                event.preventDefault();
              }}
              type="text"
            />
          )}
          <div className="absolute right-1 top-[50%] -translate-y-1/2 transform">
            {
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- delete button
              <div
                className="rounded-lg px-[2px] pt-[2px] hover:bg-black hover:bg-opacity-5"
                onClick={() => {
                  const newTabs = [...tabs];
                  newTabs.splice(index, 1);
                  setTabs(newTabs);
                }}
              >
                <XIcon className="opacity-0 group-hover:opacity-100" />
              </div>
            }
          </div>
        </button>
      ))}
    </div>
  </>
);

export default function Arc(): JSX.Element {
  const BREAKPOINT = 1200;
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [dims, setDims] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const small = useMemo(() => dims.width < BREAKPOINT, [dims.width]);
  const [minimized, setMinimized] = useState(small);

  const { subscribe } = useContext(WindowContext);
  const windowRef = useRef<HTMLDivElement>(null);

  const [selectedTab, setSelectedTab] = useState(0);

  const [tabs, setTabs] = useState<Tab[]>([
    {
      name: "Hinson's Personal Site",
      element: Welcome,
      url: "https://flatypus.me",
      icon: "/images/flatypus.png",
      key: new Date().getTime().toString(),
    },
  ]);

  const shortenedName = tabs[selectedTab]
    ? tabs[selectedTab].url.split("://")[1].split("/")[0]
    : "";

  useEffect(() => {
    const newDimensions = subscribe({
      breakpoint: { width: BREAKPOINT },
      callback: (dimensions) => {
        setDims(dimensions);
      },
    });
    setDims(newDimensions);
  }, [subscribe]);

  useEffect(() => {
    if (small === minimized) return;
    setTimeout(() => {
      setMinimized(small);
    }, 300);
  }, [small, minimized]);

  return (
    <GrainyGradient>
      <div
        className="relative flex h-full w-full flex-1 flex-row overflow-hidden"
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
          setMouse({ x: e.clientX, y: e.clientY });
        }}
        ref={windowRef}
      >
        {/* for minimized/phone view */}
        {small ? (
          <MinimizedSidebar show={hover ? mouse.x - dims.x < 8 : null}>
            {innerElems(
              selectedTab,
              setSelectedTab,
              tabs,
              setTabs,
              shortenedName,
            )}
          </MinimizedSidebar>
        ) : null}
        <Slider
          componentA={
            <Sidebar small={small}>
              {/* for maximized/desktop view */}
              {innerElems(
                selectedTab,
                setSelectedTab,
                tabs,
                setTabs,
                shortenedName,
              )}
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
  );
}
