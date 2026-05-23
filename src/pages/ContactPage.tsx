import { SectionHeader } from "@/components/common/SectionHeader";
import { ContactChannelCard } from "@/components/contact/ContactChannelCard";
import { ContactEmailCTA } from "@/components/contact/ContactEmailCTA";
import { ContactFAQList } from "@/components/contact/ContactFAQList";
import { ContactValueCard } from "@/components/contact/ContactValueCard";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { useTheme } from "@/app/theme/useTheme";
import { contactData } from "@/data/contact";
import { pageHeroes } from "@/data/hero";
import { layout, themeSurface } from "@/styles/classNames";
import { pageChrome } from "@/utils/pageChrome";
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
import { PATHS } from "@/constants/paths";

export function ContactPage() {
  useSeo(seoConfig[PATHS.contact].title);
  const { resolvedTheme } = useTheme();
  const { channels, faq, sections, values } = contactData;
  const [emailChannel, ...supportChannels] = channels;

  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.contact} variant={resolvedTheme} />

      <section id={sections.contact.id} className={`${themeSurface.lightBand} ${layout.section}`}>
        <div className={layout.container}>
          <SectionHeader {...sections.contact} />
          <div className="grid gap-12 lg:grid-cols-2">
            {emailChannel ? (
              <ContactEmailCTA channel={emailChannel} />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              {supportChannels.map((channel) => (
                <ContactChannelCard key={channel.href} channel={channel} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${themeSurface.surfaceBand} ${layout.section}`}>
        <div className={layout.container}>
          <div className="grid gap-12 lg:grid-cols-2">
            <div id={sections.faq.id}>
              <SectionHeader {...sections.faq} />
              <ContactFAQList items={faq} />
            </div>
            <div id={sections.collaboration.id}>
              <SectionHeader {...sections.collaboration} />
              <div className="flex flex-col gap-4">
                {values.map((value) => (
                  <ContactValueCard key={value.title} value={value} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
