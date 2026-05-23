import { NavLink } from "react-router-dom";
import { useTheme } from "@/app/theme/useTheme";
import type { ThemeControlContent } from "@/types/theme";
import { ThemeModeControl } from "./ThemeModeControl";

type NavigationItem = {
  label: string;
  href: string;
};

type LogoSrc = {
  light: string;
  dark: string;
};

type HeaderProps = {
  logoText: string;
  logoSrc: LogoSrc;
  navigation: readonly NavigationItem[];
  themeControl: ThemeControlContent;
};

export function Header({ logoText, logoSrc, navigation, themeControl }: HeaderProps) {
  const { mode, resolvedTheme, setMode } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <NavLink to="/" className="flex items-center">
          <img
            src={resolvedTheme === "dark" ? logoSrc.dark : logoSrc.light}
            alt={logoText}
            className="h-8"
          />
        </NavLink>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    "relative text-sm font-medium transition hover:text-[var(--color-accent)]",
                    isActive
                      ? "text-[var(--color-accent)] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--color-accent)] after:content-[''] after:rounded-full"
                      : "text-[var(--color-muted-text)]",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <ThemeModeControl
            {...themeControl}
            mode={mode}
            resolvedTheme={resolvedTheme}
            onModeChange={setMode}
          />
        </div>
      </div>
    </header>
  );
}
