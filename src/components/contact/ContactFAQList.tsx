import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FAQItem } from "@/types/contact";

type ContactFAQListProps = {
  items: FAQItem[];
};

export function ContactFAQList({ items }: ContactFAQListProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    items[0]?.question ?? null,
  );

  return (
    <div className="flex flex-col divide-y divide-slate-200">
      {items.map((item) => (
        <div key={item.question}>
          <h3>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-slate-900"
              aria-expanded={openQuestion === item.question}
              onClick={() =>
                setOpenQuestion((current) =>
                  current === item.question ? null : item.question,
                )
              }
            >
              <span>{item.question}</span>
              <ChevronDown
                className={[
                  "h-5 w-5 shrink-0 text-blue-600 transition-transform",
                  openQuestion === item.question ? "rotate-180" : "",
                ].join(" ")}
                aria-hidden="true"
              />
            </button>
          </h3>
          {openQuestion === item.question ? (
            <p className="mt-1 pb-4 text-sm leading-6 text-slate-600">
              {item.answer}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
