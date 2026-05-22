import type { Metric } from "@/types/common";
import { ProjectDetailIcon } from "./ProjectDetailIcon";

type ProjectMetricCardProps = {
  metric: Metric;
};

export function ProjectMetricCard({ metric }: ProjectMetricCardProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-page-text)] shadow-card">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-500/10 text-blue-300">
        <ProjectDetailIcon icon={metric.icon} />
      </span>
      <p className="mt-4 text-3xl font-bold text-blue-300">{metric.value}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--color-page-text)]">{metric.label}</p>
      {metric.description ? (
        <p className="mt-2 text-xs leading-6 text-[var(--color-muted-text)]">
          {metric.description}
        </p>
      ) : null}
    </div>
  );
}
