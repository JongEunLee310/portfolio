import type { TechnicalNoteCard } from "@/types/note";

export const noteTensorflowCBindingArm: TechnicalNoteCard = {
  slug: "note-tensorflow-c-binding-arm",
  title: "TensorFlow C Binding ARM 빌드 환경 구성",
  summary:
    "Jetson Nano ARM 환경에서 TensorFlow C API를 Bazel로 빌드하고 C/C++ 기반 quantization 모듈을 호출하는 환경을 구성한 노트입니다.",
  category: "troubleshooting",
  thumbnail: "/images/notes/db-round-trip.svg",
  date: "2022.05",
  readingTime: "10분 읽기",
  tags: [
    { name: "TensorFlow C API", category: "ai" },
    { name: "ARM64", category: "infra" },
    { name: "Jetson Nano", category: "infra" },
    { name: "Bazel", category: "tool" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
};
