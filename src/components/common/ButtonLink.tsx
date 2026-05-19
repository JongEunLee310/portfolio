import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonLinkVariant = "primary" | "outline" | "darkOutline";

const variants: Record<ButtonLinkVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-blue-soft transition hover:bg-blue-500",
  outline:
    "border border-slate-300 bg-white text-slate-900 transition hover:border-blue-500 hover:text-blue-600",
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
