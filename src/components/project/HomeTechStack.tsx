import type { IconType } from "react-icons";
import {
  SiClaude,
  SiDocker,
  SiFastapi,
  SiGithubactions,
  SiGithubcopilot,
  SiGrafana,
  SiMysql,
  SiJenkins,
  SiOpenai,
  SiOpenjdk,
  SiPostgresql,
  SiPrometheus,
  SiPython,
  SiSpringboot,
} from "react-icons/si";
import type { TechTag } from "@/types/common";
import { TechTag as TechTagBadge } from "@/components/common/TechTag";

type TechGroup = {
  title: string;
  items: TechTag[];
};

type HomeTechStackProps = {
  groups: TechGroup[];
};

const TECH_ICON_MAP: Partial<Record<string, IconType>> = {
  "Spring Boot": SiSpringboot,
  FastAPI: SiFastapi,
  Java: SiOpenjdk,
  Python: SiPython,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  Docker: SiDocker,
  "GitHub Actions": SiGithubactions,
  Jenkins: SiJenkins,
  Prometheus: SiPrometheus,
  Grafana: SiGrafana,
  "OpenAI API": SiOpenai,
  "Claude Code": SiClaude,
  Codex: SiOpenai,
  "GitHub Copilot": SiGithubcopilot,
};

export function HomeTechStack({ groups }: HomeTechStackProps) {
  return (
    <div className="divide-y divide-[var(--color-border)]">
      {groups.map((group) => (
        <div
          key={group.title}
          className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-6"
        >
          <h3 className="w-40 shrink-0 text-sm font-semibold text-[var(--color-muted-text)]">
            {group.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => {
              const Icon = TECH_ICON_MAP[item.name];

              return (
                <span key={`${group.title}-${item.name}`} className="inline-flex items-center gap-1.5">
                  {Icon ? <Icon className="h-3.5 w-3.5 text-[var(--color-muted-text)]" /> : null}
                  <TechTagBadge tag={item} />
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
