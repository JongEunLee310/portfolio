import { Cloud, Gauge, Layers, Workflow, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/common/ButtonLink";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CodeSnippetBlock } from "@/components/hero/CodeSnippetBlock";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { HomeNoteCarousel } from "@/components/note/HomeNoteCarousel";
import { HomeFeaturedProjects } from "@/components/project/HomeFeaturedProjects";
import { ProjectTechStackBand } from "@/components/project/ProjectTechStackBand";
import { useTheme } from "@/app/theme/useTheme";
import { projectTechStackContent } from "@/data/filters";
import { highlights } from "@/data/highlights";
import { homeHeroCode, pageHeroes } from "@/data/hero";
import { projects } from "@/data/projects";
import { technicalNotes } from "@/data/technicalNotes";
import { techStackGroups } from "@/data/techStack";
import { PATHS } from "@/constants/paths";
import { themeSurface } from "@/styles/classNames";
import { pageChrome } from "@/utils/pageChrome";

const highlightIcons: Record<string, LucideIcon> = {
  Gauge,
  Workflow,
  Cloud,
  Layers,
};

export function HomePage() {
  const { resolvedTheme } = useTheme();
  const featuredProjects = projects.filter((project) => project.status === "featured");
  const normalProjects = projects.filter((project) => project.status === "normal");
  const featuredNotes = technicalNotes.slice(0, 5);

  return (
    <PageLayout {...pageChrome}>
      <PageHero
        {...pageHeroes.home}
        variant={resolvedTheme}
        visualSlot={
          <CodeSnippetBlock
            filename={homeHeroCode.filename}
            lines={homeHeroCode.lines}
          />
        }
      />
      <section className={`${themeSurface.lightBand} py-16 lg:py-20`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="FEATURED PROJECTS"
            title="주요 프로젝트"
            description="문제 정의부터 구조 개선, 운영 관점까지 보여줄 수 있는 대표 프로젝트입니다."
            action={<ButtonLink href={PATHS.projects} variant="outline">전체 보기</ButtonLink>}
          />
          <HomeFeaturedProjects
            featured={featuredProjects}
            others={normalProjects}
          />
        </div>
      </section>
      <section className={`${themeSurface.surfaceBand} py-16 lg:py-20`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="TECHNICAL HIGHLIGHTS"
            title="기술적 강점"
            description="성능, 구조, 인프라, 문제 해결 영역에서 쌓아온 기술적 경험입니다."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => {
              const Icon = highlightIcons[item.icon];
              return (
                <article
                  key={item.title}
                  className={`${themeSurface.card} p-6`}
                >
                  {Icon ? <Icon className="h-8 w-8 text-blue-600" /> : null}
                  <h3 className="mt-4 text-lg font-bold text-[var(--color-page-text)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted-text)]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className={`${themeSurface.surfaceBand} py-16 lg:py-20`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="TECHNICAL NOTES"
            title="기술 문제 해결 기록"
            description="성능, 구조, 인프라 문제를 어떻게 관찰하고 개선했는지 기록합니다."
            dark={resolvedTheme === "dark"}
            action={
              <ButtonLink
                href={PATHS.technicalNotes}
                variant={resolvedTheme === "dark" ? "darkOutline" : "outline"}
              >
                전체 보기
              </ButtonLink>
            }
          />
          <HomeNoteCarousel notes={featuredNotes} />
        </div>
      </section>
      <ProjectTechStackBand
        content={projectTechStackContent}
        groups={techStackGroups}
        variant="light"
      />
    </PageLayout>
  );
}
