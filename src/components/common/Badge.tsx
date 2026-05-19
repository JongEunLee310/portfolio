import type { ReactNode } from "react";

type BadgeVariant = "primary" | "light" | "dark" | "success" | "warning";

const badgeVariants: Record<BadgeVariant, string> = {
  primary: "bg-blue-600 text-white",
  light: "bg-blue-50 text-blue-700",
  dark: "border border-white/10 bg-white/10 text-blue-300",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

export function Badge({ children, variant = "light" }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${badgeVariants[variant]}`}
    >
      {children}
    </span>
  );
}
