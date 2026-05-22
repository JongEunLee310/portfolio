import { PATHS } from "@/constants/paths";

export const pageHeroes = {
  home: {
    eyebrow: "안녕하세요, 백엔드 개발자 이종은입니다.",
    title: "문제를 관찰하고,\n구조를 개선하는 개발자",
    highlightedText: "개발자",
    description:
      "서비스의 기능 구현부터 시스템의 성능과 확장성, 운영까지 고려하며 더 나은 구조를 만드는 백엔드 개발자입니다.",
    primaryAction: {
      label: "프로젝트 보기",
      href: PATHS.projects,
    },
    secondaryAction: {
      label: "기술적 문제 해결 보기",
      href: PATHS.technicalNotes,
    },
    visual: "/images/hero/backend-architecture.svg",
  },
  projects: {
    eyebrow: "PROJECTS",
    title: "프로젝트",
    description:
      "실무와 개인 프로젝트를 통해 문제를 해결하고, 더 나은 구조와 가치를 만드는 서비스를 만들어왔습니다.",
    visual: {
      light: "/images/hero/project-hero-light.svg",
      dark: "/images/hero/project-hero-dark.svg",
    },
  },
  technicalNotes: {
    eyebrow: "TECHNICAL NOTES",
    title: "기술적 문제 해결 기록",
    description:
      "개발 과정에서 마주한 기술적 문제와 고민, 해결 과정과 배운 점을 기록합니다.",
    visual: {
      light: "/images/hero/notes-hero-light.svg",
      dark: "/images/hero/notes-hero-dark.svg",
    },
  },
  about: {
    eyebrow: "ABOUT",
    title: "문제를 관찰하고\n구조를 개선하는 백엔드 개발자",
    highlightedText: "백엔드 개발자",
    description:
      "시스템의 본질을 이해하고, 확장 가능하고 안정적인 백엔드 서비스를 설계·구현합니다.",
    primaryAction: {
      label: "프로젝트 보기",
      href: PATHS.projects,
    },
    secondaryAction: {
      label: "연락하기",
      href: PATHS.contact,
    },
    visual: {
      light: "/images/hero/about-hero-light.svg",
      dark: "/images/hero/about-hero-dark.svg",
    },
  },
  contact: {
    eyebrow: "CONTACT",
    title: "함께 만들고 싶은\n프로젝트가 있으신가요?",
    highlightedText: "있으신가요?",
    description:
      "새로운 아이디어부터 기술적 도전까지, 빠르게 이해하고 함께 고민하며 가치를 만들어갑니다.",
    visual: {
      light: "/images/hero/contact-hero-light.svg",
      dark: "/images/hero/contact-hero-dark.svg",
    },
  },
} as const;

export type HomeHeroCode = {
  filename: string;
  lines: string[];
};

export const homeHeroCode: HomeHeroCode = {
  filename: "pipeline/tasks.py",
  lines: [
    "# 파이프라인 비동기 실행 태스크",
    "@celery.task(bind=True, max_retries=3)",
    "def process_pipeline(self, job_id: str):",
    "    try:",
    "        result = pipeline.execute(job_id)",
    '        metrics.track("pipeline.done", job=job_id)',
    '        return {"status": "ok", "result": result}',
    "    except NetworkError as exc:",
    "        raise self.retry(exc=exc, countdown=60)",
  ],
};
