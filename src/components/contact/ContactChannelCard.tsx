import {
  ExternalLink,
  FileDown,
  Github,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { themeSurface } from "@/styles/classNames";
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
      className={`block ${themeSurface.card} p-5 hover:-translate-y-1 hover:shadow-card-hover`}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-accent)]">{channel.label}</p>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--color-muted-text)]">
            {channel.value}
          </p>
        </div>
      </div>
    </a>
  );
}
