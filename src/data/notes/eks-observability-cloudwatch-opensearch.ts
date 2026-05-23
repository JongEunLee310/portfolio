import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const eksObservabilityCloudwatchOpensearch: TechnicalNoteCard = {
  slug: "eks-observability-cloudwatch-opensearch",
  title: "EKS 관측성 구성: CloudWatch와 OpenSearch 연동",
  summary:
    "AWS EKS 클러스터에서 CloudWatch 로그 그룹과 OpenSearch Dashboard를 연결해 관측성 파이프라인을 구성한 기록입니다.",
  category: "observability",
  thumbnail: publicPath("/images/notes/eks-observability.svg"),
  date: "2022.11.10",
  readingTime: "10분 읽기",
  tags: [
    { name: "AWS EKS", category: "infra" },
    { name: "Amazon CloudWatch", category: "observability" },
    { name: "Amazon OpenSearch Service", category: "observability" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
};
