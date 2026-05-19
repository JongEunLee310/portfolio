import { NoteCard } from "./NoteCard";
import type { TechnicalNoteCard } from "@/types/note";

type NoteGridProps = {
  notes: TechnicalNoteCard[];
};

export function NoteGrid({ notes }: NoteGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.slug} note={note} />
      ))}
    </div>
  );
}
