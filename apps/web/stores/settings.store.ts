import { create } from "zustand";

interface SettingsState {
  themeColor: string;
  isTouchDevice: boolean;
  setIsTouchDevice: (isTouchDevice: boolean) => void;
}

const useSettingsStore = create<SettingsState>((set) => {
  return {
    themeColor: "#ff59c3",
    isTouchDevice: false,
    setIsTouchDevice: (isTouchDevice) => {
      set({ isTouchDevice });
    },
  };
});

export default useSettingsStore;
