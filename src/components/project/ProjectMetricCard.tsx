import type { Metric } from "@/types/common";

type ProjectMetricCardProps = {
  metric: Metric;
};

export function ProjectMetricCard({ metric }: ProjectMetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white shadow-glow">
      <p className="text-sm text-slate-300">{metric.label}</p>
      <p className="mt-2 text-2xl font-bold text-blue-300">{metric.value}</p>
      {metric.description ? (
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {metric.description}
        </p>
      ) : null}
    </div>
  );
}
