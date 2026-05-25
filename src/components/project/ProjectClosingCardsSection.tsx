import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type { ProjectDetail } from "@/types/project";
import type { TechnicalNoteCard } from "@/types/note";
import { ProjectDetailIcon } from "./ProjectDetailIcon";

type TroubleshootingCard = TechnicalNoteCard & { cardSummary: NonNullable<TechnicalNoteCard["cardSummary"]> };

type ProjectClosingCardsSectionProps = {
  project: ProjectDetail;
  troubleshootingCards: TechnicalNoteCard[];
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

export function ProjectClosingCardsSection({
  project,
  troubleshootingCards,
}: ProjectClosingCardsSectionProps) {
  const [activeTroubleshootingIndex, setActiveTroubleshootingIndex] = useState(0);
  const [activeImprovementIndex, setActiveImprovementIndex] = useState(0);
  const [activeRetrospectiveIndex, setActiveRetrospectiveIndex] = useState(0);
  const narrowedTroubleshootingCards = troubleshootingCards.filter(
    (n): n is TroubleshootingCard => n.cardSummary !== undefined,
  );
  const improvements = project.improvements?.filter(
    (item) => hasText(item.title) && hasText(item.description),
  );
  const retrospectives = project.retrospectives;
  const activeRetrospective = retrospectives[activeRetrospectiveIndex] ?? retrospectives[0];
  const activeTroubleshooting =
    narrowedTroubleshootingCards[activeTroubleshootingIndex] ?? narrowedTroubleshootingCards[0];
  const activeImprovement =
    improvements?.[activeImprovementIndex] ?? improvements?.[0];

  function showPreviousTroubleshooting() {
    setActiveTroubleshootingIndex((current) =>
      current === 0 ? narrowedTroubleshootingCards.length - 1 : current - 1,
    );
  }

  function showNextTroubleshooting() {
    setActiveTroubleshootingIndex((current) =>
      current === narrowedTroubleshootingCards.length - 1 ? 0 : current + 1,
    );
  }

  function showPreviousRetrospective() {
    setActiveRetrospectiveIndex((current) =>
      current === 0 ? retrospectives.length - 1 : current - 1,
    );
  }

  function showNextRetrospective() {
    setActiveRetrospectiveIndex((current) =>
      current === retrospectives.length - 1 ? 0 : current + 1,
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
            {narrowedTroubleshootingCards.length > 1 ? (
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
          {narrowedTroubleshootingCards.length > 1 ? (
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold text-[var(--color-muted-text)]" aria-live="polite">
                {PROJECT_DETAIL_LABELS.sections.troubleshooting.status}{" "}
                {activeTroubleshootingIndex + 1} / {narrowedTroubleshootingCards.length}
              </p>
              <div className="flex gap-1.5">
                {narrowedTroubleshootingCards.map((item, index) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setActiveTroubleshootingIndex(index)}
                    className={[
                      "h-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                      index === activeTroubleshootingIndex
                        ? "w-6 bg-[var(--color-accent)]"
                        : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-accent)]",
                    ].join(" ")}
                    aria-label={`${item.cardSummary.title} ${PROJECT_DETAIL_LABELS.sections.troubleshooting.openNote}`}
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

      {retrospectives.length > 0 ? (
        <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]">
                {PROJECT_DETAIL_LABELS.sections.retrospective.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-page-text)]">
                {PROJECT_DETAIL_LABELS.sections.retrospective.title}
              </h2>
            </div>
            {retrospectives.length > 1 ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={showPreviousRetrospective}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  aria-label={PROJECT_DETAIL_LABELS.sections.retrospective.previous}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNextRetrospective}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  aria-label={PROJECT_DETAIL_LABELS.sections.retrospective.next}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
          {activeRetrospective ? <RetrospectiveSlide item={activeRetrospective} /> : null}
          {retrospectives.length > 1 ? (
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold text-[var(--color-muted-text)]" aria-live="polite">
                {PROJECT_DETAIL_LABELS.sections.retrospective.status}{" "}
                {activeRetrospectiveIndex + 1} / {retrospectives.length}
              </p>
              <div className="flex gap-1.5">
                {retrospectives.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveRetrospectiveIndex(index)}
                    className={[
                      "h-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                      index === activeRetrospectiveIndex
                        ? "w-6 bg-[var(--color-accent)]"
                        : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-accent)]",
                    ].join(" ")}
                    aria-label={item.title}
                    aria-current={index === activeRetrospectiveIndex}
                  />
                ))}
              </div>
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

type RetrospectiveSlideProps = {
  item: ProjectDetail["retrospectives"][number];
};

function RetrospectiveSlide({ item }: RetrospectiveSlideProps) {
  return (
    <div className="h-[400px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
      <h3 className="text-base font-bold text-[var(--color-page-text)]">{item.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[var(--color-muted-text)]">
        {item.learned[0]}
      </p>
      {item.noteSlug ? (
        <div className="mt-6 flex justify-end">
          <Link
            to={PATHS.technicalNoteDetail(item.noteSlug)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-4 py-2 text-sm font-bold text-[var(--color-accent)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {PROJECT_DETAIL_LABELS.sections.retrospective.openNote}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

type TroubleshootingSlideProps = {
  item: TroubleshootingCard;
};

function TroubleshootingSlide({ item }: TroubleshootingSlideProps) {
  const summary = item.cardSummary;
  const content = (
    <div className="h-[400px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5 transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-bold text-[var(--color-page-text)]">{summary.title}</h3>
        {!item.isStub ? (
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
          <dd className="mt-1 text-[var(--color-muted-text)]">{summary.problem}</dd>
        </div>
        <div>
          <dt className="font-bold text-[var(--color-page-text)]">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.solution}
          </dt>
          <dd className="mt-1 text-[var(--color-muted-text)]">{summary.solution}</dd>
        </div>
        {summary.result ? (
          <div>
            <dt className="font-bold text-[var(--color-page-text)]">
              {PROJECT_DETAIL_LABELS.sections.troubleshooting.result}
            </dt>
            <dd className="mt-1 text-[var(--color-muted-text)]">{summary.result}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );

  if (item.isStub) {
    return content;
  }

  return (
    <Link
      to={PATHS.technicalNoteDetail(item.slug)}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}
