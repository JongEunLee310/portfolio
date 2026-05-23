import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { Badge } from "@/components/common/Badge";
import { TechTag } from "@/components/common/TechTag";
import type { TechnicalNoteCard } from "@/types/note";

type NoteCardProps = {
  note: TechnicalNoteCard;
  labels: {
    detailLabel: string;
  };
  variant?: "grid" | "list";
};

export function NoteCard({ note, labels, variant = "grid" }: NoteCardProps) {
  const isList = variant === "list";

  return (
    <article
      className={`group w-full min-w-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        isList ? "md:flex" : ""
      }`}
    >
      <div
        className={`w-full min-w-0 max-w-full p-4 ${
          isList ? "md:w-64 md:shrink-0" : ""
        }`}
      >
        <div className="aspect-[16/10] w-full max-w-full overflow-hidden rounded-lg bg-[var(--color-surface-muted)]">
          <img
            src={note.thumbnail}
            alt={`${note.title} 썸네일`}
            className="block h-full w-full max-w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-4 pb-4">
        <Badge>{note.category}</Badge>
        <h3 className="mt-3 break-words text-xl font-bold leading-snug text-[var(--color-page-text)]">
          <Link to={PATHS.technicalNoteDetail(note.slug)}>{note.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-2 min-h-12 break-words text-sm leading-6 text-[var(--color-muted-text)]">
          {note.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {note.tags.slice(0, 6).map((tag) => (
            <TechTag key={`${note.slug}-${tag.name}`} tag={tag} />
          ))}
        </div>
        <div className="mt-auto pt-6">
          <div className="flex items-center gap-4 text-xs text-[var(--color-muted-text)]">
            <span>{note.date}</span>
            <span>{note.readingTime}</span>
          </div>
          <Link
            to={PATHS.technicalNoteDetail(note.slug)}
            className="mt-4 inline-flex h-10 w-full max-w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            {labels.detailLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
