"use client";

import { create } from "zustand";

interface ThemeStore {
  dark: boolean;
  toggle: () => void;
  init: () => void;
}

export const useTheme = create<ThemeStore>((set, get) => ({
  dark: false,

  toggle: () => {
    const next = !get().dark;
    set({ dark: next });
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  },

  init: () => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    set({ dark: isDark });
    if (isDark) document.documentElement.classList.add("dark");
  },
}));
