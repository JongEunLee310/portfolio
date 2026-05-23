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
};
