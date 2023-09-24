import type { Window } from "@stores/window";
import { Close } from "./close";
import { Minimize } from "./minimize";
import { UnFullScreen } from "./unfullscreen";
import { FullScreen } from "./fullscreen";

export function TitleBar({ app }: { app: Window }): JSX.Element {
  return (
    <div className="drag-handle group flex cursor-grab items-center justify-between rounded-t-md bg-gradient-to-b from-[#323232] to-[#2a2a2a] px-2">
      <div className="z-10 flex-shrink-0">
        <button
          className="mr-2 inline-block h-3 w-3 rounded-full bg-[#fe5f57]"
          onClick={() => {
            app.close();
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
            app.minimize();
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
            if (app.mode === "fullscreen") {
              app.window();
            } else {
              app.fullscreen();
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
