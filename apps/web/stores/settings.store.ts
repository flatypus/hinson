import { create } from "zustand";

interface SettingsState {
  themeColor: string;
}

const useSettingsStore = create<SettingsState>(() => {
  return {
    themeColor: "#ff59c3",
  };
});

export default useSettingsStore;
