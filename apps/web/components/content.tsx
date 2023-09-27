"use client";

import { useEffect } from "react";
import useWindowsStore from "@stores/windows.store";
import useSettingsStore from "@stores/settings.store";
import { File, fileStructure } from "@stores/file-structure";
import Window from "./window/window";
import Drag from "./drag";

export default function Content(): JSX.Element {
  const { windows, setGetWindowSize, addWindow } = useWindowsStore();
  const { setIsTouchDevice } = useSettingsStore();

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, [setIsTouchDevice]);

  useEffect(() => {
    const getWindowSize = (): {
      width: number;
      height: number;
    } => ({
      width: window.innerWidth,
      height: window.innerHeight - 64,
    });

    setGetWindowSize(getWindowSize);

    windows.forEach((app) => {
      app.injectGetSize(getWindowSize);
      app.hide(false);
    });

    const finder = windows.find((app) => app.name === "Finder");
    if (!finder) return;
    finder.window();

    setTimeout(() => {
      const welcome = fileStructure.traverse([
        "hinson",
        "AboutMe",
        "Welcome!.md",
      ]);

      if (!welcome || !(welcome instanceof File) || !welcome.content) return;

      addWindow({
        name: welcome.name,
        icon: welcome.icon,
        component: welcome.content,
      });
    }, 300);
  }, [addWindow, setGetWindowSize, windows]);

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
