"use client";

import React from "react";
import { Rnd } from "react-rnd";
import type { Window } from "@stores/windows.store";
import useWindowsStore from "@stores/windows.store";

function TitleBar({ app }: { app: Window }): JSX.Element {
  const { unfocusWindow, setActive } = useWindowsStore();
  return (
    <div className="flex items-center justify-between rounded-t-md bg-gradient-to-b from-[#323232] to-[#2a2a2a] px-2">
      <div className="flex-shrink-0">
        <button
          className="mr-2 inline-block h-3 w-3 rounded-full bg-[#fe5f57]"
          onClick={() => {
            unfocusWindow(app.name, "closed");
          }}
          type="button"
        />
        <button
          className="mr-2 inline-block h-3 w-3 rounded-full bg-[#febc2e]"
          onClick={() => {
            unfocusWindow(app.name, "minimized");
          }}
          type="button"
        />
        <button
          className="inline-block h-3 w-3 rounded-full bg-[#28c840]"
          onClick={() => {
            setActive(app.name);
            app.setMode("fullscreen");
          }}
          type="button"
        />
      </div>
      <b className="font-sf absolute inset-x-0 text-center text-sm font-bold text-[#a0a0a0]">
        {app.name}
      </b>
    </div>
  );
}
export default function WindowWrapper({ app }: { app: Window }): JSX.Element {
  return (
    <Rnd
      onDragStop={(e, d) => {
        app.setPos(d.x, d.y);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        app.setSize(
          Number.parseInt(ref.style.width),
          Number.parseInt(ref.style.height),
        );
        app.setPos(position.x, position.y);
      }}
      position={{ x: app.x, y: app.y }}
      size={{ width: app.width, height: app.height }}
      style={{ zIndex: app.active ? 10 : 5 }}
    >
      <div className="relative h-full w-full rounded-lg border-[1px] border-[#6c6c6e] bg-white text-center text-black shadow-sm">
        <TitleBar app={app} />
      </div>
      {app.component}
    </Rnd>
  );
}
