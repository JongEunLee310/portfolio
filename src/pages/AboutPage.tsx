import { AboutGrowthMetrics } from "@/components/about/AboutGrowthMetrics";
import { AboutProfile } from "@/components/about/AboutProfile";
import { AboutRoleCard } from "@/components/about/AboutRoleCard";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutWorkStyle } from "@/components/about/AboutWorkStyle";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { HomeTechStack } from "@/components/project/HomeTechStack";
import { aboutData } from "@/data/about";
import { pageHeroes } from "@/data/hero";
import { techStackGroups } from "@/data/techStack";
import { layout, surface } from "@/styles/classNames";
import { pageChrome } from "@/utils/pageChrome";

export function AboutPage() {
  const { profile, sections, growthMetrics, roles, timeline, workStyle } = aboutData;

  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.about} />

      <section id={sections.profile.id} className={`${surface.light} ${layout.section}`}>
        <div className={layout.container}>
          <SectionHeader {...sections.profile} />
          <div className="mt-10">
            <AboutProfile profile={profile} />
          </div>
        </div>
      </section>

      <section id={sections.roles.id} className={`bg-white ${layout.section}`}>
        <div className={layout.container}>
          <SectionHeader {...sections.roles} />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <AboutRoleCard key={role.title} role={role} />
            ))}
          </div>
        </div>
      </section>

      <section id={sections.timeline.id} className={`${surface.light} ${layout.section}`}>
        <div className={layout.container}>
          <SectionHeader
            eyebrow={sections.timeline.eyebrow}
            title={sections.timeline.title}
            description={sections.timeline.description}
          />
          <div className="mt-10">
            <AboutTimeline items={timeline} />
          </div>
        </div>
      </section>

      <section id={sections.techStack.id} className={`bg-white ${layout.section}`}>
        <div className={layout.container}>
          <SectionHeader {...sections.techStack} />
          <HomeTechStack groups={techStackGroups} />
        </div>
      </section>

      <section id={sections.workStyle.id} className={`${surface.light} ${layout.section}`}>
        <div className={layout.container}>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader {...sections.workStyle} />
              <div className="mt-10">
                <AboutWorkStyle workStyle={workStyle} />
              </div>
            </div>
            <div id={sections.growthMetrics.id}>
              <SectionHeader {...sections.growthMetrics} />
              <div className="mt-10">
                <AboutGrowthMetrics metrics={growthMetrics} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
