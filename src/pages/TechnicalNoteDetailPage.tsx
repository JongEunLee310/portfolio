import { useParams } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLayout } from "@/components/layout/PageLayout";
import { ArticleToc } from "@/components/note/ArticleToc";
import { CodeBlock } from "@/components/note/CodeBlock";
import { noteDetails } from "@/data/noteDetails";
import { pageChrome } from "./pageChrome";

export function TechnicalNoteDetailPage() {
  const { noteSlug } = useParams();
  const note = noteDetails.find((item) => item.slug === noteSlug);

  if (!note) {
    return (
      <PageLayout {...pageChrome}>
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <EmptyState
              title="기술 노트를 찾을 수 없습니다"
              description="요청한 기술 노트 slug와 연결된 상세 데이터가 없습니다."
            />
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout {...pageChrome}>
      <section className="bg-hero-radial py-20 text-white lg:py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Badge variant="dark">{note.category}</Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            {note.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">{note.summary}</p>
          <div className="mt-5 flex gap-4 text-sm text-slate-400">
            <span>{note.date}</span>
            <span>{note.readingTime}</span>
          </div>
        </div>
      </section>
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[260px_1fr] lg:px-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ArticleToc items={note.toc} />
          </aside>
          <article className="max-w-3xl space-y-6">
            {note.content.map((section, index) => {
              if (section.type === "heading") {
                return (
                  <h2
                    key={section.id}
                    id={section.id}
                    className="pt-4 text-2xl font-bold text-slate-900"
                  >
                    {section.title}
                  </h2>
                );
              }

              if (section.type === "paragraph") {
                return (
                  <p key={index} className="text-sm leading-7 text-slate-600">
                    {section.content}
                  </p>
                );
              }

              if (section.type === "list") {
                return (
                  <ul key={index} className="space-y-3 text-sm leading-7 text-slate-600">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              if (section.type === "code") {
                return (
                  <CodeBlock
                    key={index}
                    code={section.code}
                    language={section.language}
                    filename={section.filename}
                  />
                );
              }

              if (section.type === "callout") {
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800"
                  >
                    {section.content}
                  </div>
                );
              }

              return null;
            })}
          </article>
        </div>
      </section>
    </PageLayout>
  );
}
