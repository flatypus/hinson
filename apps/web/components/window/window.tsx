"use client";

import { Rnd } from "react-rnd";
import type { Window } from "@lib/classes/window";
import useSettingsStore from "@stores/settings.store";
import Finder from "@components/applications/finder/finder";
import { TitleBar } from "./titlebar";

export default function WindowWrapper({ app }: { app: Window }): JSX.Element {
  const { isTouchDevice } = useSettingsStore();
  return (
    <Rnd
      bounds="parent"
      disableDragging={isTouchDevice || app.mode === "fullscreen"}
      dragHandleClassName="drag-handle"
      enableResizing={app.mode !== "fullscreen"}
      minHeight={100}
      minWidth={200}
      onDragStop={(e, d) => {
        app.setTransform(d.x, d.y, app.width, app.height, false);
      }}
      onMouseDown={() => {
        app.setActiveWindow();
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        app.setTransform(
          position.x,
          position.y,
          Number.parseInt(ref.style.width),
          Number.parseInt(ref.style.height),
          false,
        );
      }}
      position={{ x: app.x, y: app.y }}
      size={{ width: app.width, height: app.height }}
      style={{ zIndex: app.active ? 10 : 5 }}
    >
      <div
        className={`relative h-full w-full rounded-lg border-[1px] border-[#6c6c6e] bg-apple-blur text-center text-black shadow-sm backdrop-blur-apple-blur ${
          ["minimized", "closed", "hiding"].includes(app.mode)
            ? "opacity-0"
            : "opacity-100"
        } transition-opacity duration-500`}
      >
        <TitleBar app={app} />
        <div className="z-10 h-[calc(100%-22px)] w-full overflow-hidden">
          {/* Circular dependency resolution... :p */}
          {app.name === "Finder" ? <Finder /> : app.component}
        </div>
      </div>
    </Rnd>
  );
}
