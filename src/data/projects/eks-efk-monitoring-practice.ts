import { publicPath } from "@/utils/publicPath";
import { PATHS } from "@/constants/paths";
import type { ProjectCard } from "@/types/project";

export const eksEfkMonitoringPractice: ProjectCard = {
  slug: "eks-efk-monitoring-practice",
  title: "EKS 클러스터 배포 및 EFK 모니터링 구축",
  subtitle: "AWS EKS 기반 Kubernetes 운영, 로그 수집, 리소스 알림 실습 프로젝트",
  summary:
    "Amazon EKS에 nginx 웹 서비스를 배포하고, EFK 스택과 CloudWatch 기반 Slack 알림을 구성하며 Kubernetes 운영 기초를 학습한 인프라 실습 프로젝트",
  description:
    "AWS VPC와 EKS 클러스터를 구성하고, 프라이빗 서브넷의 워커 노드에 nginx 서비스를 배포했다. 이후 Fluentd, ElasticSearch, Kibana로 로그 수집 및 시각화 환경을 구성하고, CloudWatch, SNS, Lambda, KMS, Slack을 연동해 CPU 임계치 초과 알림을 수신하는 모니터링 흐름을 구축했다.",
  thumbnail: publicPath("/images/projects/eks-efk-monitoring/thumbnail.png"),
  category: ["infra"],
  type: "personal",
  status: "archived",
  period: "2022.07 - 2022.08",
  role: "EKS 클러스터 구성, nginx 배포, EFK 로깅 스택 구축, CloudWatch 기반 알림 연동",
  teamSize: "1명 (멘토 1명)",
  techStack: [
    { name: "Amazon EKS", category: "infra" },
    { name: "Kubernetes", category: "infra" },
    { name: "Fluentd", category: "observability" },
    { name: "ElasticSearch", category: "observability" },
    { name: "Kibana", category: "observability" },
    { name: "Amazon CloudWatch", category: "observability" },
    { name: "AWS Lambda", category: "infra" },
    { name: "Amazon SNS", category: "messaging" },
    { name: "AWS KMS", category: "infra" },
  ],
  links: {
    detail: PATHS.projectDetail("eks-efk-monitoring-practice"),
  },
};
