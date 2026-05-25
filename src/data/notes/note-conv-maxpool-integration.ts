import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteConvMaxpoolIntegration: TechnicalNoteCard = {
  slug: "note-conv-maxpool-integration",
  title: "Conv-Maxpool 통합 실행으로 수행시간 감소",
  summary:
    "Conv layer 직후 Maxpool을 별도 실행하지 않고 통합 처리해 평균 5% 수행시간 감소를 달성한 실험 노트입니다.",
  category: "performance",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2022.12",
  readingTime: "8분 읽기",
  tags: [
    { name: "CNN", category: "ai" },
    { name: "YOLOv3-tiny", category: "ai" },
    { name: "C", category: "language" },
    { name: "Jetson Nano", category: "infra" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
  cardSummary: {
    title: "Conv-Maxpool 통합 후 검출 실패",
    problem: "Conv와 Maxpool을 통합 실행하면 수행시간은 감소했지만 detection이 되지 않는 문제가 남았다.",
    solution: "Conv layer의 output 크기 조정, maxpool layer skip, dequantize/activation 순서 조정 등을 검토했다.",
    result: "평균 5% 수행시간 감소는 확인했지만, 정확도 보존을 위해 후속 검증이 필요하다는 결론을 얻었다.",
  },
};
