import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  content: {
    previousPageLabel: string;
    nextPageLabel: string;
  };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visiblePageCount?: number;
};

function getVisiblePages(
  currentPage: number,
  totalPages: number,
  visiblePageCount: number,
) {
  const safeVisiblePageCount = Math.max(1, visiblePageCount);
  const pageCount = Math.min(totalPages, safeVisiblePageCount);
  const offset = Math.floor(pageCount / 2);
  const maxStartPage = Math.max(1, totalPages - pageCount + 1);
  const startPage = Math.min(
    Math.max(1, currentPage - offset),
    maxStartPage,
  );

  return Array.from({ length: pageCount }, (_, index) => startPage + index);
}

export function Pagination({
  content,
  currentPage,
  totalPages,
  onPageChange,
  visiblePageCount = 5,
}: PaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages, visiblePageCount);

  return (
    <nav className="mt-8 flex justify-center" aria-label="pagination">
      <div className="flex max-w-full items-center gap-2 overflow-x-auto px-1 py-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-page-text)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={content.previousPageLabel}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            aria-label={`${page} 페이지`}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition ${
              currentPage === page
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-page-text)]"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-page-text)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={content.nextPageLabel}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
