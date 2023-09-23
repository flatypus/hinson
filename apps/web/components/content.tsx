"use client";

import useWindowsStore from "@stores/windows.store";
import Window from "./window";

export default function Content(): JSX.Element {
  const { windows } = useWindowsStore();
  return (
    <div className="relative">
      {windows.map((app) => {
        if (app.mode !== "minimized" && app.mode !== "closed") {
          return <Window app={app} key={app.name} />;
        }
        return null;
      })}
    </div>
  );
}
