"use client";

import { useEffect } from "react";
import useWindowsStore from "@stores/windows.store";
import { hide } from "./window/titlebar";
import Window from "./window/window";

export default function Content(): JSX.Element {
  const { windows, unfocusWindow } = useWindowsStore();

  useEffect(() => {
    windows.forEach((app) => {
      hide(app, "closed", false);
      unfocusWindow(app.name, "closed");
    });
  }, [unfocusWindow, windows]);

  return (
    <div className="flex-1">
      {windows.map((app) => {
        if (app.mode !== "minimized" && app.mode !== "closed") {
          return <Window app={app} key={app.name} />;
        }
        return null;
      })}
    </div>
  );
}
