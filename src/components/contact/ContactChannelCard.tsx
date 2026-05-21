import {
  ExternalLink,
  FileDown,
  Github,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { ContactChannel } from "@/types/contact";
import type { IconName } from "@/types/common";

const iconMap: Partial<Record<IconName, LucideIcon>> = {
  Mail,
  Github,
  ExternalLink,
  FileDown,
};

type ContactChannelCardProps = {
  channel: ContactChannel;
};

export function ContactChannelCard({ channel }: ContactChannelCardProps) {
  const Icon = iconMap[channel.icon] ?? ExternalLink;

  return (
    <a
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noreferrer" : undefined}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-600">{channel.label}</p>
          <p className="mt-2 break-words text-sm leading-6 text-slate-600">
            {channel.value}
          </p>
        </div>
      </div>
    </a>
  );
}
