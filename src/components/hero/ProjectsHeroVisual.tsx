import {
  Braces,
  ChartNoAxesColumnIncreasing,
  Code2,
  Database,
  Server,
} from "lucide-react";

const platformNodes = [
  { label: "API", Icon: Code2, className: "left-6 top-14" },
  { label: "Metrics", Icon: ChartNoAxesColumnIncreasing, className: "left-0 top-36" },
  { label: "Worker", Icon: Braces, className: "right-8 top-6" },
  { label: "Data", Icon: Database, className: "right-0 top-36" },
] as const;

export function ProjectsHeroVisual() {
  return (
    <div className="relative hidden min-h-[320px] lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.34)_1px,transparent_0)] bg-[length:28px_28px] opacity-40" />
      <div className="absolute inset-x-8 top-1/2 h-px bg-blue-500/30" />
      <div className="absolute left-1/2 top-12 h-56 w-px bg-blue-500/30" />
      <div className="absolute left-[18%] top-[44%] h-px w-[64%] rounded-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.75rem] border border-blue-400/30 bg-blue-500/10 shadow-glow">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-blue-300/30 bg-brand-surface shadow-blue-soft">
          <Server className="h-10 w-10 text-blue-300" />
        </div>
      </div>

      {platformNodes.map(({ label, Icon, className }) => (
        <div
          key={label}
          className={`absolute ${className} flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-blue-300 shadow-glow`}
          aria-hidden="true"
        >
          <Icon className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}
