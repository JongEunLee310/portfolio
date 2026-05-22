import type { ReactNode } from "react";
import { ButtonLink } from "@/components/common/ButtonLink";

type HeroAction = {
  label: string;
  href: string;
};

type HeroVisual =
  | string
  | {
      light: string;
      dark: string;
    };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlightedText?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  visual?: HeroVisual;
  visualSlot?: ReactNode;
  variant?: "dark" | "light";
};

export function PageHero({
  eyebrow,
  title,
  description,
  highlightedText,
  primaryAction,
  secondaryAction,
  visual,
  visualSlot,
  variant = "dark",
}: PageHeroProps) {
  const titleParts = highlightedText ? title.split(highlightedText) : [title];
  const isLight = variant === "light";
  const visualSource =
    typeof visual === "string" ? visual : visual?.[variant];

  return (
    <section
      className={[
        "relative overflow-hidden transition-colors duration-300",
        isLight
          ? "border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] text-slate-950"
          : "bg-hero-radial text-white",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.22)_1px,transparent_0)] bg-[length:32px_32px]",
          isLight ? "opacity-20" : "opacity-30",
        ].join(" ")}
      />
      {isLight ? (
        <div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_70%_28%,rgba(37,99,235,0.18),transparent_42%)]" />
      ) : null}
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="min-w-0">
          <p
            className={[
              "mb-4 text-sm font-semibold",
              isLight ? "text-blue-700" : "text-blue-400",
            ].join(" ")}
          >
            {eyebrow}
          </p>
          <h1 className="whitespace-pre-line break-words text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {highlightedText && titleParts.length > 1 ? (
              <>
                {titleParts[0]}
                <span className="text-blue-500">{highlightedText}</span>
                {titleParts.slice(1).join(highlightedText)}
              </>
            ) : (
              title
            )}
          </h1>
          <p
            className={[
              "mt-6 max-w-xl break-words text-base leading-8",
              isLight ? "text-slate-700" : "text-slate-300",
            ].join(" ")}
          >
            {description}
          </p>
          {primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAction ? (
                <ButtonLink href={primaryAction.href}>{primaryAction.label}</ButtonLink>
              ) : null}
              {secondaryAction ? (
                <ButtonLink
                  href={secondaryAction.href}
                  variant={isLight ? "outline" : "darkOutline"}
                >
                  {secondaryAction.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>
        {visualSlot ? (
          visualSlot
        ) : visualSource ? (
          <img
            src={visualSource}
            alt=""
            className={[
              "hidden aspect-[4/3] w-full rounded-2xl object-cover lg:block",
              isLight
                ? "border border-slate-200 shadow-card"
                : "border border-white/10 shadow-glow",
            ].join(" ")}
          />
        ) : null}
      </div>
    </section>
  );
}
