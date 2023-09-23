"use client";

import React from "react";
import type { Window } from "@stores/windows.store";
import useWindowsStore from "@stores/windows.store";

export default function WindowWrapper({ app }: { app: Window }): JSX.Element {
  const { unfocusWindow, setActive } = useWindowsStore();
  return (
    <section>
      <div className="relative text-center">
        <span>
          <button
            className="mr-2 inline-block h-3 w-3 rounded-full bg-red-500"
            onClick={() => {
              unfocusWindow(app.name, "closed");
            }}
            type="button"
          />
          <button
            className="mr-2 inline-block h-3 w-3 rounded-full bg-yellow-500"
            onClick={() => {
              unfocusWindow(app.name, "minimized");
            }}
            type="button"
          />
          <button
            className="inline-block h-3 w-3 rounded-full bg-green-500"
            onClick={() => {
              setActive(app.name);
              app.setMode("fullscreen");
            }}
            type="button"
          />
        </span>
        {app.name}
      </div>
      {app.component}
    </section>
  );
}
