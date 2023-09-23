"use client";

import React from "react";
import { Rnd } from "react-rnd";
import type { Window } from "@stores/windows.store";
import useWindowsStore from "@stores/windows.store";
import { TitleBar } from "./titlebar";

export default function WindowWrapper({ app }: { app: Window }): JSX.Element {
  const { setActive } = useWindowsStore();
  return (
    <Rnd
      bounds="parent"
      dragHandleClassName="drag-handle"
      minHeight={100}
      minWidth={200}
      onDragStop={(e, d) => {
        app.setTransform(d.x, d.y, app.width, app.height, false);
      }}
      onMouseDown={() => {
        setActive(app.name);
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
          app.mode === "minimized" ||
          app.mode === "closed" ||
          app.mode === "hiding"
            ? "opacity-0"
            : "opacity-100"
        } transition-opacity duration-300`}
      >
        <TitleBar app={app} />
        <div className="z-10">{app.component}</div>
      </div>
    </Rnd>
  );
}
