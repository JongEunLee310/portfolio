import { Briefcase, Clock, Mail, MapPin, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { aboutProfileInfoLabels } from "@/constants/about";
import type { ProfileInfo } from "@/types/about";

type AboutProfileProps = {
  profile: ProfileInfo;
};

export function AboutProfile({ profile }: AboutProfileProps) {
  const infoItems: {
    label: string;
    value: string;
    Icon: LucideIcon;
  }[] = [
    { label: aboutProfileInfoLabels.name, value: profile.name, Icon: User },
    { label: aboutProfileInfoLabels.role, value: profile.role, Icon: Briefcase },
    { label: aboutProfileInfoLabels.experience, value: profile.experience, Icon: Clock },
    { label: aboutProfileInfoLabels.location, value: profile.location, Icon: MapPin },
  ];

  return (
    <div className="grid items-stretch gap-8 lg:grid-cols-[240px_1fr]">
      <img
        src={profile.avatar}
        alt={profile.name}
        className="h-full w-full rounded-2xl bg-slate-100 object-cover"
      />
      <div className="flex flex-col justify-between gap-6">
        <div className="space-y-4">
          {profile.introduction.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-8 text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-slate-200 pt-5 sm:grid-cols-2 lg:grid-cols-5">
          {infoItems.map(({ Icon, ...item }) => (
            <div key={item.label} className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
              <span className="truncate text-sm font-medium text-slate-900">
                {item.value}
              </span>
            </div>
          ))}
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span className="text-xs text-slate-400">
                {aboutProfileInfoLabels.email}
              </span>
            </div>
            <a
              href={`mailto:${profile.email}`}
              className="truncate text-sm font-medium text-slate-900 transition hover:text-blue-600"
            >
              {profile.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
