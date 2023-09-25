"use client";

import { useEffect } from "react";
import useWindowsStore from "@stores/windows.store";
import useSettingsStore from "@stores/settings.store";
import Window from "./window/window";
import Drag from "./drag";

export default function Content(): JSX.Element {
  const { windows } = useWindowsStore();
  const { setIsTouchDevice } = useSettingsStore();

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, [setIsTouchDevice]);

  useEffect(() => {
    windows.forEach((app) => {
      app.injectGetSize(() => ({
        width: window.innerWidth,
        height: window.innerHeight - 64,
      }));
      app.hide(false);
    });
    const finder = windows.find((app) => app.name === "Finder");
    if (!finder) return;
    finder.window();
  }, [windows]);

  return (
    <div className="flex-1">
      {windows.map((app) => {
        if (app.mode !== "minimized" && app.mode !== "closed") {
          return <Window app={app} key={app.name} />;
        }
        return null;
      })}
      <Drag />
    </div>
  );
}
