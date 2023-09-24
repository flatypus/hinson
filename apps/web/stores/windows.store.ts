import { create } from "zustand";
import { apps } from "./apps";
import { Window } from "./window";

interface WindowState {
  windows: Window[];
}

const useWindowsStore = create<WindowState>((set, get) => {
  const refreshWindows = (): void => {
    const windows = get().windows;
    set({ windows });
  };

  const getWindows = (): Window[] => {
    return get().windows;
  };

  return {
    windows: apps.map(
      (app) =>
        new Window(
          app.name,
          app.icon,
          app.component,
          getWindows,
          refreshWindows,
        ),
    ),
    refreshWindows,
  };
});

export default useWindowsStore;
