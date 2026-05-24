import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME_MODE,
  THEME_LOCATION,
  THEME_STORAGE_KEY,
} from "@/constants/theme";
import type { ResolvedTheme, ThemeMode } from "@/types/theme";
import {
  getNextThemeTransition,
  getSunSchedule,
  resolveAutoTheme,
} from "@/utils/sunSchedule";
import {
  readStoredThemeMode,
  resolveSystemTheme,
  resolveThemeMode,
  writeStoredThemeMode,
} from "@/utils/themeMode";

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialMode() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_MODE;
  }

  return readStoredThemeMode(
    window.localStorage,
    THEME_STORAGE_KEY,
    DEFAULT_THEME_MODE,
  );
}

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  return resolveSystemTheme(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
}

function getAutoTheme(now = new Date()) {
  return resolveAutoTheme(now, getSunSchedule(now, THEME_LOCATION));
}

function applyDocumentTheme(resolvedTheme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
}

function applyDocumentFavicon(resolvedTheme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const favicon = document.querySelector<HTMLLinkElement>("#theme-favicon");

  if (!favicon) {
    return;
  }

  favicon.href = `${import.meta.env.BASE_URL}favicon-${resolvedTheme}.png`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);
  const [autoTheme, setAutoTheme] = useState<ResolvedTheme | null>(() =>
    getAutoTheme(),
  );

  const resolvedTheme = resolveThemeMode({
    mode,
    autoTheme,
    systemTheme,
  });

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);

    if (typeof window !== "undefined") {
      writeStoredThemeMode(window.localStorage, THEME_STORAGE_KEY, nextMode);
    }
  }, []);

  useEffect(() => {
    applyDocumentTheme(resolvedTheme);
    applyDocumentFavicon(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(resolveSystemTheme(event.matches));
    };

    if (query.addEventListener) {
      query.addEventListener("change", handleChange);

      return () => query.removeEventListener("change", handleChange);
    }

    query.addListener(handleChange);

    return () => query.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (mode !== "auto") {
      return undefined;
    }

    const now = new Date();
    const schedule = getSunSchedule(now, THEME_LOCATION);
    setAutoTheme(resolveAutoTheme(now, schedule));

    const nextTransition = getNextThemeTransition(now, schedule, THEME_LOCATION);

    if (!nextTransition) {
      return undefined;
    }

    const delay = Math.max(0, nextTransition.getTime() - now.getTime() + 1000);
    const timerId = window.setTimeout(() => {
      setAutoTheme(getAutoTheme());
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [mode, autoTheme]);

  const contextValue = useMemo(
    () => ({ mode, resolvedTheme, setMode }),
    [mode, resolvedTheme, setMode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
