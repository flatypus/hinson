import { create } from "zustand";

interface FinderState {
  visitedHistory: string[][];
  setVisitedHistory: (visitedHistory: string[][]) => void;
  fileStructureState: number;
  setFileStructureState: (fileStructureState: number) => void;
  goToDirectory: (path: string[]) => void;
  goBack: () => void;
  goForward: () => void;
}

const useFinderStore = create<FinderState>((set, get) => {
  return {
    visitedHistory: [["hinson", "Welcome"]],
    setVisitedHistory: (visitedHistory) => {
      set({ visitedHistory });
    },
    fileStructureState: 0,
    setFileStructureState: (fileStructureState) => {
      set({ fileStructureState });
    },
    goToDirectory(path: string[]) {
      const visitedHistory = get().visitedHistory;
      if (visitedHistory[visitedHistory.length - 1] === path) return;
      set({
        visitedHistory: [...visitedHistory, path],
        fileStructureState: visitedHistory.length,
      });
    },
    goBack() {
      const { fileStructureState } = get();
      if (fileStructureState === 0) return;
      set({ fileStructureState: fileStructureState - 1 });
    },
    goForward() {
      const { fileStructureState, visitedHistory } = get();
      if (fileStructureState === visitedHistory.length - 1) return;
      set({ fileStructureState: fileStructureState + 1 });
    },
  };
});

export default useFinderStore;
