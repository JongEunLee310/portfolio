import { publicPath } from "@/utils/publicPath";
import type { AboutData } from "@/types/about";
import { externalLinks } from "@/constants/externalLinks";

export const aboutData: AboutData = {
  profile: {
    name: "이종은",
    role: "백엔드 개발자",
    location: "대한민국, 서울",
    email: "whddms1208@gmail.com",
    experience: "백엔드 개발 1년+",
    avatar: publicPath("/images/profile/avatar.svg"),
    links: [
      { label: "Email", href: externalLinks.email, icon: "Mail" },
      { label: "GitHub", href: externalLinks.github, icon: "Github" },
      { label: "LinkedIn", href: externalLinks.linkedin, icon: "ExternalLink" },
      { label: "GitLab", href: externalLinks.gitlab, icon: "ExternalLink" },
    ],
    introduction: [
      "안녕하세요. 저는 데이터를 다루고, 시스템을 설계하고, 팀과 함께 문제를 해결하는 것을 좋아하는 백엔드 개발자입니다.",
      "복잡한 요구사항을 단순한 구조로 풀어내고, 운영까지 고려한 견고한 서비스를 만들기 위해 학습하고 실천합니다.",
    ],
  },
  sections: {
    profile: {
      id: "profile",
      eyebrow: "PROFILE",
      title: "이종은",
    },
    roles: {
      id: "roles",
      eyebrow: "WHAT I BUILD",
      title: "역할과 책임",
      description: "백엔드 설계부터 인프라 운영, AI 서비스 통합까지 책임지고 구현합니다.",
    },
    timeline: {
      id: "career-education",
      eyebrow: "CAREER & EDUCATION",
      title: "경력 및 교육",
      description: "프로젝트 경험과 학습 과정을 시간순으로 정리했습니다.",
    },
    techStack: {
      id: "tech-stack",
      eyebrow: "TECH STACK",
      title: "기술 스택",
      description: "백엔드, 데이터베이스, 인프라와 운영 관측 도구를 중심으로 학습하고 적용합니다.",
    },
    workStyle: {
      id: "working-style",
      eyebrow: "WORKING STYLE",
      title: "일하는 방식",
    },
    growthMetrics: {
      id: "growth-metrics",
      eyebrow: "GROWTH METRICS",
      title: "지표로 보는 성장",
    },
  },
  roles: [
    {
      title: "백엔드 API 설계",
      description: "REST API 설계부터 성능 최적화, 도메인 기반 멀티모듈 구조까지 구현합니다.",
      icon: "Server",
      tags: ["Spring Boot", "FastAPI", "Python"],
    },
    {
      title: "인프라 / DevOps",
      description: "AWS 기반 인프라 구성, Blue-Green 배포, GitHub Actions CI/CD를 운영합니다.",
      icon: "Cloud",
      tags: ["AWS", "Docker", "GitHub Actions"],
    },
    {
      title: "AI 서비스 통합",
      description: "LLM 기반 리뷰·분석 기능을 비동기 파이프라인과 연결해 서비스에 통합합니다.",
      icon: "Code2",
      tags: ["FastAPI", "Celery", "Python"],
    },
    {
      title: "데이터 모델링",
      description: "쿼리 최적화와 인덱스 설계로 데이터 접근 비용을 줄이는 구조를 만듭니다.",
      icon: "Database",
      tags: ["MySQL", "PostgreSQL", "QueryDSL"],
    },
  ],
  timeline: [
    {
      type: "project",
      badge: "개인 프로젝트",
      title: "AI Agent Pipeline Backend Design",
      organization: "개인 프로젝트",
      period: "2026.04 ~ 진행 중",
      description:
        "FastAPI 기반 Pipeline 실행 오케스트레이션과 AI 실패 분석 백엔드 설계.",
    },
    {
      type: "career",
      badge: "팀 프로젝트",
      title: "HaloCare 백엔드 및 인프라 구축",
      organization: "팀 프로젝트",
      period: "2025",
      description: "Spring Boot 멀티모듈 구조와 AWS 기반 Blue-Green 배포 흐름을 구현했습니다.",
    },
    {
      type: "education",
      title: "백엔드 시스템 설계 학습",
      organization: "개인 학습",
      period: "2025 - 현재",
      description: "API 설계, 데이터 모델링, 배포 자동화, 운영 관측을 중심으로 학습하고 적용합니다.",
    },
    {
      type: "bootcamp",
      badge: "완료",
      title: "프로젝트 기반 백엔드 개발 과정",
      organization: "팀 프로젝트 중심 교육",
      period: "2025",
      description: "요구사항 분석부터 구현, 배포, 회고까지 이어지는 백엔드 개발 흐름을 경험했습니다.",
    },
  ],
  workStyle: {
    quote: "좋은 코드는 혼자보다 함께 만들 때 더 단단해진다고 믿습니다.",
    principles: [
      "요구사항과 제약 조건을 먼저 정리합니다.",
      "테스트 가능한 구조를 선호합니다.",
      "성능 개선은 측정 결과를 근거로 진행합니다.",
    ],
  },
  growthMetrics: [
    {
      label: "대표 프로젝트",
      value: "4+",
      description: "백엔드/인프라 중심 프로젝트",
      icon: "Layers",
    },
    {
      label: "기여 기간",
      value: "1년+",
      description: "팀 및 개인 프로젝트",
      icon: "Calendar",
    },
    {
      label: "핵심 기술",
      value: "15+",
      description: "실무 적용 기술 수",
      icon: "Code2",
    },
    {
      label: "커밋 / PR",
      value: "200+",
      description: "GitHub 기준",
      icon: "Github",
    },
  ],
};
