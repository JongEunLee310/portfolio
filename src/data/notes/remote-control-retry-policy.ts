import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const remoteControlRetryPolicy: TechnicalNoteCard = {
  slug: "remote-control-retry-policy",
  title: "원격 제어 실패 시 재시도 기준이 없어 제어 안정성이 떨어진 문제",
  summary:
    "스마트팜 모니터링 프로젝트에서 원격 제어 실패를 유형별로 구분하지 않으면 재시도해도 의미 없는 실패를 반복하거나, 재시도해야 할 일시적 실패를 그냥 종료하게 됩니다. 실패 원인 분류와 재시도 가능 여부 판단을 정책으로 묶어야 했던 설계 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/smart-farm-remote-control.svg"),
  date: "2024.10",
  readingTime: "14분 읽기",
  tags: [
    { name: "Retry Policy", category: "backend" },
    { name: "Failure Classification", category: "backend" },
    { name: "Control Safety", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "원격 제어 실패 유형 미분류로 인한 재시도 정책 부재",
    problem: "제어 실패를 유형 구분 없이 처리해 재시도 불가 실패를 반복하거나, 재시도로 회복 가능한 일시 실패를 바로 종료",
    solution: "실패를 일시적·영구적·장비 한계 초과로 분류하고 유형별 재시도 횟수와 간격을 정책으로 정의",
  },
};
