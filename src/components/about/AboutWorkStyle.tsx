import { Check } from "lucide-react";
import type { WorkStyle } from "@/types/about";

type AboutWorkStyleProps = {
  workStyle: WorkStyle;
};

export function AboutWorkStyle({ workStyle }: AboutWorkStyleProps) {
  return (
    <div>
      <div>
        <span className="text-6xl font-bold leading-none text-blue-600">"</span>
        <blockquote className="mt-2 text-2xl font-semibold leading-snug text-slate-900">
          {workStyle.quote}
        </blockquote>
      </div>
      <ul className="mt-8 flex flex-col gap-3">
        {workStyle.principles.map((principle) => (
          <li key={principle} className="flex items-start gap-3">
            <Check
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              aria-hidden="true"
            />
            <span className="text-sm leading-6 text-slate-700">{principle}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
