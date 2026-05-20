import { Cloud, Gauge, Layers, Workflow, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/common/ButtonLink";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { NoteGrid } from "@/components/note/NoteGrid";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { TechTag } from "@/components/common/TechTag";
import { highlights } from "@/data/highlights";
import { pageHeroes } from "@/data/hero";
import { projects } from "@/data/projects";
import { technicalNotes } from "@/data/technicalNotes";
import { techStackGroups } from "@/data/techStack";
import { externalLinks } from "@/constants/externalLinks";
import { PATHS } from "@/constants/paths";
import { pageChrome } from "@/utils/pageChrome";

const highlightIcons: Record<string, LucideIcon> = {
  Gauge,
  Workflow,
  Cloud,
  Layers,
};

export function HomePage() {
  const featuredProjects = projects.filter((project) => project.status === "featured");
  const featuredNotes = technicalNotes.slice(0, 3);

  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.home} />
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="FEATURED PROJECTS"
            title="주요 프로젝트"
            description="문제 정의부터 구조 개선, 운영 관점까지 보여줄 수 있는 대표 프로젝트입니다."
            action={<ButtonLink href={PATHS.projects} variant="outline">전체 보기</ButtonLink>}
          />
          <ProjectGrid projects={featuredProjects} />
        </div>
      </section>
      <section className="bg-white py-16 lg:py-20">
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
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  {Icon ? <Icon className="h-8 w-8 text-blue-600" /> : null}
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-brand-dark py-16 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="TECHNICAL NOTES"
            title="기술 문제 해결 기록"
            description="성능, 구조, 인프라 문제를 어떻게 관찰하고 개선했는지 기록합니다."
            dark
          />
          <NoteGrid notes={featuredNotes} />
        </div>
      </section>
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="TECH STACK"
            title="기술 스택"
            description="백엔드, 데이터베이스, 인프라와 운영 관측 도구를 중심으로 학습하고 적용합니다."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {techStackGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <h3 className="text-lg font-bold text-slate-900">{group.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {group.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((tag) => (
                    <TechTag key={`${group.title}-${tag.name}`} tag={tag} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
