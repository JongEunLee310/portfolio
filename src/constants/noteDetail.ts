export const NOTE_DETAIL_LABELS = {
  emptyState: {
    title: "기술 노트를 찾을 수 없습니다",
    description: "요청한 기술 노트 slug와 연결된 상세 데이터가 없습니다.",
  },
  hero: {
    tags: "태그",
    breadcrumbRoot: "Technical Notes",
    breadcrumbCurrent: "문제 해결 기록",
    authorLabel: "작성자",
    visualTitle: "문서 흐름",
    visualDescription: "문제, 원인, 개선, 결과를 한 번에 추적합니다.",
  },
  toc: {
    title: "목차",
  },
  sidebar: {
    techStack: "이 글에서 다루는 기술",
    relatedNotes: "관련 글",
  },
  sections: {
    summary: "요약",
    relatedProjects: "관련 프로젝트",
    relatedNotes: "관련 기술 노트",
    moreNotes: "더 많은 기술 노트",
  },
  metrics: {
    before: "Before",
    after: "After",
    change: "Change",
  },
  links: {
    projectDetail: "프로젝트 보기",
    noteDetail: "기술 노트 보기",
    allNotes: "모든 Technical Notes 보기",
  },
} as const;

export const NOTE_DETAIL_TEMPLATES = {
  troubleshooting: {
    name: "troubleshooting",
    label: "트러블슈팅",
    sections: [
      { id: "problem", tocTitle: "문제 상황", headingTitle: "1. 문제 상황" },
      { id: "root-cause", tocTitle: "원인 분석", headingTitle: "2. 원인 분석" },
      { id: "solution", tocTitle: "개선 방법", headingTitle: "3. 개선 방법" },
      {
        id: "query-flow",
        tocTitle: "아키텍처 및 쿼리 예시",
        headingTitle: "4. 아키텍처 및 쿼리 예시",
      },
      { id: "performance", tocTitle: "성능 비교", headingTitle: "5. 성능 비교" },
      { id: "result", tocTitle: "적용 후 결과", headingTitle: "6. 적용 후 결과" },
      { id: "lesson", tocTitle: "배운 점", headingTitle: "7. 배운 점" },
    ],
  },
  retrospective: {
    name: "retrospective",
    label: "회고",
    sections: [
      { id: "context", tocTitle: "프로젝트 맥락", headingTitle: "1. 프로젝트 맥락" },
      { id: "role", tocTitle: "내가 맡은 역할", headingTitle: "2. 내가 맡은 역할" },
      { id: "worked", tocTitle: "잘한 점", headingTitle: "3. 잘한 점" },
      { id: "missed", tocTitle: "아쉬운 점", headingTitle: "4. 아쉬운 점" },
      { id: "learned", tocTitle: "배운 점", headingTitle: "5. 배운 점" },
      {
        id: "improvement",
        tocTitle: "다음 개선 방향",
        headingTitle: "6. 다음 개선 방향",
      },
    ],
  },
  "technical-summary": {
    name: "technical-summary",
    label: "기술 정리",
    sections: [
      { id: "background", tocTitle: "배경", headingTitle: "1. 배경" },
      { id: "concept", tocTitle: "핵심 개념", headingTitle: "2. 핵심 개념" },
      { id: "reason", tocTitle: "사용 이유", headingTitle: "3. 사용 이유" },
      { id: "application", tocTitle: "적용 방식", headingTitle: "4. 적용 방식" },
      { id: "caution", tocTitle: "주의점", headingTitle: "5. 주의점" },
      { id: "example", tocTitle: "예시 코드", headingTitle: "6. 예시 코드" },
      { id: "summary", tocTitle: "정리", headingTitle: "7. 정리" },
    ],
  },
} as const;

export const TROUBLESHOOTING_NOTE_TEMPLATE =
  NOTE_DETAIL_TEMPLATES.troubleshooting;
