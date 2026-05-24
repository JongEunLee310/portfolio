import { Pagination } from "@/components/common/Pagination";

type ProjectPaginationProps = {
  content: {
    previousPageLabel: string;
    nextPageLabel: string;
  };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function ProjectPagination({
  content,
  currentPage,
  totalPages,
  onPageChange,
}: ProjectPaginationProps) {
  return (
    <Pagination
      content={content}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
