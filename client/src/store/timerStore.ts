import { create } from "zustand";
import { TimeEntry } from "../types";

interface TimerStore {
  activeEntry: TimeEntry | null;
  elapsedSeconds: number;
  lastStoppedDuration: number;
  setActiveEntry: (entry: TimeEntry | null) => void;
  incrementElapsed: () => void;
  resetElapsed: () => void;
  preserveDuration: () => void;
  clearPreservedDuration: () => void; // NEW
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  activeEntry: null,
  elapsedSeconds: 0,
  lastStoppedDuration: 0,
  
  setActiveEntry: (entry) => {
    if (entry) {
      const elapsed = Math.floor(
        (Date.now() - new Date(entry.startTime).getTime()) / 1000
      );
      set({ activeEntry: entry, elapsedSeconds: elapsed });
    } else {
      set({ activeEntry: null, elapsedSeconds: 0 });
    }
  },
  
  incrementElapsed: () => 
    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),
  
  resetElapsed: () => 
    set({ elapsedSeconds: 0 }),
    
  preserveDuration: () => {
    const current = get().elapsedSeconds;
    set({ lastStoppedDuration: current });
  },
  
  clearPreservedDuration: () => 
    set({ lastStoppedDuration: 0 }),
}));
