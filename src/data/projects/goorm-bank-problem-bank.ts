import { PATHS } from "@/constants/paths";
import type { ProjectCard } from "@/types/project";

export const goormBankProblemBank: ProjectCard = {
  slug: "goorm-bank-problem-bank",
  title: "문제 있는 은행장",
  subtitle: "자격증 기출 문제 공유 및 모의고사 서비스",
  summary: "국가기술자격시험 기출문제를 무작위로 풀이하고 정답률을 확인할 수 있는 문제은행 서비스",
  description:
    "시험기간에 급증하는 트래픽을 고려하여 AWS EKS 기반 클러스터, CI/CD, 로깅/모니터링, 오토스케일링을 적용한 자격증 기출문제 모의고사 서비스",
  thumbnail: "/images/projects/goorm-bank-thumbnail.png",
  category: ["infra"],
  type: "team",
  status: "archived",
  period: "2022.10 - 2022.11",
  role: "모니터링 및 로깅 서비스 구축, Amazon CloudWatch 구성, 로그 스토리지 구축 관리",
  teamSize: "7명",
  techStack: [
    { name: "Java", category: "language" },
    { name: "Spring Boot", category: "backend" },
    { name: "React", category: "frontend" },
    { name: "Amazon RDS for PostgreSQL", category: "database" },
    { name: "AWS EKS", category: "infra" },
    { name: "Kubernetes", category: "infra" },
    { name: "Jenkins", category: "devops" },
    { name: "Argo CD", category: "devops" },
    { name: "Amazon CloudWatch", category: "observability" },
    { name: "Amazon OpenSearch Service", category: "observability" },
    { name: "Fluent Bit", category: "observability" },
  ],
  links: {
    detail: PATHS.projectDetail("goorm-bank-problem-bank"),
    github: "https://github.com/Goorm3Team",
  },
};
