import type { TechTag as TechTagData } from "@/types/common";

const tagColorMap: Record<TechTagData["category"], string> = {
  backend: "tech-tag-backend",
  frontend: "tech-tag-frontend",
  database: "tech-tag-database",
  infra: "tech-tag-infra",
  devops: "tech-tag-devops",
  messaging: "tech-tag-messaging",
  observability: "tech-tag-observability",
  ai: "tech-tag-ai",
  language: "tech-tag-neutral",
  tool: "tech-tag-neutral",
};

type TechTagProps = {
  tag: TechTagData;
};

export function TechTag({ tag }: TechTagProps) {
  return (
    <span
      className={`tech-tag inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${tagColorMap[tag.category]}`}
    >
      {tag.name}
    </span>
  );
}
