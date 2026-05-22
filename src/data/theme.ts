import type { ThemeControlContent } from "@/types/theme";

export const themeControlContent = {
  label: "테마",
  menuLabel: "테마 선택",
  currentPrefix: "현재 테마",
  options: [
    { label: "자동", value: "auto" },
    { label: "라이트", value: "light" },
    { label: "다크", value: "dark" },
    { label: "시스템", value: "system" },
  ],
} as const satisfies ThemeControlContent;
