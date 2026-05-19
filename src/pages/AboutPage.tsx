import { SectionHeader } from "@/components/common/SectionHeader";
import { TechTag } from "@/components/common/TechTag";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { aboutData } from "@/data/about";
import { pageHeroes } from "@/data/hero";
import { pageChrome } from "@/utils/pageChrome";

export function AboutPage() {
  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.about} />
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="PROFILE"
            title={aboutData.profile.name}
            description={aboutData.profile.role}
          />
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <img
                src={aboutData.profile.avatar}
                alt={aboutData.profile.name}
                className="aspect-square w-full rounded-xl object-cover"
              />
              <p className="mt-5 text-sm text-slate-600">
                {aboutData.profile.location}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {aboutData.profile.email}
              </p>
            </article>
            <div className="space-y-6">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                {aboutData.profile.introduction.map((paragraph) => (
                  <p key={paragraph} className="mb-4 text-sm leading-7 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </article>
              <div className="grid gap-4 md:grid-cols-2">
                {aboutData.skills.map((skill) => (
                  <article
                    key={skill.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
                  >
                    <h3 className="font-bold text-slate-900">{skill.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skill.items.map((tag) => (
                        <TechTag key={`${skill.title}-${tag.name}`} tag={tag} />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
