import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock3,
  Layers3,
  UserRound,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { seoConfig } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { technicalNotes } from "@/data/technicalNotes";
import { heroSurface, themeSurface } from "@/styles/classNames";
import { pageChrome } from "@/utils/pageChrome";
import { useSeo } from "@/utils/useSeo";

export function TechnicalNoteDetailPage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const { noteSlug } = useParams();
  const navigate = useNavigate();
  const note = noteDetails.find((item) => item.slug === noteSlug);
  useSeo(note ? `${note.title} | 이종은 포트폴리오` : seoConfig[PATHS.technicalNotes].title);

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
          isLight ? heroSurface.lightBanner : heroSurface.darkBanner,
        ].join(" ")}
      >
        <div
          className={[
            "absolute right-0 top-0 h-full w-1/2",
            isLight ? heroSurface.lightGlow : heroSurface.darkGlow,
          ].join(" ")}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-20">
          <div>
            <div className={`flex flex-wrap items-center gap-2 text-xs font-semibold ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="transition hover:text-[var(--color-accent)]"
              >
                {NOTE_DETAIL_LABELS.hero.breadcrumbRoot}
              </button>
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
                <Calendar className={`h-4 w-4 ${isLight ? "text-[var(--color-accent)]" : "text-blue-300"}`} />
                {note.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className={`h-4 w-4 ${isLight ? "text-[var(--color-accent)]" : "text-blue-300"}`} />
                {note.readingTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserRound className={`h-4 w-4 ${isLight ? "text-[var(--color-accent)]" : "text-blue-300"}`} />
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
        <div className="mx-auto grid max-w-[92rem] gap-6 px-6 lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:px-8 xl:grid-cols-[10rem_minmax(0,1fr)] xl:gap-8">
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-8">
              <ArticleToc
                items={note.toc}
                title={NOTE_DETAIL_LABELS.toc.title}
              />
              {relatedNotes.length > 0 ? (
                <nav
                  aria-label={NOTE_DETAIL_LABELS.sidebar.relatedNotes}
                  className="border-l border-[var(--color-border)] py-2 pl-3"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                    {NOTE_DETAIL_LABELS.sidebar.relatedNotes}
                  </p>
                  <div className="mt-4 space-y-0.5">
                    {relatedNotes.map((relatedNote) => (
                      <Link
                        key={relatedNote.slug}
                        to={PATHS.technicalNoteDetail(relatedNote.slug)}
                        className="flex min-h-8 w-full items-center rounded-md border-l-2 border-transparent px-2 py-1.5 text-left text-xs font-semibold leading-5 text-[var(--color-muted-text)] transition hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 xl:text-sm"
                      >
                        {relatedNote.title}
                      </Link>
                    ))}
                  </div>
                </nav>
              ) : null}
            </div>
          </aside>
          <div className="min-w-0">
            <article className="space-y-7">
              <section className="rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-5 py-4">
                <p className="text-xs font-bold uppercase text-[var(--color-accent-dark)]">
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
                      <p className="text-xs font-semibold text-[var(--color-accent)]">
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
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]"
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
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
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
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-accent-hover)]"
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
