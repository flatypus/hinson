"use client";

import Image from "next/image";
import useWindowsStore from "@stores/windows.store";

// type Apps = typeof apps;

const ICON_SIZE = 48;

export default function Dock(): JSX.Element {
  const { windows } = useWindowsStore();

  return (
    <div className="relative m-8 grid place-items-center">
      <div className="absolute flex flex-row rounded-2xl border-[0.25px] border-[#00000047] bg-apple-blur p-[4px] pb-[2px] backdrop-blur-apple-blur">
        {windows
          .filter((app) => app.docked || app.mode !== "closed")
          .map((app) => (
            <div className="grid place-items-center" key={app.name}>
              <button
                onClick={() => {
                  // TODO: fix this logic?
                  if (app.mode === "fullscreen") {
                    if (app.active) {
                      app.window();
                    } else {
                      app.setActiveWindow();
                    }
                  } else if (app.mode !== "windowed") {
                    app.window();
                  } else if (app.active) {
                    app.fullscreen();
                  } else {
                    app.setActiveWindow();
                  }
                }}
                type="button"
              >
                {typeof app.icon === "string" ? (
                  <Image
                    alt={app.name}
                    height={ICON_SIZE}
                    src={`/icons/${app.icon}`}
                    width={ICON_SIZE}
                  />
                ) : (
                  <app.icon />
                )}
              </button>
              {app.mode !== "closed" ? (
                <span className="aspect-square h-[2px] rounded-full bg-[#ffffffac] md:h-1" />
              ) : (
                <span className="h-[2px] md:h-1" />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
