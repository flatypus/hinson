import type { Window } from "@app/stores/windows.store";
import useWindowsStore from "@app/stores/windows.store";
import { Close } from "./close";
import { Minimize } from "./minimize";
import { UnFullScreen } from "./unfullscreen";
import { FullScreen } from "./fullscreen";

export function randomWindowTransform(app: Window): void {
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  app.width = innerWidth / 2;
  app.height = innerHeight / 2;

  app.x = Math.floor(Math.random() * (innerWidth - app.width));
  app.y = Math.floor(Math.random() * (innerHeight - app.height));
}

export function TitleBar({ app }: { app: Window }): JSX.Element {
  const { unfocusWindow, setActive } = useWindowsStore();
  return (
    <div className="drag-handle group flex items-center justify-between rounded-t-md bg-gradient-to-b from-[#323232] to-[#2a2a2a] px-2">
      <div className="z-10 flex-shrink-0">
        <button
          className="mr-2 inline-block h-3 w-3 rounded-full bg-[#fe5f57]"
          onClick={() => {
            unfocusWindow(app.name, "closed");
          }}
          type="button"
        >
          <div className="opacity-0 group-hover:opacity-100">
            <Close />
          </div>
        </button>
        <button
          className="mr-2 inline-block h-3 w-3 rounded-full bg-[#febc2e]"
          onClick={() => {
            unfocusWindow(app.name, "minimized");
          }}
          type="button"
        >
          <div className="opacity-0 group-hover:opacity-100">
            <Minimize />
          </div>
        </button>
        <button
          className="inline-block h-3 w-3 rounded-full bg-[#28c840]"
          onClick={() => {
            setActive(app.name);
            if (app.mode === "fullscreen") {
              app.setMode("windowed");
              randomWindowTransform(app);
            } else {
              app.setMode("fullscreen");
              app.setPos(0, 0);
              app.setSize(window.innerWidth, window.innerHeight - 64);
            }
          }}
          type="button"
        >
          <div className="opacity-0 group-hover:opacity-100">
            {app.mode === "fullscreen" ? <UnFullScreen /> : <FullScreen />}
          </div>
        </button>
      </div>
      <div className="absolute inset-x-0 text-center">
        <b className="font-sf text-sm font-bold text-[#a0a0a0]">{app.name}</b>
      </div>
    </div>
  );
}
