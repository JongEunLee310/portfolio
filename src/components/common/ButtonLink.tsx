import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonLinkVariant = "primary" | "outline" | "darkOutline";

const variants: Record<ButtonLinkVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white shadow-card transition hover:bg-[var(--color-accent-hover)]",
  outline:
    "border border-slate-300 bg-white text-slate-900 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
  darkOutline:
    "border border-white/20 bg-white/5 text-white transition hover:border-blue-400 hover:bg-blue-500/10",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonLinkVariant;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link
      to={href}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}
