import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { WindowContext } from "@stores/window.context";
import Welcome from "../welcome/welcome";
import GrainyGradient from "./grainy-gradient";
import Input from "./input";
import Pinned from "./pinned";

type Tab = {
  name: string;
  url: string;
  element?: () => JSX.Element;
}[];

const innerElems = (currentURL: string, shortenedName: string): JSX.Element => (
  <>
    <Input currentURL={currentURL} shortenedName={shortenedName} />
    <Pinned />
    <h3 className="text-left font-semibold text-black text-opacity-50">
      DIRECTORY
    </h3>
  </>
);

function MinimizedSidebar({
  children,
  show,
}: {
  children: JSX.Element;
  show: boolean | null;
}): JSX.Element {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="relative text-[12px]">
      <div
        className={`absolute left-0 top-0 z-20 h-full ${
          show || hovering ? "translate-x-0" : "-translate-x-[120%]"
        } transition-all duration-300`}
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
        <GrainyGradient
          className="h-full !w-[200px] rounded-lg border-[1px] border-white border-opacity-80 p-2 shadow-lg"
          innerClassName="flex !flex-col gap-y-2 p-1"
        >
          {children}
        </GrainyGradient>
      </div>
    </div>
  );
}

function Sidebar({
  children,
  small,
}: {
  children: JSX.Element;
  small: boolean;
}): JSX.Element {
  return (
    <div
      className={`flex w-1/5 flex-col gap-y-2 text-[12px] transition-all ${
        small ? "w-[1px]" : "mr-3 w-1/5 max-w-[500px] lg:w-1/6"
      }`}
    >
      {children}
    </div>
  );
}

export default function Arc(): JSX.Element {
  const BREAKPOINT = 1200;
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [dims, setDims] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const small = useMemo(() => dims.width < BREAKPOINT, [dims.width]);
  const [minimized, setMinimized] = useState(small);

  const { subscribe } = useContext(WindowContext);
  const windowRef = useRef<HTMLDivElement>(null);
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
        className="relative flex w-full flex-row p-3"
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        onMouseMove={(e) => {
          setMouse({ x: e.clientX, y: e.clientY });
        }}
        ref={windowRef}
      >
        {/* for minimized/phone view */}
        {small ? (
          <MinimizedSidebar show={hover ? mouse.x - dims.x < 15 : null}>
            {innerElems(tabs[selectedTab].url, shortenedName)}
          </MinimizedSidebar>
        ) : null}
        {/* for full width */}
        <Sidebar small={small}>
          {innerElems(tabs[selectedTab].url, shortenedName)}
        </Sidebar>
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
