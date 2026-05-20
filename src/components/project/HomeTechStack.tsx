import type { IconType } from "react-icons";
import {
  SiCelery,
  SiDocker,
  SiFastapi,
  SiGithubactions,
  SiGrafana,
  SiMysql,
  SiNginx,
  SiOpenjdk,
  SiPostgresql,
  SiPrometheus,
  SiPython,
  SiRabbitmq,
  SiRedis,
  SiSpringboot,
} from "react-icons/si";
import type { TechTag } from "@/types/common";

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
  Redis: SiRedis,
  Docker: SiDocker,
  "GitHub Actions": SiGithubactions,
  Nginx: SiNginx,
  Celery: SiCelery,
  RabbitMQ: SiRabbitmq,
  Prometheus: SiPrometheus,
  Grafana: SiGrafana,
};

const tagColorMap: Record<TechTag["category"], string> = {
  backend: "bg-emerald-50 text-emerald-700",
  frontend: "bg-sky-50 text-sky-700",
  database: "bg-indigo-50 text-indigo-700",
  infra: "bg-blue-50 text-blue-700",
  devops: "bg-blue-50 text-blue-700",
  messaging: "bg-orange-50 text-orange-700",
  observability: "bg-cyan-50 text-cyan-700",
  ai: "bg-violet-50 text-violet-700",
  language: "bg-slate-100 text-slate-700",
  tool: "bg-slate-100 text-slate-700",
};

export function HomeTechStack({ groups }: HomeTechStackProps) {
  return (
    <div className="divide-y divide-slate-200">
      {groups.map((group) => (
        <div
          key={group.title}
          className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-6"
        >
          <h3 className="w-40 shrink-0 text-sm font-semibold text-slate-500">
            {group.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => {
              const Icon = TECH_ICON_MAP[item.name];

              return (
                <span
                  key={`${group.title}-${item.name}`}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${tagColorMap[item.category]}`}
                >
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                  {item.name}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
