import type { NoteFilterValue, TechnicalNoteCard } from "@/types/note";

export function matchesNoteFilter(
  note: TechnicalNoteCard,
  selectedFilter: NoteFilterValue,
) {
  if (selectedFilter === "all") return true;
  return note.category === selectedFilter;
}
