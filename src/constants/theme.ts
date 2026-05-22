import type { ThemeLocation, ThemeMode } from "@/types/theme";

export const DEFAULT_THEME_MODE: ThemeMode = "auto";

export const THEME_STORAGE_KEY = "portfolio-theme-mode";

export const THEME_LOCATION: ThemeLocation = {
  label: "Seoul",
  latitude: 37.5665,
  longitude: 126.978,
  timeZone: "Asia/Seoul",
};

export const theme = {
  container: "mx-auto w-full max-w-7xl px-6 lg:px-8",
  darkSurface: "bg-brand-dark text-white",
  lightSurface: "bg-slate-50 text-slate-900",
} as const;
