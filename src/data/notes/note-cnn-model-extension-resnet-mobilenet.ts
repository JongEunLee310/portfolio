import type { TechnicalNoteCard } from "@/types/note";

export const noteCnnModelExtensionResnetMobilenet: TechnicalNoteCard = {
  slug: "note-cnn-model-extension-resnet-mobilenet",
  title: "ResNet/MobileNet 기반 CNN 모델 확장 설계",
  summary:
    "YOLOv3-tiny 중심 Mixed Precision 프레임워크를 VGG16, ResNet50, MobileNetV2로 확장하기 위해 residual block 구조를 분석한 노트입니다.",
  category: "architecture",
  thumbnail: "/images/notes/db-round-trip.svg",
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
};
