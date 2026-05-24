import type { ReactNode } from "react";
import { ButtonLink } from "@/components/common/ButtonLink";
import { heroSurface } from "@/styles/classNames";

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
  imageAspect?: string;
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
  imageAspect = "4/3",
}: PageHeroProps) {
  const titleParts = highlightedText ? title.split(highlightedText) : [title];
  const isLight = variant === "light";
  const visualSource =
    typeof visual === "string" ? visual : visual?.[variant];

  return (
    <section
      className={[
        "relative overflow-hidden transition-colors duration-300",
        isLight ? heroSurface.lightBanner : heroSurface.darkBanner,
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(201,151,43,0.15)_1px,transparent_0)] bg-[length:32px_32px]",
          isLight ? "opacity-20" : "opacity-30",
        ].join(" ")}
      />
      <div
        className={[
          "absolute right-0 top-0 h-full w-2/3",
          isLight ? heroSurface.lightGlow : heroSurface.darkGlow,
          isLight ? "opacity-70" : "opacity-100",
        ].join(" ")}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="min-w-0">
          <p
            className={[
              "mb-4 text-sm font-semibold",
              isLight ? "text-[var(--color-accent-dark)]" : "text-blue-400",
            ].join(" ")}
          >
            {eyebrow}
          </p>
          <h1 className="whitespace-pre-line break-words text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {highlightedText && titleParts.length > 1 ? (
              <>
                {titleParts[0]}
                <span className={isLight ? "text-[var(--color-accent)]" : "text-blue-500"}>{highlightedText}</span>
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
                <ButtonLink href={primaryAction.href}>
                  {primaryAction.label}
                </ButtonLink>
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
            style={{ aspectRatio: imageAspect }}
            className={[
              "hidden w-full rounded-2xl object-cover lg:block",
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
