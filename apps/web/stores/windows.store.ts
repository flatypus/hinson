import { create } from "zustand";
import type { WindowMode } from "@lib/types";
import { apps } from "./apps";

interface WindowState {
  windows: Window[];
  setActive: (name: string) => void;
  unfocusWindow: (name: string, mode: "minimized" | "closed") => void;
  refresh: () => void;
}

export class Window {
  name: string;
  icon: string;
  active: boolean;
  mode: WindowMode;
  component: JSX.Element;
  width = 0;
  height = 0;
  x = 0;
  y = 0;

  private defaultFps = 180;
  private defaultTime = 100;
  private refresh: () => void;

  constructor(
    name: string,
    icon: string,
    component: JSX.Element,
    refresh: () => void,
  ) {
    this.name = name;
    this.icon = icon;
    this.active = false;
    this.mode = "closed";
    this.component = component;
    this.refresh = refresh;
  }

  setMode(mode: WindowMode): void {
    this.mode = mode;
  }
  setActive(active: boolean): void {
    this.active = active;
  }

  private animate(target: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }): void {
    const fps = this.defaultFps;
    const time = this.defaultTime;
    const frames = fps * (time / 1000);
    const start = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };

    let frame = 0;
    const animateFrame = (): void => {
      const ease = (t: number): number => {
        return (-Math.cos(Math.PI * t) + 1) / 2;
      };

      if (target.x !== undefined) {
        this.x = start.x + (target.x - start.x) * ease(frame / frames);
      }

      if (target.y !== undefined) {
        this.y = start.y + (target.y - start.y) * ease(frame / frames);
      }

      if (target.width !== undefined) {
        this.width =
          start.width + (target.width - start.width) * ease(frame / frames);
      }

      if (target.height !== undefined) {
        this.height =
          start.height + (target.height - start.height) * ease(frame / frames);
      }

      this.refresh();
      frame++;
      if (frame < frames) {
        requestAnimationFrame(animateFrame);
      }
    };
    requestAnimationFrame(animateFrame);
  }

  setTransform(
    x: number,
    y: number,
    width: number,
    height: number,
    animate = true,
  ): void {
    if (width < 0 || height < 0) {
      throw new Error(
        "Invalid input: width and height should be positive numbers.",
      );
    }
    if (animate) {
      this.animate({ x, y, width, height });
    } else {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.refresh();
    }
  }
}

const useWindowsStore = create<WindowState>((set, get) => {
  const refresh = (): void => {
    const windows = get().windows;
    set({ windows });
  };
  return {
    windows: apps.map(
      (app) => new Window(app.name, app.icon, app.component, refresh),
    ),
    setActive: (name: string): void => {
      const windows = get().windows;
      const index = windows.findIndex((window) => window.name === name);
      if (index === -1) return;
      for (let i = 0; i < windows.length; i++) {
        windows[i].setActive(i === index);
      }
      set({ windows });
    },
    unfocusWindow: (name: string, mode: "closed" | "minimized"): void => {
      const windows = get().windows;
      const index = windows.findIndex((window) => window.name === name);
      if (index === -1) return;
      windows[index].setMode(mode);
      windows[index].setActive(false);
      // find all windows that are not closed and set the first one to active
      const activeWindows = windows.filter(
        (window) => window.mode !== "closed",
      );
      if (activeWindows.length > 0) {
        activeWindows[0].setActive(true);
      }
      set({ windows });
    },
    refresh,
  };
});

export default useWindowsStore;
