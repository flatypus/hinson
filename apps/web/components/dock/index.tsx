"use client";

import Image from "next/image";
import useWindowsStore from "@stores/windows.store";

// type Apps = typeof apps;

const ICON_SIZE = 48;

export default function Dock(): JSX.Element {
  const { windows, setActive } = useWindowsStore();

  return (
    <div className="fixed bottom-2 left-1/2 flex -translate-x-1/2 transform flex-row rounded-lg border-[0.25px] border-[#00000047] bg-apple-blur backdrop-blur-apple-blur">
      {windows.map((app) => (
        <button
          key={app.name}
          onClick={() => {
            setActive(app.name);
            app.setMode("windowed");
          }}
          type="button"
        >
          <Image
            alt={app.name}
            height={ICON_SIZE}
            src={`/icons/${app.icon}`}
            width={ICON_SIZE}
          />
        </button>
      ))}
    </div>
  );
}
