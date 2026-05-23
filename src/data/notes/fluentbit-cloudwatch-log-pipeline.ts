import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const fluentbitCloudwatchLogPipeline: TechnicalNoteCard = {
  slug: "fluentbit-cloudwatch-log-pipeline",
  title: "Fluent Bit → CloudWatch 로그 수집 파이프라인 구성",
  summary:
    "EKS DaemonSet으로 배포한 Fluent Bit에서 CloudWatch 로그 그룹으로 애플리케이션 로그를 전달하는 파이프라인 구성 기록입니다.",
  category: "observability",
  thumbnail: publicPath("/images/notes/fluentbit-pipeline.svg"),
  date: "2022.11.05",
  readingTime: "8분 읽기",
  tags: [
    { name: "Fluent Bit", category: "observability" },
    { name: "Amazon CloudWatch", category: "observability" },
    { name: "Kubernetes", category: "infra" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
};
