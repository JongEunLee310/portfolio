import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  dark?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={[
            "mt-2 text-3xl font-bold tracking-tight",
            dark ? "text-white" : "text-[var(--color-page-text)]",
          ].join(" ")}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={[
              "mt-3 max-w-2xl text-sm leading-6",
              dark ? "text-slate-300" : "text-[var(--color-muted-text)]",
            ].join(" ")}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
