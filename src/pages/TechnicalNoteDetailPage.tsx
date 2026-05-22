import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock3,
  Layers3,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { TechTag } from "@/components/common/TechTag";
import { useTheme } from "@/app/theme/useTheme";
import { PageLayout } from "@/components/layout/PageLayout";
import { ArticleSectionRenderer } from "@/components/note/ArticleSectionRenderer";
import { ArticleToc } from "@/components/note/ArticleToc";
import { PATHS } from "@/constants/paths";
import { NOTE_DETAIL_LABELS } from "@/constants/noteDetail";
import { noteDetails } from "@/data/noteDetails";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { technicalNotes } from "@/data/technicalNotes";
import { themeSurface } from "@/styles/classNames";
import { pageChrome } from "@/utils/pageChrome";

export function TechnicalNoteDetailPage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const { noteSlug } = useParams();
  const note = noteDetails.find((item) => item.slug === noteSlug);

  if (!note) {
    return (
      <PageLayout {...pageChrome}>
        <section className={`${themeSurface.lightBand} py-20`}>
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
      <section
        className={[
          "relative overflow-hidden border-b transition-colors duration-300",
          isLight
            ? "border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] text-slate-950"
            : "border-white/10 bg-hero-radial text-white",
        ].join(" ")}
      >
        {!isLight ? (
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,18,0.92)_0%,rgba(2,7,18,0.72)_48%,rgba(2,7,18,0.86)_100%)]" />
        ) : null}
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_50%_35%,rgba(37,99,235,0.2),transparent_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-20">
          <div>
            <div className={`flex flex-wrap items-center gap-2 text-xs font-semibold ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              <Link
                to={PATHS.technicalNotes}
                className="transition hover:text-blue-500"
              >
                {NOTE_DETAIL_LABELS.hero.breadcrumbRoot}
              </Link>
              <span>/</span>
              <span>{NOTE_DETAIL_LABELS.hero.breadcrumbCurrent}</span>
            </div>
            <div className="mt-5">
              <Badge variant={isLight ? "light" : "dark"}>{note.category}</Badge>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {note.title}
            </h1>
            <div className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-blue-300" />
                {note.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-blue-300" />
                {note.readingTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4 text-blue-300" />
                {siteConfig.owner.name}
              </span>
            </div>
            <p className={`mt-6 max-w-3xl text-base leading-8 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              {note.summary}
            </p>
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

          <div className="hidden lg:flex lg:items-center">
            <div className="relative w-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.22),transparent_46%)]" />
              <div className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-blue-300">
                      {NOTE_DETAIL_LABELS.hero.visualTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {NOTE_DETAIL_LABELS.hero.visualDescription}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
                    <Layers3 className="h-6 w-6" />
                  </div>
                </div>
                <img
                  src={note.thumbnail}
                  alt={note.title}
                  className="mt-8 h-56 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] object-cover"
                />
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {note.toc.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
                    >
                      <p className="line-clamp-2 text-xs font-semibold text-[var(--color-muted-text)]">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={`${themeSurface.lightBand} py-12 lg:py-16`}>
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ArticleToc
              items={note.toc}
              title={NOTE_DETAIL_LABELS.toc.title}
            />
            {note.tags.length > 0 ? (
              <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card">
                <h2 className="text-sm font-bold text-[var(--color-page-text)]">
                  {NOTE_DETAIL_LABELS.sidebar.techStack}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <TechTag key={`sidebar-${note.slug}-${tag.name}`} tag={tag} />
                  ))}
                </div>
              </section>
            ) : null}
            {relatedNotes.length > 0 ? (
              <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card">
                <h2 className="text-sm font-bold text-[var(--color-page-text)]">
                  {NOTE_DETAIL_LABELS.sidebar.relatedNotes}
                </h2>
                <div className="mt-4 space-y-4">
                  {relatedNotes.map((relatedNote) => (
                    <Link
                      key={relatedNote.slug}
                      to={PATHS.technicalNoteDetail(relatedNote.slug)}
                      className="block rounded-lg border border-[var(--color-border)] p-3 transition hover:border-blue-300 hover:bg-blue-500/10"
                    >
                      <p className="text-xs font-semibold text-blue-600">
                        {relatedNote.date}
                      </p>
                      <p className="mt-1 text-sm font-bold leading-6 text-[var(--color-page-text)]">
                        {relatedNote.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
          <div className="min-w-0">
            <article className="space-y-7">
              <section className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-5 py-4">
                <p className="text-xs font-bold uppercase text-blue-700">
                  {NOTE_DETAIL_LABELS.sections.summary}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-page-text)] md:text-base">
                  {note.summary}
                </p>
              </section>
              {note.content.map((section, index) => (
                <ArticleSectionRenderer
                  key={`${section.type}-${index}`}
                  section={section}
                  metricsLabels={NOTE_DETAIL_LABELS.metrics}
                />
              ))}
            </article>
            {relatedProjects.length > 0 ? (
              <section className="mt-14">
                <h2 className="text-2xl font-bold text-[var(--color-page-text)]">
                  {NOTE_DETAIL_LABELS.sections.relatedProjects}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {relatedProjects.map((project) => (
                    <article
                      key={project.slug}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card"
                    >
                      <p className="text-xs font-semibold text-blue-600">
                        {project.period}
                      </p>
                      <h3 className="mt-2 font-bold text-[var(--color-page-text)]">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--color-muted-text)]">
                        {project.summary}
                      </p>
                      <Link
                        to={PATHS.projectDetail(project.slug)}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        {NOTE_DETAIL_LABELS.links.projectDetail}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
            <section className="mt-14 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-[var(--color-page-text)] shadow-card">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-200">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      {NOTE_DETAIL_LABELS.sections.moreNotes}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {NOTE_DETAIL_LABELS.hero.visualDescription}
                    </p>
                  </div>
                </div>
                <Link
                  to={PATHS.technicalNotes}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  {NOTE_DETAIL_LABELS.links.allNotes}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
