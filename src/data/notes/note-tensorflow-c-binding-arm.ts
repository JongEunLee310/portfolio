import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteTensorflowCBindingArm: TechnicalNoteCard = {
  slug: "note-tensorflow-c-binding-arm",
  title: "TensorFlow C Binding ARM 빌드 환경 구성",
  summary:
    "Jetson Nano ARM 환경에서 TensorFlow C API를 Bazel로 빌드하고 C/C++ 기반 quantization 모듈을 호출하는 환경을 구성한 노트입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2022.05",
  readingTime: "10분 읽기",
  tags: [
    { name: "TensorFlow C API", category: "ai" },
    { name: "ARM64", category: "infra" },
    { name: "Jetson Nano", category: "infra" },
    { name: "Bazel", category: "tool" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
  cardSummary: {
    title: "TensorFlow C Binding ARM 빌드 문제",
    problem: "TensorFlow 공식 C library가 x86 중심으로 제공되어 Jetson Nano ARM 환경에서 -ltensorflow를 찾지 못하거나 incompatible library 문제가 발생했다.",
    solution: "ARM Ubuntu 18.04 환경에서 TensorFlow C binding을 직접 빌드하고 링커 환경을 구성했다.",
    result: "C/C++에서 TensorFlow library 호출 가능성을 검증했고 quantization 모듈을 사용할 기반을 확보했다.",
  },
};
