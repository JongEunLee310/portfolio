import type { ReactNode } from "react";

type BadgeVariant = "primary" | "light" | "dark" | "success" | "warning";

const badgeVariants: Record<BadgeVariant, string> = {
  primary: "badge-primary",
  light: "badge-light",
  dark: "badge-dark",
  success: "badge-success",
  warning: "badge-warning",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

export function Badge({ children, variant = "light" }: BadgeProps) {
  return (
    <span
      className={`badge inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${badgeVariants[variant]}`}
    >
      {children}
    </span>
  );
}
