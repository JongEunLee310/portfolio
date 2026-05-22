import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  dark?: boolean;
  className?: string;
};

export function Card({ children, dark = false, className = "" }: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl transition duration-300",
        dark
          ? "border border-white/10 bg-white/[0.04] text-white shadow-glow"
          : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-page-text)] shadow-card hover:shadow-card-hover",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
