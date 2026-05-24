import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/common/SectionHeader";
import { TechTag } from "@/components/common/TechTag";
import { PATHS } from "@/constants/paths";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type { ProjectDetail } from "@/types/project";
import { ProjectDetailIcon } from "./ProjectDetailIcon";

type ProjectClosingCardsSectionProps = {
  project: ProjectDetail;
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

export function ProjectClosingCardsSection({
  project,
}: ProjectClosingCardsSectionProps) {
  const [activeTroubleshootingIndex, setActiveTroubleshootingIndex] = useState(0);
  const [activeImprovementIndex, setActiveImprovementIndex] = useState(0);
  const troubleshooting = project.troubleshooting.filter(
    (item) => hasText(item.title) && hasText(item.solution),
  );
  const improvements = project.improvements?.filter(
    (item) => hasText(item.title) && hasText(item.description),
  );
  const learned = project.retrospective.learned.filter(hasText);
  const improvementPlans = project.retrospective.improvement.filter(hasText);
  const activeTroubleshooting =
    troubleshooting[activeTroubleshootingIndex] ?? troubleshooting[0];
  const activeImprovement =
    improvements?.[activeImprovementIndex] ?? improvements?.[0];

  function showPreviousTroubleshooting() {
    setActiveTroubleshootingIndex((current) =>
      current === 0 ? troubleshooting.length - 1 : current - 1,
    );
  }

  function showNextTroubleshooting() {
    setActiveTroubleshootingIndex((current) =>
      current === troubleshooting.length - 1 ? 0 : current + 1,
    );
  }

  function showPreviousImprovement() {
    setActiveImprovementIndex((current) =>
      current === 0 ? (improvements?.length ?? 1) - 1 : current - 1,
    );
  }

  function showNextImprovement() {
    setActiveImprovementIndex((current) =>
      current === (improvements?.length ?? 1) - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {activeTroubleshooting ? (
        <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]">
                {PROJECT_DETAIL_LABELS.sections.troubleshooting.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-page-text)]">
                {PROJECT_DETAIL_LABELS.sections.troubleshooting.title}
              </h2>
            </div>
            {troubleshooting.length > 1 ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={showPreviousTroubleshooting}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  aria-label={
                    PROJECT_DETAIL_LABELS.sections.troubleshooting.previous
                  }
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNextTroubleshooting}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  aria-label={PROJECT_DETAIL_LABELS.sections.troubleshooting.next}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
          <TroubleshootingSlide item={activeTroubleshooting} />
          {troubleshooting.length > 1 ? (
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold text-[var(--color-muted-text)]" aria-live="polite">
                {PROJECT_DETAIL_LABELS.sections.troubleshooting.status}{" "}
                {activeTroubleshootingIndex + 1} / {troubleshooting.length}
              </p>
              <div className="flex gap-1.5">
                {troubleshooting.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveTroubleshootingIndex(index)}
                    className={[
                      "h-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                      index === activeTroubleshootingIndex
                        ? "w-6 bg-[var(--color-accent)]"
                        : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-accent)]",
                    ].join(" ")}
                    aria-label={`${item.title} ${PROJECT_DETAIL_LABELS.sections.troubleshooting.openNote}`}
                    aria-current={index === activeTroubleshootingIndex}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </article>
      ) : null}

      {activeImprovement ? (
        <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]">
                {PROJECT_DETAIL_LABELS.sections.improvements.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-page-text)]">
                {PROJECT_DETAIL_LABELS.sections.improvements.title}
              </h2>
            </div>
            {improvements && improvements.length > 1 ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={showPreviousImprovement}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  aria-label={PROJECT_DETAIL_LABELS.sections.improvements.previous}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNextImprovement}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  aria-label={PROJECT_DETAIL_LABELS.sections.improvements.next}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
          <ImprovementSlide item={activeImprovement} />
          {improvements && improvements.length > 1 ? (
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold text-[var(--color-muted-text)]" aria-live="polite">
                {PROJECT_DETAIL_LABELS.sections.improvements.status}{" "}
                {activeImprovementIndex + 1} / {improvements.length}
              </p>
              <div className="flex gap-1.5">
                {improvements.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveImprovementIndex(index)}
                    className={[
                      "h-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                      index === activeImprovementIndex
                        ? "w-6 bg-[var(--color-accent)]"
                        : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-accent)]",
                    ].join(" ")}
                    aria-label={item.title}
                    aria-current={index === activeImprovementIndex}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </article>
      ) : null}

      {learned.length || improvementPlans.length ? (
        <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card">
          <SectionHeader
            eyebrow={PROJECT_DETAIL_LABELS.sections.retrospective.eyebrow}
            title={PROJECT_DETAIL_LABELS.sections.retrospective.title}
          />
          <div className="h-[430px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
            <p className="text-sm leading-7 text-[var(--color-muted-text)]">
              {learned[0] ?? improvementPlans[0]}
            </p>
            {learned.length > 1 || improvementPlans.length ? (
              <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--color-muted-text)]">
                {learned[1] ? (
                  <p>
                    <span className="font-bold text-[var(--color-page-text)]">
                      {PROJECT_DETAIL_LABELS.sections.retrospective.learned}
                    </span>
                    : {learned[1]}
                  </p>
                ) : null}
                {improvementPlans[0] ? (
                  <p>
                    <span className="font-bold text-[var(--color-page-text)]">
                      {PROJECT_DETAIL_LABELS.sections.retrospective.improvement}
                    </span>
                    : {improvementPlans[0]}
                  </p>
                ) : null}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack.slice(0, 5).map((tag) => (
                <TechTag key={`${project.slug}-closing-${tag.name}`} tag={tag} />
              ))}
            </div>
          </div>
          {project.retrospective.noteSlug ? (
            <div className="mt-6 flex justify-end">
              <Link
                to={PATHS.technicalNoteDetail(project.retrospective.noteSlug)}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-4 py-2 text-sm font-bold text-[var(--color-accent)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                {PROJECT_DETAIL_LABELS.sections.retrospective.openNote}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </article>
      ) : null}
    </div>
  );
}

type ImprovementSlideProps = {
  item: NonNullable<ProjectDetail["improvements"]>[number];
};

function ImprovementSlide({ item }: ImprovementSlideProps) {
  return (
    <div className="h-[400px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
          <ProjectDetailIcon icon={item.icon} />
        </span>
        <h3 className="text-base font-bold text-[var(--color-page-text)]">{item.title}</h3>
      </div>
      <dl className="mt-5 space-y-4 text-sm leading-6">
        <div>
          <dt className="font-bold text-[var(--color-page-text)]">
            {PROJECT_DETAIL_LABELS.sections.improvements.description}
          </dt>
          <dd className="mt-1 text-[var(--color-muted-text)]">{item.description}</dd>
        </div>
        {item.result ? (
          <div>
            <dt className="font-bold text-[var(--color-page-text)]">
              {PROJECT_DETAIL_LABELS.sections.improvements.result}
            </dt>
            <dd className="mt-1 text-[var(--color-muted-text)]">{item.result}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

type TroubleshootingSlideProps = {
  item: ProjectDetail["troubleshooting"][number];
};

function TroubleshootingSlide({ item }: TroubleshootingSlideProps) {
  const content = (
    <div className="h-[400px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5 transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-bold text-[var(--color-page-text)]">{item.title}</h3>
        {item.noteSlug ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--color-accent)]">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.openNote}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <dl className="mt-5 space-y-4 text-sm leading-6">
        <div>
          <dt className="font-bold text-[var(--color-page-text)]">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.problem}
          </dt>
          <dd className="mt-1 text-[var(--color-muted-text)]">{item.problem}</dd>
        </div>
        <div>
          <dt className="font-bold text-[var(--color-page-text)]">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.solution}
          </dt>
          <dd className="mt-1 text-[var(--color-muted-text)]">{item.solution}</dd>
        </div>
        {item.result ? (
          <div>
            <dt className="font-bold text-[var(--color-page-text)]">
              {PROJECT_DETAIL_LABELS.sections.troubleshooting.result}
            </dt>
            <dd className="mt-1 text-[var(--color-muted-text)]">{item.result}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );

  if (!item.noteSlug) {
    return content;
  }

  return (
    <Link
      to={PATHS.technicalNoteDetail(item.noteSlug)}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}
