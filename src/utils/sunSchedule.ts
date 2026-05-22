import SunCalc from "suncalc";
import type { ResolvedTheme, ThemeLocation } from "@/types/theme";

export type SunSchedule = {
  sunrise: Date;
  sunset: Date;
};

const seoulUtcOffset = "+09:00";

function formatDateInTimeZone(date: Date, timeZone: ThemeLocation["timeZone"]) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getNoonForZonedDate(date: Date, location: ThemeLocation) {
  const zonedDate = formatDateInTimeZone(date, location.timeZone);

  return new Date(`${zonedDate}T12:00:00${seoulUtcOffset}`);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function isValidDate(date: Date) {
  return Number.isFinite(date.getTime());
}

export function getSunSchedule(date: Date, location: ThemeLocation): SunSchedule | null {
  const calculationDate = getNoonForZonedDate(date, location);
  const times = SunCalc.getTimes(
    calculationDate,
    location.latitude,
    location.longitude,
  );

  if (!isValidDate(times.sunrise) || !isValidDate(times.sunset)) {
    return null;
  }

  return {
    sunrise: times.sunrise,
    sunset: times.sunset,
  };
}

export function resolveAutoTheme(
  now: Date,
  schedule: SunSchedule | null,
): ResolvedTheme | null {
  if (!schedule) {
    return null;
  }

  return now >= schedule.sunrise && now < schedule.sunset ? "light" : "dark";
}

export function getNextThemeTransition(
  now: Date,
  schedule: SunSchedule | null,
  location: ThemeLocation,
) {
  if (!schedule) {
    return null;
  }

  if (now < schedule.sunrise) {
    return schedule.sunrise;
  }

  if (now < schedule.sunset) {
    return schedule.sunset;
  }

  const nextSchedule = getSunSchedule(addDays(now, 1), location);

  return nextSchedule?.sunrise ?? null;
}
