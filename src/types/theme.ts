export type ThemeMode = "auto" | "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

export type ThemeLocation = {
  label: string;
  latitude: number;
  longitude: number;
  timeZone: "Asia/Seoul";
};

export type ThemeState = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
};

export type ThemeControlOption = {
  label: string;
  value: ThemeMode;
};

export type ThemeControlContent = {
  label: string;
  menuLabel: string;
  currentPrefix: string;
  options: readonly ThemeControlOption[];
};
