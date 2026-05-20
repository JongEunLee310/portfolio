import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { TechTag } from "@/components/common/TechTag";
import { PageLayout } from "@/components/layout/PageLayout";
import { ArticleSectionRenderer } from "@/components/note/ArticleSectionRenderer";
import { ArticleToc } from "@/components/note/ArticleToc";
import { PATHS } from "@/constants/paths";
import { NOTE_DETAIL_LABELS } from "@/constants/noteDetail";
import { noteDetails } from "@/data/noteDetails";
import { projects } from "@/data/projects";
import { technicalNotes } from "@/data/technicalNotes";
import { pageChrome } from "@/utils/pageChrome";

export function TechnicalNoteDetailPage() {
  const { noteSlug } = useParams();
  const note = noteDetails.find((item) => item.slug === noteSlug);

  if (!note) {
    return (
      <PageLayout {...pageChrome}>
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <EmptyState
              title={NOTE_DETAIL_LABELS.emptyState.title}
              description={NOTE_DETAIL_LABELS.emptyState.description}
            />
          </div>
        </section>
      </PageLayout>
    );
  }

  const relatedProjects = projects.filter((project) =>
    note.relatedProjectSlugs?.includes(project.slug),
  );
  const relatedNotes = technicalNotes.filter((item) =>
    note.relatedNoteSlugs.includes(item.slug),
  );

  return (
    <PageLayout {...pageChrome}>
      <section className="bg-hero-radial py-20 text-white lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <Badge variant="dark">{note.category}</Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            {note.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            {note.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
            <span>{note.date}</span>
            <span>{note.readingTime}</span>
          </div>
          {note.tags.length > 0 ? (
            <div className="mt-7">
              <p className="sr-only">{NOTE_DETAIL_LABELS.hero.tags}</p>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <TechTag key={`${note.slug}-${tag.name}`} tag={tag} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ArticleToc
              items={note.toc}
              title={NOTE_DETAIL_LABELS.toc.title}
            />
          </aside>
          <div className="min-w-0">
            <article className="max-w-3xl space-y-7">
              <Card className="p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  {NOTE_DETAIL_LABELS.sections.summary}
                </p>
                <p className="mt-3 text-base leading-8 text-slate-700 md:text-[17px]">
                  {note.summary}
                </p>
              </Card>
              {note.content.map((section, index) => (
                <ArticleSectionRenderer
                  key={`${section.type}-${index}`}
                  section={section}
                  metricsLabels={NOTE_DETAIL_LABELS.metrics}
                />
              ))}
            </article>
            {relatedProjects.length > 0 ? (
              <section className="mt-14 max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-900">
                  {NOTE_DETAIL_LABELS.sections.relatedProjects}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {relatedProjects.map((project) => (
                    <Card key={project.slug} className="p-5">
                      <p className="text-xs font-semibold text-blue-600">
                        {project.period}
                      </p>
                      <h3 className="mt-2 font-bold text-slate-900">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {project.summary}
                      </p>
                      <Link
                        to={PATHS.projectDetail(project.slug)}
                        className="mt-4 inline-flex text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        {NOTE_DETAIL_LABELS.links.projectDetail}
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}
            {relatedNotes.length > 0 ? (
              <section className="mt-14 max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-900">
                  {NOTE_DETAIL_LABELS.sections.relatedNotes}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {relatedNotes.map((relatedNote) => (
                    <Card key={relatedNote.slug} className="p-5">
                      <Badge>{relatedNote.category}</Badge>
                      <h3 className="mt-3 font-bold text-slate-900">
                        {relatedNote.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {relatedNote.summary}
                      </p>
                      <Link
                        to={PATHS.technicalNoteDetail(relatedNote.slug)}
                        className="mt-4 inline-flex text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        {NOTE_DETAIL_LABELS.links.noteDetail}
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
