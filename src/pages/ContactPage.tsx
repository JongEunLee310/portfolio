import { SectionHeader } from "@/components/common/SectionHeader";
import { ContactChannelCard } from "@/components/contact/ContactChannelCard";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { contactData } from "@/data/contact";
import { pageHeroes } from "@/data/hero";
import { pageChrome } from "./pageChrome";

export function ContactPage() {
  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.contact} />
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="CONTACT CHANNELS"
            title={contactData.responsePromise.title}
            description={contactData.responsePromise.description}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {contactData.channels.map((channel) => (
              <ContactChannelCard key={channel.href} channel={channel} />
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-bold text-slate-900">
              {contactData.faq[0]?.question}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {contactData.faq[0]?.answer}
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
