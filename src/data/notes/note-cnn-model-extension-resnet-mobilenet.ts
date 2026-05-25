import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteCnnModelExtensionResnetMobilenet: TechnicalNoteCard = {
  slug: "note-cnn-model-extension-resnet-mobilenet",
  title: "ResNet/MobileNet 기반 CNN 모델 확장 설계",
  summary:
    "YOLOv3-tiny 중심 Mixed Precision 프레임워크를 VGG16, ResNet50, MobileNetV2로 확장하기 위해 residual block 구조를 분석한 노트입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2023.02",
  readingTime: "9분 읽기",
  tags: [
    { name: "CNN", category: "ai" },
    { name: "ResNet50", category: "ai" },
    { name: "MobileNetV2", category: "ai" },
    { name: "VGG16", category: "ai" },
    { name: "Mixed Precision", category: "ai" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
  cardSummary: {
    title: "ResNet/MobileNet 구조 확장 문제",
    problem: "YOLOv3-tiny 중심 초기 프레임워크는 residual block과 inverted residual block을 지원하지 못했다.",
    solution: "ResNet residual block과 MobileNetV2 bottleneck 구조를 분석하고 framework ver.0.2 확장 방향을 설계했다.",
    result: "VGG16, VGG19, ResNet50 동작 확인 및 MobileNet 지원 수정 작업으로 확장되었다.",
  },
};
