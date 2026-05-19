import type { ContactChannel } from "@/types/contact";

type ContactChannelCardProps = {
  channel: ContactChannel;
};

export function ContactChannelCard({ channel }: ContactChannelCardProps) {
  return (
    <a
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noreferrer" : undefined}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
    >
      <p className="text-sm font-semibold text-blue-600">{channel.label}</p>
      <p className="mt-2 text-sm text-slate-600">{channel.value}</p>
    </a>
  );
}
