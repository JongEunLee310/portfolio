import type { TechTag as TechTagData } from "@/types/common";

const tagColorMap: Record<TechTagData["category"], string> = {
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

type TechTagProps = {
  tag: TechTagData;
};

export function TechTag({ tag }: TechTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${tagColorMap[tag.category]}`}
    >
      {tag.name}
    </span>
  );
}
