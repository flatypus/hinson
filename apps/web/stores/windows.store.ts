import { create } from "zustand";
import type { WindowMode } from "@lib/types";
import { apps } from "./apps";

interface WindowState {
  windows: Window[];
  setActive: (name: string) => void;
  unfocusWindow: (name: string, mode: "minimized" | "closed") => void;
}

export class Window {
  name: string;
  icon: string;
  active: boolean;
  mode: WindowMode;
  component: JSX.Element;
  constructor(name: string, icon: string, component: JSX.Element) {
    this.name = name;
    this.icon = icon;
    this.active = false;
    this.mode = "closed";
    this.component = component;
  }
  setMode(mode: WindowMode): void {
    this.mode = mode;
  }
  setActive(active: boolean): void {
    this.active = active;
  }
}

const useWindowsStore = create<WindowState>((set, get) => ({
  windows: apps.map((app) => new Window(app.name, app.icon, app.component)),
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
    const activeWindows = windows.filter((window) => window.mode !== "closed");
    if (activeWindows.length > 0) {
      activeWindows[0].setActive(true);
    }
    set({ windows });
  },
}));

export default useWindowsStore;
