import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteIm2colGemmBottleneck: TechnicalNoteCard = {
  slug: "note-im2col-gemm-bottleneck",
  title: "im2col/GEMM 연산 병목 분석 실험",
  summary:
    "Convolution layer의 핵심 연산인 im2col과 GEMM의 계산량과 구조적 제약을 실험적으로 검증한 노트입니다.",
  category: "performance",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2021.10",
  readingTime: "9분 읽기",
  tags: [
    { name: "CNN", category: "ai" },
    { name: "im2col", category: "ai" },
    { name: "GEMM", category: "ai" },
    { name: "C", category: "language" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
  cardSummary: {
    title: "im2col/GEMM 파라미터 감소 시 segmentation fault",
    problem: "stride, channel, kernel size를 임의로 조정하면 layer output 크기와 memory allocation이 맞지 않아 segmentation fault가 발생했다.",
    solution: "임의 조정보다 letterbox 영역과 network input size를 기준으로 계산량을 줄이는 방향을 검토했다.",
    result: "convolution 연산 최적화는 network 구조와 memory allocation을 함께 고려해야 한다는 결론을 얻었다.",
  },
};
