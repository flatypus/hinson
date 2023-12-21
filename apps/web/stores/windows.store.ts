import { create } from "zustand";
import { apps } from "../components/shared/apps";
import { Window } from "../lib/classes/window";

type GetWindowSize = () => { width: number; height: number };

interface WindowState {
  windows: Window[];
  refreshWindows: () => void;
  addWindow: (window: Pick<Window, "name" | "icon" | "component">) => void;
  getWindowSize: GetWindowSize;
  setGetWindowSize: (getWindowSize: GetWindowSize) => void;
}

const useWindowsStore = create<WindowState>((set, get) => {
  const refreshWindows = (): void => {
    const windows = get().windows;
    set({ windows });
  };

  const getWindows = (): Window[] => {
    return get().windows;
  };

  const addWindow = ({
    name,
    icon,
    component,
  }: Pick<Window, "name" | "icon" | "component">): void => {
    const { windows, getWindowSize } = get();

    const findExisting = windows.find((window) => window.name === name);
    if (findExisting) {
      findExisting.fullscreen();
      return;
    }

    const window = new Window({
      name,
      icon,
      component,
      getWindows,
      refreshWindows,
    });
    window.injectGetSize(getWindowSize);
    window.hide(false);
    windows.push(window);
    set({ windows });
    window.fullscreen();
  };

  return {
    windows: apps.map(
      (app) =>
        new Window({
          name: app.name,
          icon: app.icon,
          component: app.component,
          getWindows,
          refreshWindows,
          docked: true,
        }),
    ),
    getWindows,
    refreshWindows,
    addWindow,
    getWindowSize: (): { width: number; height: number } => {
      return { width: 0, height: 0 };
    },
    setGetWindowSize: (
      getWindowSize: () => { width: number; height: number },
    ) => {
      set({ getWindowSize });
    },
  };
});

export default useWindowsStore;
