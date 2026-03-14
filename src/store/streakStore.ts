import { create } from "zustand";
import type { StreakData } from "@/types";

interface StreakState {
  streakData: StreakData | null;
  setStreak: (data: StreakData) => void;
  reset: () => void;
}

export const useStreakStore = create<StreakState>()((set) => ({
  streakData: null,

  setStreak: (data) => set({ streakData: data }),

  reset: () => set({ streakData: null }),
}));
