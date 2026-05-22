import { Monitor, Moon, Sun, SunMoon } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import type {
  ResolvedTheme,
  ThemeControlOption,
  ThemeMode,
} from "@/types/theme";

type ThemeModeControlProps = {
  label: string;
  menuLabel: string;
  currentPrefix: string;
  options: readonly ThemeControlOption[];
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onModeChange: (mode: ThemeMode) => void;
};

const modeIcons: Record<ThemeMode, ComponentType<{ className?: string }>> = {
  auto: SunMoon,
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export function ThemeModeControl({
  label,
  menuLabel,
  currentPrefix,
  options,
  mode,
  resolvedTheme,
  onModeChange,
}: ThemeModeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const TriggerIcon = modeIcons[mode];
  const currentOption = options.find((option) => option.value === mode);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`${label}: ${currentOption?.label ?? mode}`}
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-page-text)] transition hover:border-blue-300/70 hover:bg-blue-500/10 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        <TriggerIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {isOpen ? (
        <div
          role="menu"
          aria-label={menuLabel}
          className="absolute right-0 top-12 z-50 w-44 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 text-sm text-[var(--color-page-text)] shadow-card"
        >
          <p className="px-3 pb-1 pt-2 text-xs font-semibold text-[var(--color-muted-text)]">
            {currentPrefix}: {resolvedTheme}
          </p>
          {options.map((option) => {
            const Icon = modeIcons[option.value];
            const isSelected = option.value === mode;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                aria-current={isSelected ? "true" : undefined}
                onClick={() => {
                  onModeChange(option.value);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className={[
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
                  isSelected
                    ? "bg-blue-500/15 text-blue-200"
                    : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-page-text)]",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
