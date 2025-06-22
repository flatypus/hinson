"use client";

import { Rnd } from "react-rnd";
import type { Window } from "@lib/classes/window";
import useSettingsStore from "@stores/settings.store";
import Finder from "@components/applications/finder/finder";
import { WindowContext } from "@stores/window.context";
import Iterm from "@components/applications/iterm/iterm";
import { TitleBar } from "./titlebar";

export default function WindowWrapper({ app }: { app: Window }) {
  const { isTouchDevice } = useSettingsStore();
  return (
    <WindowContext.Provider value={app}>
      <Rnd
        bounds="parent"
        disableDragging={isTouchDevice || app.mode === "fullscreen"}
        dragHandleClassName="drag-handle"
        enableResizing={app.mode !== "fullscreen"}
        minHeight={100}
        minWidth={200}
        onDrag={(e, d) => {
          app.setTransform(d.x, d.y, app.width, app.height, false);
        }}
        onMouseDown={() => {
          app.setActiveWindow();
        }}
        onResize={(e, direction, ref, delta, position) => {
          app.setTransform(
            position.x,
            position.y,
            Number.parseInt(ref.style.width),
            Number.parseInt(ref.style.height),
            false,
          );
        }}
        position={{ x: app.x, y: app.y }}
        size={{
          width: app.width,
          height: app.height - (isTouchDevice ? 62 : 2),
        }}
        style={{
          zIndex: app.active ? 10 : 5,
          boxShadow: "0 0 25px -4px rgba(0 0 0 / 1)",
          overflow: "hidden",
          borderRadius: "0.5rem",
        }}
      >
        <div
          className={`relative h-full w-full rounded-lg border-[1px] border-[#6c6c6e] text-center text-black shadow-sm ${
            ["minimized", "closed", "hiding"].includes(app.mode)
              ? "opacity-0"
              : "opacity-100"
          } transition-opacity duration-500`}
        >
          <TitleBar app={app} />
          <div className="z-10 h-[calc(100%-22px)] w-full overflow-hidden">
            {/* Circular dependency resolution... :p */}
            {(() => {
              switch (app.name) {
                case "Finder":
                  return <Finder />;
                case "iTerm":
                  return <Iterm />;
                default:
                  return app.component;
              }
            })()}
          </div>
        </div>
      </Rnd>
    </WindowContext.Provider>
  );
}
