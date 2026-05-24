import { publicPath } from "@/utils/publicPath";
import { PATHS } from "@/constants/paths";
import type { ProjectCard } from "@/types/project";

export const armEmbeddedCnnMixedPrecision: ProjectCard = {
  slug: "arm-embedded-cnn-mixed-precision",
  title: "ARM 기반 CNN 경량화 및 Mixed Precision 연구",
  subtitle:
    "YOLOv3-tiny와 CNN 모델을 대상으로 FP32·FP16·INT8 정밀도 조합, 양자화, im2col/GEMM 계산량 최적화를 실험한 학부연구생 연구 프로젝트",
  summary:
    "ARM 기반 임베디드 환경에서 CNN 추론을 경량화하기 위해 YOLOv3-tiny를 중심으로 Mixed Precision Framework를 구현하고, INT8 양자화, FP16 컴파일, overflow 분석, convolution 연산 병목 개선, 다양한 CNN 모델 확장을 실험한 연구 프로젝트",
  description:
    "학부연구생으로 ARM 기반 임베디드 환경에서 CNN 추론 경량화를 위한 연구를 수행했다. 초기에는 NVDLA, RISC-V VP, Docker 기반 개발 환경과 YOLOv3-tiny 네트워크 구조를 분석했고, AlexeyAB/darknet(`darknet` 디렉토리)에서 letterbox 입력 크기 조정, 인접 픽셀 유사도 기반 im2col/GEMM 연산 생략 아이디어를 실험했다. 이후 같은 코드베이스(`darknet2`)에서 `layer` 구조체에 `fp32/fp16/int8` 필드를 추가하고, `parser.c`에서 cfg 플래그를 파싱하며, `load_weights_upto_detect`(ftell/fseek 기반 file pointer 동기화)와 `gemm_fp16`/`gemm_int` 함수를 직접 작성해 Mixed Precision 분기 시스템을 프로토타입으로 구현했다. 최종적으로 AlexeyAB/yolo2_light(INT8 quantization 구현 포함)를 포크한 `yolov3_mixed`에 이 설계를 통합하고, 레이어 분기 조건을 인덱스 기반에서 플래그 기반으로 전환해 완성했다. TensorFlow C binding, ARM Compiler, INT8 overflow 분석, Conv-Maxpool 통합 실행, 정밀도별 실행시간 비교까지 확장했고, 후속 단계에서는 VGG16, VGG19, ResNet50, MobileNet 등으로 프레임워크 적용 범위를 넓히고 CIFAR-10 및 Mini ImageNet 기반 실험을 준비했다.",
  thumbnail: publicPath("/images/projects/arm-embedded-cnn-mixed-precision-thumb.png"),
  category: "research",
  type: "personal",
  status: "archived",
  period: "2021.07 - 2023.02",
  role: "학부연구생 / AlexeyAB/yolo2_light 기반 cfg-플래그 주도 Mixed Precision 분기 시스템 구현, INT8 quantization 분석 및 실행시간 측정",
  teamSize: "1명 (지도교수 1명)",
  techStack: [
    { name: "C", category: "language" },
    { name: "C++", category: "language" },
    { name: "Python", category: "language" },
    { name: "YOLOv3-tiny", category: "ai" },
    { name: "CNN", category: "ai" },
    { name: "Mixed Precision", category: "ai" },
    { name: "INT8 Quantization", category: "ai" },
    { name: "FP16", category: "ai" },
    { name: "TensorFlow C API", category: "ai" },
    { name: "Jetson Nano", category: "infra" },
    { name: "ARM64", category: "infra" },
    { name: "ARM Compiler", category: "tool" },
    { name: "GCC", category: "tool" },
  ],
  links: {
    detail: PATHS.projectDetail("arm-embedded-cnn-mixed-precision"),
  },
};
