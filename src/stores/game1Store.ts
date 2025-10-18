import { create } from 'zustand';

export type Game1State = {
  secondesX: number | null;
  secondesY: number | null;
  setX: (n: number) => void;
  setY: (n: number) => void;
  reset: () => void;
};

export const useGame1Store = create<Game1State>((set) => ({
  secondesX: null,
  secondesY: null,
  setX: (n: number) => set({ secondesX: n }),
  setY: (n: number) => set({ secondesY: n }),
  reset: () => set({ secondesX: null, secondesY: null }),
}));