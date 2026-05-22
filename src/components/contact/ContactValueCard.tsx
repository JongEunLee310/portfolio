import {
  Gauge,
  MessageSquare,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { themeSurface } from "@/styles/classNames";
import type { IconName } from "@/types/common";

type ContactValueCardProps = {
  value: {
    title: string;
    description: string;
    icon: IconName;
  };
};

const iconMap: Partial<Record<IconName, LucideIcon>> = {
  Gauge,
  MessageSquare,
  Workflow,
};

export function ContactValueCard({ value }: ContactValueCardProps) {
  const Icon = iconMap[value.icon] ?? Gauge;

  return (
    <div className={`${themeSurface.card} p-6`}>
      <Icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-[var(--color-page-text)]">
        {value.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted-text)]">
        {value.description}
      </p>
    </div>
  );
}
