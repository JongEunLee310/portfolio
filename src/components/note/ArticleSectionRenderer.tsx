import { Card } from "@/components/common/Card";
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
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function ArticleSectionRenderer({
  section,
  metricsLabels,
}: ArticleSectionRendererProps) {
  if (section.type === "heading") {
    return (
      <h2
        id={section.id}
        className="scroll-mt-28 pt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
      >
        {section.title}
      </h2>
    );
  }

  if (section.type === "paragraph") {
    return (
      <p className="text-base leading-8 text-slate-600 md:text-[17px]">
        {section.content}
      </p>
    );
  }

  if (section.type === "list") {
    return (
      <ul className="space-y-3 text-base leading-8 text-slate-600 md:text-[17px]">
        {section.items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
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
        className={`rounded-2xl border p-5 text-sm leading-7 md:text-base ${calloutClassMap[section.variant]}`}
      >
        {section.content}
      </div>
    );
  }

  if (section.type === "metrics") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {section.items.map((item) => (
          <Card key={item.label} className="p-5">
            <h3 className="text-sm font-bold text-slate-900">{item.label}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">
                  {metricsLabels.before}
                </dt>
                <dd className="mt-1 text-slate-700">{item.before}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">
                  {metricsLabels.after}
                </dt>
                <dd className="mt-1 text-slate-900">{item.after}</dd>
              </div>
              <div className="rounded-xl bg-blue-50 px-3 py-2">
                <dt className="font-semibold text-blue-600">
                  {metricsLabels.change}
                </dt>
                <dd className="mt-1 font-bold text-blue-700">{item.change}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <img
        src={section.src}
        alt={section.alt}
        className="w-full bg-slate-100 object-cover"
      />
      {section.caption ? (
        <figcaption className="border-t border-slate-200 px-5 py-3 text-sm leading-6 text-slate-500">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
