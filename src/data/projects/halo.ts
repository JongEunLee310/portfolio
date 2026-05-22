import { PATHS } from "@/constants/paths";
import type { ProjectCard } from "@/types/project";

export const halo: ProjectCard = {
  slug: "halo",
  title: "HALO 청소 서비스 매칭 플랫폼",
  subtitle: "Spring Boot 멀티모듈 기반 청소 서비스 예약·정산 백엔드",
  summary:
    "고객이 매니저에게 청소 서비스를 예약하고 결제·정산까지 처리하는 팀 프로젝트 백엔드. Monolithic에서 도메인 기반 멀티모듈로 전환하고, QueryDSL DTO 프로젝션·낙관적 락·멱등성 정산 등 실제 장애 경험을 문서화했다.",
  description:
    "JWT + OAuth2 인증, 역할별 FilterChain, 예약·매칭·체크인/아웃, 주간 자동 정산(Spring Scheduler), 낙관적 락 기반 통계 동시성 처리, QueryDSL Projections.fields() 기반 N+1 방지까지 구현한 청소 서비스 매칭 플랫폼 백엔드. common 2모듈 구조에서 도메인 기반 8모듈로 전환하는 과정에서 모듈 경계 설계, shared-domain Port 패턴, 조회 계층 분리를 직접 결정하고 ADR로 남겼다.",
  thumbnail: "/images/projects/halo/thumbnail.svg",
  category: ["backend"],
  type: "team",
  status: "featured",
  period: "2025.05 ~ 2025.07",
  role: "admin 서비스 풀스택 개발 · 인프라 설계 및 구성 · CI/CD 파이프라인 구성 · 로깅 스택 구성",
  teamSize: "4",
  techStack: [
    { name: "Java 17", category: "language" },
    { name: "Spring Boot 3.4.5", category: "backend" },
    { name: "Spring Data JPA", category: "backend" },
    { name: "QueryDSL", category: "backend" },
    { name: "Spring Security", category: "backend" },
    { name: "Spring Scheduler", category: "backend" },
    { name: "Spring Retry", category: "backend" },
    { name: "MySQL", category: "database" },
    { name: "AWS S3", category: "infra" },
    { name: "Prometheus", category: "observability" },
    { name: "Gradle Multi-Module", category: "tool" },
    { name: "JWT", category: "backend" },
    { name: "OAuth2 (Google)", category: "backend" },
  ],
  links: {
    detail: PATHS.projectDetail("halo"),
    github: "https://github.com/Kernel360/KBE5_HALO_BE",
  },
};
