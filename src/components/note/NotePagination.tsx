import { ChevronLeft, ChevronRight } from "lucide-react";

type NotePaginationProps = {
  content: {
    previousPageLabel: string;
    nextPageLabel: string;
  };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function NotePagination({
  content,
  currentPage,
  totalPages,
  onPageChange,
}: NotePaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-8 flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-blue-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={content.previousPageLabel}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition ${
              currentPage === page
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-blue-400 hover:text-white"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-blue-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={content.nextPageLabel}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
