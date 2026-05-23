import { themeSurface } from "@/styles/classNames";
import type { Metric } from "@/types/common";

type AboutGrowthMetricsProps = {
  metrics: Metric[];
};

export function AboutGrowthMetrics({ metrics }: AboutGrowthMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <article key={metric.label} className={`p-5 ${themeSurface.card}`}>
          <p className="text-3xl font-bold text-[var(--color-accent)]">{metric.value}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-page-text)]">{metric.label}</p>
          {metric.description ? (
            <p className="mt-0.5 text-xs text-[var(--color-muted-text)]">{metric.description}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
