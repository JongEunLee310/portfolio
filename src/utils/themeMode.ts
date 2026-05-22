import type { ResolvedTheme, ThemeMode } from "@/types/theme";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const themeModes = new Set<ThemeMode>(["auto", "light", "dark", "system"]);

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && themeModes.has(value as ThemeMode);
}

export function readStoredThemeMode(
  storage: StorageLike,
  storageKey: string,
  fallback: ThemeMode,
) {
  const storedValue = storage.getItem(storageKey);

  return isThemeMode(storedValue) ? storedValue : fallback;
}

export function writeStoredThemeMode(
  storage: StorageLike,
  storageKey: string,
  mode: ThemeMode,
) {
  storage.setItem(storageKey, mode);
}

export function resolveSystemTheme(prefersDark: boolean): ResolvedTheme {
  return prefersDark ? "dark" : "light";
}

export function resolveThemeMode({
  mode,
  autoTheme,
  systemTheme,
}: {
  mode: ThemeMode;
  autoTheme: ResolvedTheme | null;
  systemTheme: ResolvedTheme;
}): ResolvedTheme {
  if (mode === "light" || mode === "dark") {
    return mode;
  }

  if (mode === "system") {
    return systemTheme;
  }

  return autoTheme ?? systemTheme;
}
