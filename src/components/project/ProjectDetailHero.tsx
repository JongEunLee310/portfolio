import { ArrowLeft, ArrowRight, Calendar, Github, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import { button, heroSurface } from "@/styles/classNames";
import type { ProjectDetail } from "@/types/project";
import { ProjectDetailIcon } from "./ProjectDetailIcon";

type ProjectDetailHeroProps = {
  project: ProjectDetail;
  variant?: "dark" | "light";
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

export function ProjectDetailHero({
  project,
  variant = "dark",
}: ProjectDetailHeroProps) {
  const isLight = variant === "light";
  const navigate = useNavigate();
  const metadata = [
    {
      label: PROJECT_DETAIL_LABELS.hero.period,
      value: project.period,
      icon: Calendar,
    },
    {
      label: PROJECT_DETAIL_LABELS.hero.role,
      value: project.role,
      icon: Github,
    },
    {
      label: PROJECT_DETAIL_LABELS.hero.teamSize,
      value: project.teamSize,
      icon: Users,
    },
  ].filter((item) => hasText(item.value));

  return (
    <section
      className={[
        "relative overflow-hidden py-10 transition-colors duration-300 lg:py-16",
        isLight ? heroSurface.lightBanner : heroSurface.darkBanner,
      ].join(" ")}
    >
      <div
        className={[
          "absolute right-0 top-0 h-full w-1/2",
          isLight ? heroSurface.lightGlow : heroSurface.darkGlow,
        ].join(" ")}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={[
              "inline-flex items-center gap-2 text-sm font-semibold transition",
              isLight
                ? "text-slate-600 hover:text-[var(--color-accent)]"
                : "text-slate-300 hover:text-white",
            ].join(" ")}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {PROJECT_DETAIL_LABELS.backToProjects}
          </button>

          <div className="mt-7 flex flex-wrap gap-2">
            <Badge variant={isLight ? "light" : "dark"}>
              {project.category}
            </Badge>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>

          {hasText(project.summary) ? (
            <p className={`mt-5 max-w-2xl text-base leading-8 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              {project.summary}
            </p>
          ) : null}

          {metadata.length > 0 ? (
            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              {metadata.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="flex gap-3">
                    <span
                      className={[
                        "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                        isLight
                          ? "border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
                          : "border-blue-400/30 bg-blue-500/10 text-blue-300",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <dt className={`text-xs font-semibold ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                        {item.label}
                      </dt>
                      <dd className={`mt-1 text-sm font-semibold ${isLight ? "text-slate-950" : "text-white"}`}>
                        {item.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          ) : null}

          {project.heroHighlights?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.heroHighlights.map((highlight) => (
                <div
                  key={`${highlight.label}-${highlight.value}`}
                  className={[
                    "inline-flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold",
                    isLight
                      ? "border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent-dark)]"
                      : "border-blue-400/25 bg-blue-500/10 text-blue-100",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-flex h-7 w-7 items-center justify-center rounded-md",
                      isLight
                        ? "bg-[var(--color-surface)] text-[var(--color-accent)]"
                        : "bg-blue-500/20 text-blue-300",
                    ].join(" ")}
                  >
                    <ProjectDetailIcon icon={highlight.icon} className="h-4 w-4" />
                  </span>
                  <span>{highlight.label}</span>
                  <span className={isLight ? "text-[var(--color-accent)]" : "text-blue-300"}>
                    {highlight.value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.demo ? (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className={`${button.primary} gap-2`}
              >
                {PROJECT_DETAIL_LABELS.hero.liveDemo}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className={`${isLight ? button.outline : button.darkOutline} gap-2`}
              >
                {PROJECT_DETAIL_LABELS.hero.github}
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>

        {hasText(project.heroImage) ? (
          <div className="relative">
            <div
              className={[
                "absolute -inset-4 rounded-2xl blur-2xl",
                isLight ? "bg-[var(--color-accent-bg)]" : "bg-blue-500/20",
              ].join(" ")}
            />
            <img
              src={project.heroImage}
              alt={`${project.title} 대표 대시보드 화면`}
              className={[
                "relative aspect-[16/10] w-full rounded-xl border object-cover shadow-glow",
                isLight
                  ? "border-[var(--color-accent-border)] bg-[var(--color-surface)]"
                  : "border-blue-400/30 bg-slate-950",
              ].join(" ")}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
