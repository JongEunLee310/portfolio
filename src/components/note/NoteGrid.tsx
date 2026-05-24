import { NoteCard } from "./NoteCard";
import type { NoteViewMode, TechnicalNoteCard } from "@/types/note";

type NoteGridProps = {
  notes: TechnicalNoteCard[];
  viewMode?: NoteViewMode;
};

export function NoteGrid({ notes, viewMode = "grid" }: NoteGridProps) {
  return (
    <div
      className={
        viewMode === "list"
          ? "grid min-w-0 grid-cols-1 gap-5"
          : "grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      }
    >
      {notes.map((note) => (
        <NoteCard key={note.slug} note={note} variant={viewMode} />
      ))}
    </div>
  );
}
