import { Cloud, Code2, Database, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { themeSurface } from "@/styles/classNames";
import type { Role } from "@/types/about";

type AboutRoleCardProps = {
  role: Role;
};

const roleIconMap: Partial<Record<Role["icon"], LucideIcon>> = {
  Server,
  Cloud,
  Code2,
  Database,
};

export function AboutRoleCard({ role }: AboutRoleCardProps) {
  const Icon = roleIconMap[role.icon] ?? Server;

  return (
    <article className={`p-6 ${themeSurface.card}`}>
      <Icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
      <h3 className="mt-4 text-base font-bold text-[var(--color-page-text)]">{role.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted-text)]">{role.description}</p>
      {role.tags ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {role.tags.map((tag) => (
            <span
              key={`${role.title}-${tag}`}
              className="rounded-md bg-[var(--color-surface-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-muted-text)]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
