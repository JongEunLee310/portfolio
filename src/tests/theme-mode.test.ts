import { describe, expect, it } from "vitest";
import { THEME_LOCATION } from "@/constants/theme";
import {
  getNextThemeTransition,
  getSunSchedule,
  resolveAutoTheme,
} from "@/utils/sunSchedule";
import {
  isThemeMode,
  readStoredThemeMode,
  resolveSystemTheme,
  resolveThemeMode,
  type StorageLike,
} from "@/utils/themeMode";

function createStorage(value: string | null): StorageLike {
  return {
    getItem: () => value,
    setItem: () => undefined,
  };
}

describe("themeMode", () => {
  it("validates supported theme modes", () => {
    expect(isThemeMode("auto")).toBe(true);
    expect(isThemeMode("light")).toBe(true);
    expect(isThemeMode("dark")).toBe(true);
    expect(isThemeMode("system")).toBe(true);
    expect(isThemeMode("sepia")).toBe(false);
  });

  it("falls back when storage contains an invalid mode", () => {
    expect(readStoredThemeMode(createStorage("sepia"), "theme", "auto")).toBe(
      "auto",
    );
  });

  it("resolves explicit light and dark modes", () => {
    expect(
      resolveThemeMode({
        mode: "light",
        autoTheme: "dark",
        systemTheme: "dark",
      }),
    ).toBe("light");

    expect(
      resolveThemeMode({
        mode: "dark",
        autoTheme: "light",
        systemTheme: "light",
      }),
    ).toBe("dark");
  });

  it("resolves system mode from the media query result", () => {
    expect(resolveSystemTheme(true)).toBe("dark");
    expect(resolveSystemTheme(false)).toBe("light");
    expect(
      resolveThemeMode({
        mode: "system",
        autoTheme: "dark",
        systemTheme: "light",
      }),
    ).toBe("light");
  });

  it("falls back to system when auto calculation is unavailable", () => {
    expect(
      resolveThemeMode({
        mode: "auto",
        autoTheme: null,
        systemTheme: "dark",
      }),
    ).toBe("dark");
  });
});
describe("sunSchedule", () => {
  it("resolves light between Seoul sunrise and sunset", () => {
    const schedule = {
      sunrise: new Date("2026-05-22T05:16:00+09:00"),
      sunset: new Date("2026-05-22T19:41:00+09:00"),
    };

    expect(resolveAutoTheme(new Date("2026-05-22T12:00:00+09:00"), schedule)).toBe(
      "light",
    );
  });

  it("resolves dark after Seoul sunset", () => {
    const schedule = {
      sunrise: new Date("2026-05-22T05:16:00+09:00"),
      sunset: new Date("2026-05-22T19:41:00+09:00"),
    };

    expect(resolveAutoTheme(new Date("2026-05-22T22:00:00+09:00"), schedule)).toBe(
      "dark",
    );
  });

  it("calculates a valid Seoul sun schedule with suncalc", () => {
    const schedule = getSunSchedule(
      new Date("2026-05-22T12:00:00+09:00"),
      THEME_LOCATION,
    );

    expect(schedule?.sunrise).toBeInstanceOf(Date);
    expect(schedule?.sunset).toBeInstanceOf(Date);
    expect(schedule?.sunrise.getTime()).toBeLessThan(
      schedule?.sunset.getTime() ?? 0,
    );
  });

  it("returns the next transition from the current schedule", () => {
    const schedule = {
      sunrise: new Date("2026-05-22T05:16:00+09:00"),
      sunset: new Date("2026-05-22T19:41:00+09:00"),
    };

    expect(
      getNextThemeTransition(
        new Date("2026-05-22T12:00:00+09:00"),
        schedule,
        THEME_LOCATION,
      ),
    ).toEqual(schedule.sunset);
  });
});
