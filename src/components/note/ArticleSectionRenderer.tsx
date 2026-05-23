import { CheckCircle2 } from "lucide-react";
import { CodeBlock } from "@/components/note/CodeBlock";
import type { ArticleSection } from "@/types/note";

type ArticleSectionRendererProps = {
  section: ArticleSection;
  metricsLabels: {
    before: string;
    after: string;
    change: string;
  };
};

const calloutClassMap: Record<
  Extract<ArticleSection, { type: "callout" }>["variant"],
  string
> = {
  info: "border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-page-text)]",
  warning: "border-amber-400/30 bg-amber-500/10 text-[var(--color-page-text)]",
  success: "border-emerald-400/30 bg-emerald-500/10 text-[var(--color-page-text)]",
};

export function ArticleSectionRenderer({
  section,
  metricsLabels,
}: ArticleSectionRendererProps) {
  if (section.type === "heading") {
    return (
      <h2
        id={section.id}
        className="scroll-mt-28 pt-6 text-2xl font-bold tracking-tight text-[var(--color-page-text)] md:text-3xl"
      >
        {section.title}
      </h2>
    );
  }

  if (section.type === "paragraph") {
    return (
      <p className="text-base leading-8 text-[var(--color-muted-text)] md:text-[17px]">
        {section.content}
      </p>
    );
  }

  if (section.type === "list") {
    return (
      <ul className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-base leading-8 text-[var(--color-muted-text)] shadow-card md:text-[17px]">
        {section.items.map((item) => (
          <li key={item} className="flex gap-3">
            <CheckCircle2 className="mt-2 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (section.type === "cards") {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {section.items.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-[var(--color-page-text)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted-text)]">
              {item.description}
            </p>
            {item.badge ? (
              <span className="mt-4 inline-flex rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-[var(--color-accent)]">
                {item.badge}
              </span>
            ) : null}
          </article>
        ))}
      </div>
    );
  }

  if (section.type === "code") {
    return (
      <CodeBlock
        code={section.code}
        language={section.language}
        filename={section.filename}
      />
    );
  }

  if (section.type === "callout") {
    return (
      <div
        className={`rounded-lg border px-5 py-4 text-sm leading-7 md:text-base ${calloutClassMap[section.variant]}`}
      >
        {section.content}
      </div>
    );
  }

  if (section.type === "metrics") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {section.items.map((item) => (
          <article
            key={item.label}
            className="rounded-lg border border-slate-800 bg-slate-950 p-5 text-white shadow-card"
          >
            <h3 className="text-sm font-bold text-slate-200">{item.label}</h3>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-white/5 p-3">
                <dt className="font-semibold text-slate-400">
                  {metricsLabels.before}
                </dt>
                <dd className="mt-2 font-bold text-slate-200">{item.before}</dd>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <dt className="font-semibold text-blue-200">
                  {metricsLabels.after}
                </dt>
                <dd className="mt-2 font-bold text-blue-100">{item.after}</dd>
              </div>
              <div className="col-span-2 rounded-lg bg-blue-600/20 px-3 py-2">
                <dt className="font-semibold text-blue-200">
                  {metricsLabels.change}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-blue-300">
                  {item.change}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    );
  }

  if (section.type === "comparison") {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {section.items.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card"
          >
            <h3 className="text-base font-bold text-[var(--color-page-text)]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted-text)]">
              {item.description}
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--color-muted-text)]">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            {item.code ? (
              <div className="mt-5">
                <CodeBlock
                  code={item.code.code}
                  language={item.code.language}
                  filename={item.code.filename}
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card">
      <img
        src={section.src}
        alt={section.alt}
        className="w-full bg-[var(--color-surface-muted)] object-cover"
      />
      {section.caption ? (
        <figcaption className="border-t border-[var(--color-border)] px-5 py-3 text-sm leading-6 text-[var(--color-muted-text)]">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
