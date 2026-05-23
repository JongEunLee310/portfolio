import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const kubernetesHpaClusterAutoscaler: TechnicalNoteCard = {
  slug: "kubernetes-hpa-cluster-autoscaler",
  title: "Kubernetes HPA와 Cluster Autoscaler 오토스케일링 구성",
  summary:
    "CPU 사용률 기반 HPA로 Pod를 확장하고 Cluster Autoscaler로 노드를 자동 증감하는 EKS 오토스케일링 구성 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/kubernetes-autoscaling.svg"),
  date: "2022.11.08",
  readingTime: "10분 읽기",
  tags: [
    { name: "Kubernetes", category: "infra" },
    { name: "AWS EKS", category: "infra" },
    { name: "HPA", category: "infra" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
};
