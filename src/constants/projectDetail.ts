export const PROJECT_DETAIL_LABELS = {
  emptyState: {
    title: "프로젝트를 찾을 수 없습니다",
    description: "요청한 프로젝트 slug와 연결된 상세 데이터가 없습니다.",
  },
  links: {
    github: "GitHub",
    demo: "Demo",
  },
  sections: {
    architecture: {
      eyebrow: "ARCHITECTURE",
    },
    features: {
      eyebrow: "FEATURES",
      title: "핵심 기능",
    },
    screenshots: {
      eyebrow: "SCREENS",
      title: "화면 구성",
    },
    metrics: {
      eyebrow: "METRICS",
      title: "성과 지표",
    },
    contributions: {
      eyebrow: "CONTRIBUTION",
      title: "주요 기여",
    },
    troubleshooting: {
      eyebrow: "TROUBLESHOOTING",
      title: "문제 해결",
      problem: "문제",
      solution: "해결",
      result: "결과",
    },
    retrospective: {
      learned: "배운 점",
      improvement: "개선 계획",
    },
  },
} as const;
