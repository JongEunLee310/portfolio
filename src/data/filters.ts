import type {
  ProjectFilterValue,
  ProjectPeriodFilterValue,
  ProjectTypeFilterValue,
  ProjectViewMode,
} from "@/types/project";
import type {
  NoteFilterValue,
  NoteSortValue,
  NoteViewMode,
} from "@/types/note";

export const projectCategoryFilters = [
  { label: "전체", value: "all" },
  { label: "서비스", value: "service" },
  { label: "인프라", value: "infra" },
  { label: "연구", value: "research" },
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
] as const satisfies readonly {
  label: string;
  value: ProjectTypeFilterValue;
}[];

export const projectSortOptions = [
  { label: "최신순", value: "latest" },
  { label: "대표 프로젝트순", value: "featured" },
  { label: "이름순", value: "name" },
] as const;

export const projectPeriodFilters = [
  { label: "전체", value: "all" },
  { label: "최근 6개월", value: "last6Months" },
  { label: "최근 1년", value: "last1Year" },
  { label: "1년 이상", value: "over1Year" },
] as const satisfies readonly {
  label: string;
  value: ProjectPeriodFilterValue;
}[];

export const projectViewModeOptions = [
  { label: "그리드 보기", value: "grid" },
  { label: "리스트 보기", value: "list" },
] as const satisfies readonly {
  label: string;
  value: ProjectViewMode;
}[];

export const projectSidebarContent = {
  title: "필터",
  categoryTitle: "카테고리",
  techTitle: "사용 기술",
  periodTitle: "기간",
  typeTitle: "협업 방식",
  moreLabel: "더 보기",
  lessLabel: "접기",
} as const;

export const projectListContent = {
  countPrefix: "총",
  countSuffix: "개의 프로젝트",
  sortAriaLabel: "프로젝트 정렬",
  previousPageLabel: "이전 페이지",
  nextPageLabel: "다음 페이지",
  detailLabel: "상세 보기",
  githubLabel: "GitHub",
} as const;

export const projectTechStackContent = {
  eyebrow: "TECH STACK",
  title: "기술 스택",
} as const;

export const noteCategoryFilters = [
  { label: "All", value: "all" },
  { label: "트러블슈팅", value: "troubleshooting" },
  { label: "아키텍처 분석", value: "architecture" },
  { label: "성능 분석", value: "performance" },
  { label: "개념 정리", value: "concept" },
  { label: "회고", value: "retrospective" },
] as const satisfies readonly {
  label: string;
  value: NoteFilterValue;
}[];

export const noteFilterContent = {
  ariaLabel: "기술 노트 필터",
  emptyTitle: "조건에 맞는 기술 노트가 없습니다",
  emptyDescription: "다른 필터를 선택해 기술 노트 목록을 다시 확인해 주세요.",
} as const;

export const noteSortOptions = [
  { label: "최신순", value: "latest" },
  { label: "읽는 시간순", value: "readingTime" },
] as const satisfies readonly {
  label: string;
  value: NoteSortValue;
}[];

export const noteViewModeOptions = [
  { label: "그리드 보기", value: "grid" },
  { label: "리스트 보기", value: "list" },
] as const satisfies readonly {
  label: string;
  value: NoteViewMode;
}[];

export const noteSidebarContent = {
  title: "필터",
  categoryTitle: "문서 유형",
  tagTitle: "기술 태그",
  projectTitle: "관련 프로젝트",
  moreLabel: "더 보기",
  lessLabel: "접기",
} as const;

export const noteListContent = {
  countPrefix: "총",
  countSuffix: "개의 문서",
  sortAriaLabel: "기술 노트 정렬",
  previousPageLabel: "이전 페이지",
  nextPageLabel: "다음 페이지",
  detailLabel: "문서 보기",
} as const;
