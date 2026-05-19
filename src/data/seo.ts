import { PATHS } from "@/constants/paths";

export const seoConfig = {
  [PATHS.home]: {
    title: "이종은 | 백엔드 개발자 포트폴리오",
    description:
      "문제를 관찰하고 구조를 개선하는 백엔드 개발자 이종은의 포트폴리오입니다.",
  },
  [PATHS.projects]: {
    title: "Projects | 이종은 포트폴리오",
    description: "백엔드, 인프라, AI 프로젝트를 통해 문제를 해결한 기록입니다.",
  },
  [PATHS.technicalNotes]: {
    title: "Technical Notes | 이종은 포트폴리오",
    description: "성능 개선, 아키텍처, DB, AWS, 모니터링 문제 해결 기록입니다.",
  },
  [PATHS.about]: {
    title: "About | 이종은 포트폴리오",
    description: "백엔드 개발자 이종은의 소개, 기술 스택, 일하는 방식입니다.",
  },
  [PATHS.contact]: {
    title: "Contact | 이종은 포트폴리오",
    description: "프로젝트 협업, 기술 문의, 채용 관련 연락 페이지입니다.",
  },
} as const;
