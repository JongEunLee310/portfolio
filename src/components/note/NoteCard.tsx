import { Link } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { Badge } from "@/components/common/Badge";
import { TechTag } from "@/components/common/TechTag";
import type { TechnicalNoteCard } from "@/types/note";

type NoteCardProps = {
  note: TechnicalNoteCard;
};

export function NoteCard({ note }: NoteCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <img
        src={note.thumbnail}
        alt={`${note.title} 썸네일`}
        className="aspect-[16/8] w-full rounded-xl object-cover"
      />
      <div className="mt-4">
        <Badge>{note.category}</Badge>
        <h3 className="mt-3 text-lg font-bold text-slate-900">
          <Link to={PATHS.technicalNoteDetail(note.slug)}>{note.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {note.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.slice(0, 4).map((tag) => (
            <TechTag key={`${note.slug}-${tag.name}`} tag={tag} />
          ))}
        </div>
        <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
          <span>{note.date}</span>
          <span>{note.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
