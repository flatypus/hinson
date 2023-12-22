import { useState } from "react";
import GrainyGradient from "./grainy-gradient";

export function MinimizedSidebar({
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
