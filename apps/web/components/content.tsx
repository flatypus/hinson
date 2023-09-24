"use client";

import { useEffect } from "react";
import useWindowsStore from "@stores/windows.store";
import Window from "./window/window";

export default function Content(): JSX.Element {
  const { windows } = useWindowsStore();

  useEffect(() => {
    windows.forEach((app) => {
      app.injectGetSize(() => ({
        width: window.innerWidth,
        height: window.innerHeight - 64,
      }));
      app.hide(false);
    });
  }, [windows]);

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
