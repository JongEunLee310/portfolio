import { Mail } from "lucide-react";
import { button, themeSurface } from "@/styles/classNames";
import type { ContactChannel } from "@/types/contact";

type ContactEmailCTAProps = {
  channel: ContactChannel;
};

export function ContactEmailCTA({ channel }: ContactEmailCTAProps) {
  return (
    <div className={`${themeSurface.card} flex flex-col gap-6 p-8`}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-accent)]">{channel.label}</p>
          <p className="mt-2 break-words text-xl font-semibold text-[var(--color-page-text)]">
            {channel.value}
          </p>
        </div>
      </div>

      <a href={channel.href} className={button.primary}>
        이메일 보내기
      </a>
    </div>
  );
}
