import { Pagination } from "@/components/common/Pagination";

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
  return (
    <Pagination
      content={content}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
