import { useState } from "react";
import GrainyGradient from "./grainy-gradient";

export function MinimizedSidebar({
  children,
  show,
  small,
}: {
  children: React.ReactNode;
  show: boolean | null;
  small: boolean;
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="relative text-[12px]">
      <div
        className={`absolute left-2 top-2 z-20 h-[calc(100%-16px)] ${
          show || (!small && hovering) ? "translate-x-0" : "-translate-x-[120%]"
        } transition-all duration-300`}
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
        <GrainyGradient
          className="h-full !w-[200px] rounded-lg border-[0.5px] border-gray-300 shadow-lg"
          innerClassName="flex !flex-col gap-y-2 p-2"
        >
          {children}
        </GrainyGradient>
      </div>
    </div>
  );
}

export function Sidebar({
  children,
  small,
}: {
  children: React.ReactNode;
  small: boolean;
}) {
  return (
    <div
      className={`flex h-full w-1/5 flex-col gap-y-2 text-[12px] transition-all duration-300 ${
        small ? "-translate-x-[120%] overflow-hidden" : "mr-3 w-full"
      }`}
    >
      {children}
    </div>
  );
}
