export const NOTE_DETAIL_LABELS = {
  emptyState: {
    title: "기술 노트를 찾을 수 없습니다",
    description: "요청한 기술 노트 slug와 연결된 상세 데이터가 없습니다.",
  },
  hero: {
    tags: "태그",
  },
  toc: {
    title: "목차",
  },
  sections: {
    summary: "요약",
    relatedProjects: "관련 프로젝트",
    relatedNotes: "관련 기술 노트",
  },
  metrics: {
    before: "Before",
    after: "After",
    change: "Change",
  },
  links: {
    projectDetail: "프로젝트 보기",
    noteDetail: "기술 노트 보기",
  },
} as const;
