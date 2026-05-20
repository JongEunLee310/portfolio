import type { ProjectFilterValue } from "@/types/project";

export const projectCategoryFilters = [
  { label: "전체", value: "all" },
  { label: "백엔드", value: "backend" },
  { label: "인프라", value: "infra" },
  { label: "AI", value: "ai" },
  { label: "개인 프로젝트", value: "personal" },
] as const satisfies readonly {
  label: string;
  value: ProjectFilterValue;
}[];

export const projectFilterContent = {
  ariaLabel: "프로젝트 필터",
  emptyTitle: "조건에 맞는 프로젝트가 없습니다",
  emptyDescription: "다른 필터를 선택해 프로젝트 목록을 다시 확인해 주세요.",
} as const;

export const projectTypeFilters = [
  { label: "전체", value: "all" },
  { label: "개인 프로젝트", value: "personal" },
  { label: "팀 프로젝트", value: "team" },
] as const;

export const projectSortOptions = [
  { label: "최신순", value: "latest" },
  { label: "대표 프로젝트순", value: "featured" },
  { label: "이름순", value: "name" },
] as const;

export const noteCategoryFilters = [
  { label: "전체", value: "all" },
  { label: "성능 개선", value: "performance" },
  { label: "아키텍처", value: "architecture" },
  { label: "비동기 처리", value: "async" },
  { label: "DB", value: "database" },
  { label: "AWS", value: "aws" },
  { label: "모니터링", value: "observability" },
] as const;

export const noteSortOptions = [
  { label: "최신순", value: "latest" },
  { label: "추천순", value: "featured" },
  { label: "읽는 시간순", value: "readingTime" },
] as const;
