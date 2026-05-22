import type { ReactNode } from "react";
import { ButtonLink } from "@/components/common/ButtonLink";

type HeroAction = {
  label: string;
  href: string;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlightedText?: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  visual?: string;
  visualSlot?: ReactNode;
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
}: PageHeroProps) {
  const titleParts = highlightedText ? title.split(highlightedText) : [title];

  return (
    <section className="relative overflow-hidden bg-hero-radial text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.22)_1px,transparent_0)] bg-[length:32px_32px] opacity-30" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="min-w-0">
          <p className="mb-4 text-sm font-semibold text-blue-400">{eyebrow}</p>
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
          <p className="mt-6 max-w-xl break-words text-base leading-8 text-slate-300">
            {description}
          </p>
          {primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAction ? (
                <ButtonLink href={primaryAction.href}>{primaryAction.label}</ButtonLink>
              ) : null}
              {secondaryAction ? (
                <ButtonLink href={secondaryAction.href} variant="darkOutline">
                  {secondaryAction.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>
        {visualSlot ? (
          visualSlot
        ) : visual ? (
          <img
            src={visual}
            alt=""
            className="hidden aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover shadow-glow lg:block"
          />
        ) : null}
      </div>
    </section>
  );
}
