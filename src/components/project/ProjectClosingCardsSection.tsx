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

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3 lg:px-8">
      {activeTroubleshooting ? (
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                {PROJECT_DETAIL_LABELS.sections.troubleshooting.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {PROJECT_DETAIL_LABELS.sections.troubleshooting.title}
              </h2>
            </div>
            {troubleshooting.length > 1 ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={showPreviousTroubleshooting}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-300 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label={
                    PROJECT_DETAIL_LABELS.sections.troubleshooting.previous
                  }
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNextTroubleshooting}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-300 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
              <p className="text-xs font-semibold text-slate-500" aria-live="polite">
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
                      "h-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      index === activeTroubleshootingIndex
                        ? "w-6 bg-blue-600"
                        : "w-2.5 bg-slate-300 hover:bg-blue-300",
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

      {improvements?.length ? (
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <SectionHeader
            eyebrow={PROJECT_DETAIL_LABELS.sections.improvements.eyebrow}
            title={PROJECT_DETAIL_LABELS.sections.improvements.title}
          />
          <div className="space-y-3">
            {improvements.slice(0, 3).map((item) => (
              <div
                key={item.title}
                className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ProjectDetailIcon icon={item.icon} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-slate-600">
                    {item.result ?? item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {learned.length || improvementPlans.length ? (
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <SectionHeader
            eyebrow={PROJECT_DETAIL_LABELS.sections.retrospective.eyebrow}
            title={PROJECT_DETAIL_LABELS.sections.retrospective.title}
          />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm leading-7 text-slate-600">
              {learned[0] ?? improvementPlans[0]}
            </p>
            {learned.length > 1 || improvementPlans.length ? (
              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                {learned[1] ? (
                  <p>
                    <span className="font-bold text-slate-900">
                      {PROJECT_DETAIL_LABELS.sections.retrospective.learned}
                    </span>
                    : {learned[1]}
                  </p>
                ) : null}
                {improvementPlans[0] ? (
                  <p>
                    <span className="font-bold text-slate-900">
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
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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

type TroubleshootingSlideProps = {
  item: ProjectDetail["troubleshooting"][number];
};

function TroubleshootingSlide({ item }: TroubleshootingSlideProps) {
  const content = (
    <div className="min-h-[260px] rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-blue-50/40">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
        {item.noteSlug ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-blue-600">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.openNote}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <dl className="mt-5 space-y-4 text-sm leading-6">
        <div>
          <dt className="font-bold text-slate-900">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.problem}
          </dt>
          <dd className="mt-1 text-slate-600">{item.problem}</dd>
        </div>
        <div>
          <dt className="font-bold text-slate-900">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.solution}
          </dt>
          <dd className="mt-1 text-slate-600">{item.solution}</dd>
        </div>
        {item.result ? (
          <div>
            <dt className="font-bold text-slate-900">
              {PROJECT_DETAIL_LABELS.sections.troubleshooting.result}
            </dt>
            <dd className="mt-1 text-slate-600">{item.result}</dd>
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
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}
