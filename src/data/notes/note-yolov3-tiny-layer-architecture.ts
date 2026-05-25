import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteYolov3TinyLayerArchitecture: TechnicalNoteCard = {
  slug: "note-yolov3-tiny-layer-architecture",
  title: "YOLOv3-tiny Layer 구조 분석",
  summary:
    "Convolutional, Maxpool, Route, Upsample, YOLO layer의 역할과 detection 흐름을 코드 수준에서 분석한 노트입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2021.08",
  readingTime: "10분 읽기",
  tags: [
    { name: "YOLOv3-tiny", category: "ai" },
    { name: "CNN", category: "ai" },
    { name: "darknet", category: "tool" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
  cardSummary: {
    title: "NVDLA 환경에서 YOLOv3 실행 제약",
    problem: "NVDLA compiler는 prototxt와 caffemodel을 사용하지만 기존 YOLOv3는 cfg와 weights 파일을 사용해 바로 실행할 수 없었다.",
    solution: "AlexNet 예제를 먼저 실행하고 YOLOv3-tiny를 caffemodel/prototxt로 변환하는 방법을 조사했다.",
    result: "NVDLA 환경의 제약을 확인하고 이후 Darknet 기반 YOLOv3-tiny 코드 분석으로 방향을 전환했다.",
  },
};
