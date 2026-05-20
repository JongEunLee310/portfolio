import type { IconName } from "@/types/common";

export type Highlight = {
  icon: IconName;
  title: string;
  description: string;
};

export const highlights: Highlight[] = [
  {
    icon: "Gauge",
    title: "성능 개선",
    description:
      "DB Round-trip 감소와 쿼리 최적화를 통해 API 응답 시간을 개선합니다.",
  },
  {
    icon: "Workflow",
    title: "비동기 아키텍처",
    description:
      "동기 파이프라인을 Celery 기반 비동기 구조로 전환해 응답 지연과 커넥션 점유를 해소합니다.",
  },
  {
    icon: "Cloud",
    title: "인프라 & DevOps",
    description:
      "AWS Blue-Green 배포와 GitHub Actions CI/CD로 무중단 배포 자동화를 구현합니다.",
  },
  {
    icon: "Layers",
    title: "문제 해결",
    description:
      "ALB+CORS 트러블슈팅 등 실환경 문제를 계층별로 추적하고 근본 원인을 해결합니다.",
  },
];
