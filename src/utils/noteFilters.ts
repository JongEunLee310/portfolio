import type { NoteFilterValue, TechnicalNoteCard } from "@/types/note";

const noteFilterKeywords = {
  performance: ["performance", "성능"],
  database: ["database", "db", "mysql", "querydsl", "jpa", "redis", "sqlalchemy"],
  async: ["async", "비동기", "backgroundtasks", "celery", "event driven", "rabbitmq"],
  devops: ["devops", "aws", "infra", "alb", "cloudflare", "observability"],
  architecture: ["architecture", "msa", "event driven", "messaging"],
  troubleshooting: ["troubleshooting", "트러블슈팅", "cors", "alb", "502"],
} as const satisfies Record<Exclude<NoteFilterValue, "all">, readonly string[]>;

function createSearchText(note: TechnicalNoteCard) {
  return [
    note.category,
    note.title,
    note.summary,
    ...note.tags.flatMap((tag) => [tag.name, tag.category]),
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesNoteFilter(
  note: TechnicalNoteCard,
  selectedFilter: NoteFilterValue,
) {
  if (selectedFilter === "all") {
    return true;
  }

  const searchText = createSearchText(note);
  return noteFilterKeywords[selectedFilter].some((keyword) =>
    searchText.includes(keyword),
  );
}
