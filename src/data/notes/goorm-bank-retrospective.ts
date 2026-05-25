import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const goormBankRetrospective: TechnicalNoteCard = {
  slug: "goorm-bank-retrospective",
  title: "문제은행 서비스 개발 회고 — 문제 도메인·인증·Kubernetes 운영 전체 과정",
  summary:
    "국가기술자격시험 기출문제 서비스를 개발하면서 문제 도메인 복합 aggregate 설계, 네이버 OAuth 인증, Jenkins·Argo CD EKS 배포, Fluent Bit·CloudWatch·OpenSearch 로그 수집까지 확장된 전체 과정을 정리한 회고입니다.",
  category: "retrospective",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.26",
  readingTime: "13분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Kubernetes", category: "infra" },
    { name: "Jenkins", category: "tool" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
};
