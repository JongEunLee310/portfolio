import { Check } from "lucide-react";
import type { WorkStyle } from "@/types/about";

type AboutWorkStyleProps = {
  workStyle: WorkStyle;
};

export function AboutWorkStyle({ workStyle }: AboutWorkStyleProps) {
  return (
    <div>
      <div>
        <span className="text-6xl font-bold leading-none text-[var(--color-accent)]">"</span>
        <blockquote className="mt-2 text-2xl font-semibold leading-snug text-[var(--color-page-text)]">
          {workStyle.quote}
        </blockquote>
      </div>
      <ul className="mt-8 flex flex-col gap-3">
        {workStyle.principles.map((principle) => (
          <li key={principle} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-sm leading-6 text-[var(--color-muted-text)]">{principle}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
