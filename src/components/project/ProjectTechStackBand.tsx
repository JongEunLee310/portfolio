import {
  Activity,
  Bot,
  Cloud,
  Database,
  MessageSquare,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { IconName, TechTag } from "@/types/common";

type TechGroup = {
  title: string;
  description: string;
  icon: IconName;
  items: TechTag[];
};

type ProjectTechStackBandProps = {
  content: {
    eyebrow: string;
    title: string;
  };
  groups: TechGroup[];
  variant?: "dark" | "light";
};

const iconMap: Partial<Record<IconName, LucideIcon>> = {
  Server,
  Database,
  Cloud,
  MessageQueue: MessageSquare,
  Activity,
  Gauge: Bot,
};

export function ProjectTechStackBand({
  content,
  groups,
  variant = "dark",
}: ProjectTechStackBandProps) {
  const isLight = variant === "light";

  return (
    <section
      className={`border-t py-10 ${
        isLight
          ? "border-slate-200 bg-white text-slate-900"
          : "border-white/10 bg-brand-dark text-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase text-[var(--color-accent)]">
          {content.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold">{content.title}</h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {groups.map((group) => {
            const Icon = iconMap[group.icon] ?? Server;

            return (
              <article
                key={group.title}
                className={`rounded-lg border p-4 ${
                  isLight
                    ? "border-slate-200 bg-slate-50"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-semibold ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {group.title}
                    </h3>
                    <p
                      className={`mt-1 text-xs leading-5 ${
                        isLight ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {group.items.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
