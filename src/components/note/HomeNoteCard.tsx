import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { PATHS } from "@/constants/paths";
import { surface } from "@/styles/classNames";
import type { TechnicalNoteCard } from "@/types/note";

type HomeNoteCardProps = {
  note: TechnicalNoteCard;
  index: number;
};

export function HomeNoteCard({ note, index }: HomeNoteCardProps) {
  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <article className={`${surface.darkCard} w-72 shrink-0 p-5`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs font-semibold text-[var(--color-muted-text)]">
          {displayIndex}
        </span>
        <Badge variant="dark">{note.category}</Badge>
      </div>
      <h3 className="mt-5">
        <Link
          to={PATHS.technicalNoteDetail(note.slug)}
          className="text-base font-bold leading-6 text-[var(--color-page-text)] transition hover:text-blue-500"
        >
          {note.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--color-muted-text)]">
        {note.summary}
      </p>
      <p className="mt-5 text-xs font-medium text-[var(--color-muted-text)]">{note.date}</p>
    </article>
  );
}
