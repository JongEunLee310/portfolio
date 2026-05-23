import type { ProjectDetail } from "@/types/project";
import { armEmbeddedCnnMixedPrecision } from "../projects/arm-embedded-cnn-mixed-precision";

export const armEmbeddedCnnMixedPrecisionDetail: ProjectDetail = {
  ...armEmbeddedCnnMixedPrecision,
  heroImage: "/images/projects/arm-embedded-cnn-mixed-precision-hero.png",
  heroHighlights: [
    { label: "연구 활동 기간", value: "2021.07 ~ 2023.02", icon: "Calendar" },
    { label: "지원 정밀도", value: "FP32 / FP16 / INT8", icon: "Cpu" },
    { label: "대상 모델", value: "YOLOv3-tiny 외 CNN 4종+", icon: "Brain" },
    { label: "GCC INT8 개선", value: "35% faster", icon: "Gauge" },
    { label: "Conv-Maxpool 개선", value: "평균 5% 감소", icon: "Layers" },
    { label: "VGG16 Baseline", value: "88.08% test acc", icon: "BarChart" },
  ],
  overview:
    "ARM 기반 임베디드 시스템에서 CNN 추론을 효율화하기 위해 YOLOv3-tiny와 여러 CNN 모델을 대상으로 경량화 및 Mixed Precision 적용 가능성을 연구한 프로젝트이다. 초기에는 NVDLA, RISC-V VP, Docker 기반 환경을 구성하며 임베디드 AI 실행 환경을 탐색했고, 이후 YOLOv3-tiny의 convolutional, maxpool, route, upsample, yolo layer 구조를 분석했다. 이를 바탕으로 im2col/GEMM 연산 병목, letterbox 영역 계산, 인접 픽셀 유사도 기반 계산량 감소 실험을 진행했으며, 단순 계산 생략이 정확도 손실로 이어질 수 있음을 확인했다. 이후 방향을 레이어별 정밀도 조합으로 전환하여 FP32, FP16, INT8 weight와 연산 경로를 선택할 수 있는 Mixed Precision Framework를 구현했다. Jetson Nano 환경에서 TensorFlow C binding, ARM Compiler 기반 FP16, INT8 quantization, overflow 분석, Conv-Maxpool 통합 실행, 정밀도별 실행시간 비교를 수행했고, 후속 단계에서는 VGG16, VGG19, ResNet50, MobileNet으로 프레임워크 확장을 준비했다.",
  problem: {
    title:
      "ARM 임베디드 환경에서 CNN 추론을 경량화하려면 연산 병목, 정밀도, 모델 구조를 함께 다뤄야 했다",
    items: [
      "Jetson Nano와 같은 ARM 기반 장비는 연산 성능과 메모리 자원이 제한적이므로 FP32 기반 CNN 추론이 비효율적이었다.",
      "CNN 추론 경량화를 위해서는 YOLOv3-tiny의 convolutional, maxpool, route, upsample, yolo layer 구조 이해가 선행되어야 했다.",
      "im2col과 GEMM은 계산량이 크지만 stride, channel, kernel size를 임의로 줄이면 segmentation fault나 detection 실패가 발생했다.",
      "Letterbox 영역 제거, 입력 크기 조정, 인접 픽셀 평균화 방식은 실행시간 감소 가능성이 있었지만 detection 결과 저하를 유발했다.",
      "INT8로 image와 weight를 단순 변환하면 정보 손실과 overflow 문제가 발생했다.",
      "YOLO layer의 bbox, objectness, probability 계산은 float 기반이어서 전체 INT8 전환이 어려웠다.",
      "TensorFlow C binding과 FP16을 ARM C/C++ 환경에서 사용하기 위해 별도 빌드와 toolchain 구성이 필요했다.",
      "YOLOv3-tiny 중심 초기 프레임워크는 ResNet residual block, MobileNetV2 inverted residual block 구조를 바로 지원하지 못했다.",
    ],
  },
  solution: {
    title:
      "darknet → darknet2 → yolov3_mixed 순으로 코드베이스를 전환하며 Mixed Precision 분기 시스템을 설계하고 완성했다",
    items: [
      "WSL2, Docker, NVDLA, RISC-V VP, Jetson Nano 환경을 구성하며 임베디드 AI 실행 환경을 탐색했다.",
      "YOLOv3-tiny layer 구조와 detection 흐름을 분석하고, im2col/GEMM 연산 병목을 실험적으로 검증했다.",
      "AlexeyAB/darknet(darknet 디렉토리)에서 letterbox 크기 조정, 인접 픽셀 유사도 기반 im2col/GEMM 계산 생략을 실험했으나 정확도 손실로 폐기했다.",
      "같은 코드베이스(darknet2 디렉토리)에서 layer 구조체에 fp32/fp16/int8 필드를 추가하고, parse_convolutional cfg 파싱, gemm_fp16/gemm_int 함수, load_weights_upto_detect(ftell/fseek 동기화)를 직접 작성해 Mixed Precision 시스템을 프로토타입으로 구현했다.",
      "AlexeyAB/yolo2_light(INT8 quantization 포함)를 포크한 yolov3_mixed에 darknet2 설계를 통합하고, 레이어 분기 조건을 인덱스 기반에서 cfg 플래그 기반으로 전환해 완성했다.",
      "TensorFlow C binding과 ARM Compiler를 구성해 C/C++ 기반 quantization 및 FP16 컴파일 환경을 검증했다.",
      "INT8 overflow 비율을 분석하고 int16/int24 저장 타입 및 Conv-Maxpool 통합 실행을 개선 방향으로 도출했다.",
      "VGG16, VGG19, ResNet50, MobileNet으로 실험 대상을 확장하기 위해 residual block과 bottleneck 구조를 검토했다.",
    ],
  },
  architecture: {
    title: "ARM Embedded CNN Mixed Precision Experiment Architecture",
    description:
      "임베디드 AI 실행 환경, YOLO 구조 분석, im2col/GEMM 병목 실험, cfg 기반 precision 설정, multi weight loading, quantize/dequantize runtime, mixed precision forwarding, 모델 확장 계층으로 구성된 연구 실험 프레임워크",
    nodes: [
      {
        id: "embedded-ai-environment",
        title: "Embedded AI Environment",
        items: ["WSL2", "Docker", "NVDLA", "RISC-V VP", "Jetson Nano"],
        icon: "Server",
      },
      {
        id: "network-analyzer",
        title: "Network Structure Analyzer",
        items: [
          "YOLOv3-tiny",
          "Convolutional layer",
          "Route layer",
          "YOLO layer",
        ],
        icon: "Network",
      },
      {
        id: "bottleneck-analyzer",
        title: "Computation Bottleneck Analyzer",
        items: ["im2col", "GEMM", "letterbox", "neighbor pixel similarity"],
        icon: "Activity",
      },
      {
        id: "precision-config",
        title: "Precision Config",
        items: [
          "YOLOv3-tiny cfg",
          "fp32 / fp16 / int8",
          "quantize / dequantize option",
        ],
        icon: "Sliders",
      },
      {
        id: "weight-loader",
        title: "Weight Loader",
        items: [
          "FP32 weight",
          "FP16 weight",
          "INT8 weight",
          "file pointer sync",
        ],
        icon: "Database",
      },
      {
        id: "quantization-runtime",
        title: "Quantization Runtime",
        items: [
          "scale factor",
          "affine mapping",
          "TensorFlow quantization",
          "dequantize output",
        ],
        icon: "Repeat",
      },
      {
        id: "mixed-forwarding",
        title: "Mixed Precision Forwarding",
        items: [
          "Conv forwarding",
          "Conv-Maxpool integration",
          "YOLO layer float output",
        ],
        icon: "Cpu",
      },
      {
        id: "model-extension",
        title: "Model Extension Layer",
        items: ["VGG16", "VGG19", "ResNet50", "MobileNetV2"],
        icon: "Boxes",
      },
      {
        id: "experiment-metrics",
        title: "Experiment Metrics",
        items: ["runtime", "accuracy", "memory", "confusion matrix"],
        icon: "BarChart",
      },
    ],
  },
  architectureFlow: {
    title: "ARM Embedded CNN Mixed Precision 실험 플로우",
    description:
      "입력 이미지와 cfg 설정을 기반으로 layer별 정밀도를 선택하고, 필요한 경우 quantize/dequantize를 수행하며 YOLOv3-tiny 및 CNN 모델의 forwarding 결과를 실행시간, 정확도, 메모리 관점에서 비교한다.",
    groups: [
      {
        id: "research",
        title: "코드베이스 진행",
        nodes: [
          {
            id: "darknet-repo",
            title: "darknet (실험)",
            items: [
              "letterbox 크기 조정",
              "im2col.c 인접 픽셀 실험",
              "gemm.c 픽셀 유사도 생략 실험",
            ],
            icon: "GitBranch",
          },
          {
            id: "darknet2-repo",
            title: "darknet2 (프로토타입)",
            items: [
              "layer fp32/fp16/int8 필드",
              "parse_convolutional cfg 파싱",
              "load_weights_upto_detect",
              "gemm_fp16/gemm_int",
            ],
            icon: "GitBranch",
          },
          {
            id: "yolov3mixed-repo",
            title: "yolov3_mixed (완성)",
            items: [
              "additionally.c/h 이식",
              "플래그 기반 분기 조건",
              "yolo2_light INT8 통합",
            ],
            icon: "GitBranch",
          },
        ],
      },
      {
        id: "clients",
        title: "실험 입력",
        nodes: [
          {
            id: "test-image",
            title: "Test Image",
            items: ["dog.jpg", "synthetic color image", "Mini ImageNet image"],
            icon: "Image",
          },
          {
            id: "cfg-file",
            title: "YOLOv3-tiny CFG",
            items: ["fp32/fp16/int8/mixed 옵션", "bin/yolov3-tiny.cfg"],
            icon: "FileCode",
          },
          {
            id: "weights-files",
            title: "Weights",
            items: ["FP32", "FP16", "INT8"],
            icon: "Archive",
          },
          {
            id: "dataset",
            title: "Dataset",
            items: ["CIFAR-10", "Mini ImageNet"],
            icon: "Database",
          },
        ],
      },
      {
        id: "gateway",
        title: "실험 설정 계층",
        nodes: [
          {
            id: "precision-config-parser",
            title: "Precision Config Parser",
            items: [
              "parse_convolutional fp32/fp16/int8 파싱",
              "layer 구조체 저장",
              "darknet2 원형 → additionally.c 이식",
            ],
            icon: "Sliders",
          },
        ],
      },
      {
        id: "services",
        title: "추론 실행 계층",
        nodes: [
          {
            id: "weight-loader",
            title: "Precision-aware Weight Loader",
            items: [
              "load_weights_upto_detect",
              "fp32/fp16/int8 파일 동시 오픈",
              "ftell/fseek pointer 동기화",
              "darknet2 원형",
            ],
            icon: "Database",
          },
          {
            id: "mixed-forwarder",
            title: "Mixed Precision Forwarder",
            items: [
              "l.mixed && l.int8 플래그 분기",
              "yolo2_light INT8 forwarding 활용",
              "clock_t 실행시간 측정",
            ],
            icon: "Cpu",
          },
          {
            id: "conv-maxpool-runner",
            title: "Conv-Maxpool Runner",
            items: ["integrated execution", "reduce conversion cost"],
            icon: "Layers",
          },
          {
            id: "yolo-layer",
            title: "YOLO Detection Layer",
            items: ["bbox", "objectness", "class probability"],
            icon: "ScanSearch",
          },
        ],
      },
      {
        id: "data",
        title: "모델 / 중간 데이터",
        nodes: [
          {
            id: "activation-buffer",
            title: "Activation Buffer",
            items: ["output", "output_int8", "output_q", "workspace"],
            icon: "MemoryStick",
          },
          {
            id: "experiment-log",
            title: "Experiment Log",
            items: [
              "layer runtime",
              "detection result",
              "memory",
              "confusion matrix",
            ],
            icon: "ClipboardList",
          },
        ],
      },
      {
        id: "ai",
        title: "최적화 / 분석",
        nodes: [
          {
            id: "bottleneck-analyzer",
            title: "Bottleneck Analyzer",
            items: [
              "darknet im2col.c/gemm.c 실험 결과",
              "letterbox 계산량 분석",
              "clock_t layer 실행시간",
            ],
            icon: "Activity",
          },
          {
            id: "quantization-runtime",
            title: "Quantization Runtime",
            items: ["yolo2_light 원본 INT8 GEMM", "scale factor quantize/dequantize"],
            icon: "Repeat",
          },
          {
            id: "fp16-runtime",
            title: "FP16 Runtime",
            items: ["armclang __fp16/__Float16", "darknet2에서 gemm_fp16 원형 작성"],
            icon: "Binary",
          },
          {
            id: "overflow-analyzer",
            title: "Overflow Analyzer",
            items: ["int8", "int16", "int24"],
            icon: "Gauge",
          },
          {
            id: "metrics-evaluator",
            title: "Metrics Evaluator",
            items: ["runtime", "accuracy", "memory", "confusion matrix"],
            icon: "BarChart",
          },
        ],
      },
      {
        id: "infra-integrations",
        title: "ARM 임베디드 실행 환경",
        nodes: [
          {
            id: "jetson-nano",
            title: "Jetson Nano",
            items: ["ARM64", "Ubuntu 18.04"],
            icon: "Cpu",
          },
          {
            id: "tensorflow-c-binding",
            title: "TensorFlow C Binding",
            items: ["Bazel build", "C/C++ API"],
            icon: "Boxes",
          },
          {
            id: "arm-compiler",
            title: "ARM Compiler",
            items: ["armclang", "FP16 compile"],
            icon: "Terminal",
          },
        ],
      },
    ],
    connections: [
      { from: "darknet-repo", to: "darknet2-repo", tone: "sync", label: "실험 결과 반영" },
      { from: "darknet2-repo", to: "yolov3mixed-repo", tone: "sync", label: "프로토타입 이식" },
      { from: "darknet-repo", to: "bottleneck-analyzer", tone: "async", label: "im2col/GEMM 실험" },
      { from: "darknet2-repo", to: "precision-config-parser", tone: "async", label: "cfg 파싱 원형" },
      { from: "darknet2-repo", to: "weight-loader", tone: "async", label: "load_weights_upto_detect 원형" },
      { from: "yolov3mixed-repo", to: "mixed-forwarder", tone: "async", label: "분기 조건 완성" },
      { from: "test-image", to: "mixed-forwarder", tone: "data", label: "image input" },
      { from: "dataset", to: "metrics-evaluator", tone: "data", label: "experiment dataset" },
      { from: "cfg-file", to: "precision-config-parser", tone: "data", label: "precision config" },
      { from: "precision-config-parser", to: "weight-loader", tone: "sync", label: "layer precision" },
      { from: "weights-files", to: "weight-loader", tone: "data", label: "weights" },
      { from: "weight-loader", to: "mixed-forwarder", tone: "data", label: "selected weight" },
      { from: "mixed-forwarder", to: "quantization-runtime", tone: "sync", label: "convert precision" },
      { from: "quantization-runtime", to: "activation-buffer", tone: "data", label: "converted activation" },
      { from: "mixed-forwarder", to: "conv-maxpool-runner", tone: "sync", label: "conv + maxpool" },
      { from: "conv-maxpool-runner", to: "yolo-layer", tone: "data", label: "detection input" },
      { from: "mixed-forwarder", to: "bottleneck-analyzer", tone: "data", label: "runtime metrics" },
      { from: "mixed-forwarder", to: "overflow-analyzer", tone: "data", label: "overflow metrics" },
      { from: "yolo-layer", to: "experiment-log", tone: "data", label: "detection result" },
      { from: "metrics-evaluator", to: "experiment-log", tone: "data", label: "accuracy/runtime/memory" },
      { from: "tensorflow-c-binding", to: "quantization-runtime", tone: "sync", label: "tf.quantization" },
      { from: "arm-compiler", to: "fp16-runtime", tone: "sync", label: "compile fp16" },
      { from: "fp16-runtime", to: "mixed-forwarder", tone: "sync", label: "fp16 support" },
      { from: "jetson-nano", to: "tensorflow-c-binding", tone: "sync", label: "ARM build" },
      { from: "jetson-nano", to: "arm-compiler", tone: "sync", label: "ARM compiler" },
    ],
    legends: [
      { label: "동기 요청", tone: "solid" },
      { label: "비동기 이벤트", tone: "dashed" },
      { label: "데이터 흐름", tone: "muted" },
    ],
  },
  features: [
    {
      title: "임베디드 AI 실행 환경 조사",
      description:
        "WSL2, Docker, NVDLA, RISC-V VP, Jetson Nano 환경을 구성하고 CNN 추론 실행 가능성을 검토했다.",
      icon: "Server",
    },
    {
      title: "YOLOv3-tiny Layer 구조 분석",
      description:
        "Convolutional, Maxpool, Route, Upsample, YOLO layer의 역할과 detection 흐름을 코드 수준에서 분석했다.",
      icon: "Network",
    },
    {
      title: "im2col/GEMM 병목 분석",
      description:
        "Convolution layer의 핵심 연산인 im2col과 GEMM을 분석하고 계산량 감소 가능성과 구조적 제약을 검토했다.",
      icon: "Activity",
    },
    {
      title: "레이어별 Mixed Precision 설정",
      description:
        "AlexeyAB/yolo2_light를 포크해 cfg에 fp32/fp16/int8/mixed 플래그를 추가하고, layer 구조체·make_convolutional_layer·parse_convolutional·yolov2_forward_network_q의 분기 조건을 수정해 cfg 파일만으로 레이어별 정밀도를 선택하는 라우팅 시스템을 구현했다.",
      icon: "Sliders",
    },
    {
      title: "Multi Weight Loading",
      description:
        "FP32, FP16, INT8 weight 파일을 동시에 열고 현재 layer가 요구하는 precision에 맞는 weight를 선택적으로 로드했다.",
      icon: "Database",
    },
    {
      title: "INT8 Quantize / Dequantize",
      description:
        "affine quantize mapping과 scale factor 기반으로 weight와 input을 int8로 변환하고 output을 dequantize했다.",
      icon: "Repeat",
    },
    {
      title: "FP16 ARM Compile",
      description:
        "ARM Compiler와 armclang을 사용해 C/C++에서 __fp16, __Float16 타입을 컴파일하고 테스트했다.",
      icon: "Terminal",
    },
    {
      title: "INT8 Overflow Analysis",
      description:
        "weight × input, convolution result에 대해 int8, int16, int24 범위별 overflow 비율을 분석했다.",
      icon: "Gauge",
    },
    {
      title: "CNN 모델 확장 준비",
      description:
        "VGG16, VGG19, ResNet50, MobileNet 계열 모델을 Mixed Precision 실험 대상으로 확장하기 위해 block 구조를 검토했다.",
      icon: "Boxes",
    },
  ],
  techStackGroups: [
    {
      title: "AI / Model Optimization",
      items: [
        { name: "CNN", category: "ai" },
        { name: "YOLOv3-tiny", category: "ai" },
        { name: "Mixed Precision", category: "ai" },
        { name: "INT8 Quantization", category: "ai" },
        { name: "FP16", category: "ai" },
        { name: "im2col", category: "ai" },
        { name: "GEMM", category: "ai" },
        { name: "VGG16", category: "ai" },
        { name: "VGG19", category: "ai" },
        { name: "ResNet50", category: "ai" },
        { name: "MobileNetV2", category: "ai" },
      ],
    },
    {
      title: "Language / Runtime",
      items: [
        { name: "C", category: "language" },
        { name: "C++", category: "language" },
        { name: "Python", category: "language" },
        { name: "TensorFlow C API", category: "ai" },
      ],
    },
    {
      title: "Embedded / Toolchain",
      items: [
        { name: "Jetson Nano", category: "infra" },
        { name: "ARM64", category: "infra" },
        { name: "Ubuntu 18.04", category: "infra" },
        { name: "ARM Compiler", category: "tool" },
        { name: "armclang", category: "tool" },
        { name: "GCC", category: "tool" },
        { name: "Bazel", category: "tool" },
      ],
    },
    {
      title: "Experiment / Data",
      items: [
        { name: "CIFAR-10", category: "ai" },
        { name: "Mini ImageNet", category: "ai" },
        { name: "Confusion Matrix", category: "ai" },
        { name: "Valgrind", category: "observability" },
        { name: "Heaptrack", category: "observability" },
      ],
    },
    {
      title: "Research Environment",
      items: [
        { name: "Docker", category: "infra" },
        { name: "WSL2", category: "infra" },
        { name: "NVDLA", category: "infra" },
        { name: "RISC-V VP", category: "infra" },
      ],
    },
  ],
  screenshots: [],
  contributions: [
    {
      date: "2021.07",
      title: "임베디드 AI 개발 환경 조사",
      description:
        "WSL2, Docker, NVDLA, RISC-V VP 기반 환경을 구성하고 CNN 추론 실행 가능성을 검토했다.",
    },
    {
      date: "2021.08",
      title: "YOLOv3-tiny Layer 구조 분석",
      description:
        "Convolutional, Maxpool, Route, Upsample, YOLO layer의 역할과 detection 흐름을 분석했다.",
    },
    {
      date: "2021.10",
      title: "Convolution 연산 병목 분석 및 im2col/GEMM 실험 (darknet)",
      description:
        "AlexeyAB/darknet(darknet 디렉토리)에서 im2col_cpu와 GEMM 병목을 확인하고, im2col.c에서 인접 픽셀 평균화 실험, gemm.c에서 인접 픽셀 유사도 기반 연산 생략 실험을 직접 작성했다.",
    },
    {
      date: "2021.11",
      title: "Letterbox 기반 계산량 감소 실험 (darknet)",
      description:
        "detector.c에서 letterbox 크기 계산을 비율 기반으로 바꾸는 실험을 직접 작성하고, 입력 크기 조정이 detection 정확도에 미치는 영향을 확인했다.",
    },
    {
      date: "2022.02",
      title: "Mixed Precision 분기 시스템 프로토타입 구현 (darknet2)",
      description:
        "AlexeyAB/darknet(darknet2 디렉토리)에서 layer 구조체에 fp32/fp16/int8 필드 추가, make_convolutional_layer 시그니처 확장, parse_convolutional cfg 파싱, gemm_fp16/gemm_int 함수를 직접 작성해 Mixed Precision 분기 시스템을 프로토타입으로 구현했다.",
    },
    {
      date: "2022.03",
      title: "load_weights_upto_detect 구현 및 file pointer 동기화 (darknet2 → yolov3_mixed)",
      description:
        "darknet2의 parser.c에서 fp32/fp16/int8 weight 파일 3개를 동시에 열고 ftell/fseek로 pointer를 동기화하는 load_weights_upto_detect를 직접 작성했다. 이후 yolov3_mixed(additionally.c)로 이식하면서 segmentation fault를 해결했다.",
    },
    {
      date: "2022.04",
      title: "darknet2 설계를 yolov3_mixed로 통합",
      description:
        "darknet2에서 프로토타입으로 구현한 fp32/fp16/int8 플래그 시스템을 AlexeyAB/yolo2_light 포크(yolov3_mixed)의 additionally.c/h에 이식했다. 레이어 분기 조건을 인덱스 기반에서 l.mixed && l.int8 플래그 기반으로 전환하고 bin/yolov3-tiny.cfg에 레이어별 플래그를 추가했다.",
    },
    {
      date: "2022.05",
      title: "TensorFlow C Binding 검증",
      description:
        "Jetson Nano ARM 환경에서 TensorFlow C API를 사용하기 위한 빌드 및 호출 방식을 검증했다.",
    },
    {
      date: "2022.08",
      title: "INT8 Weight Quantization 구현",
      description:
        "YOLOv3 weight 파일 구조를 분석하고 affine mapping 기반으로 weight를 직접 INT8로 변환했다.",
    },
    {
      date: "2022.11",
      title: "INT8 Overflow 분석",
      description:
        "int8, int16, int24 범위별 overflow 비율을 분석해 저장 타입 설계 근거를 마련했다.",
    },
    {
      date: "2022.12",
      title: "Mixed Precision Framework ver.1 완료",
      description:
        "layer 정밀도 구성에 따라 서로 다른 결과를 내는 demo test를 완료했다.",
    },
    {
      date: "2023.01",
      title: "정밀도별 실행시간 비교",
      description:
        "GCC/armclang, FP32/INT8 정밀도별 실행시간을 비교하고 conv7, conv12 병목을 확인했다.",
    },
    {
      date: "2023.02",
      title: "CNN 모델 확장 설계",
      description:
        "ResNet residual block과 MobileNetV2 inverted residual block 지원 방향을 검토했다.",
    },
  ],
  troubleshooting: [
    {
      title: "NVDLA 환경에서 YOLOv3 실행 제약",
      problem:
        "NVDLA compiler는 prototxt와 caffemodel을 사용하지만 기존 YOLOv3는 cfg와 weights 파일을 사용해 바로 실행할 수 없었다.",
      solution:
        "AlexNet 예제를 먼저 실행하고 YOLOv3-tiny를 caffemodel/prototxt로 변환하는 방법을 조사했다.",
      result:
        "NVDLA 환경의 제약을 확인하고 이후 Darknet 기반 YOLOv3-tiny 코드 분석으로 방향을 전환했다.",
      noteSlug: "troubleshooting-nvdla-yolov3-format-limitation",
    },
    {
      title: "im2col/GEMM 파라미터 감소 시 segmentation fault",
      problem:
        "stride, channel, kernel size를 임의로 조정하면 layer output 크기와 memory allocation이 맞지 않아 segmentation fault가 발생했다.",
      solution:
        "임의 조정보다 letterbox 영역과 network input size를 기준으로 계산량을 줄이는 방향을 검토했다.",
      result:
        "convolution 연산 최적화는 network 구조와 memory allocation을 함께 고려해야 한다는 결론을 얻었다.",
      noteSlug: "troubleshooting-im2col-gemm-parameter-reduction",
    },
    {
      title: "Letterbox 영역 제거 기반 계산량 감소 실험",
      problem:
        "YOLOv3-tiny는 입력 이미지를 416x416 정사각형으로 맞추기 위해 letterbox 영역을 추가하고, im2col/GEMM은 이 영역까지 계산했다.",
      solution:
        "이미지 비율에 맞게 network width/height를 조정하거나 letterbox 영역의 계산을 줄이는 방안을 실험했다.",
      result:
        "실행시간은 줄었지만 detection 수와 정확도 저하가 발생해 단순 입력 크기 축소의 한계를 확인했다.",
      noteSlug: "troubleshooting-yolo-letterbox-computation-reduction",
    },
    {
      title: "인접 픽셀 평균화 기반 GEMM 계산 축소 실패",
      problem:
        "인접 픽셀 평균을 GEMM 과정에 직접 적용했지만 평균 계산 비용이 증가하고 No Detection이 발생했다.",
      solution:
        "GEMM 내부가 아니라 im2col 단계에서 유사 픽셀을 통일하고 이후 계산을 생략하는 방향으로 전환했다.",
      result:
        "정확도 손실을 일으키는 전처리성 최적화보다 구조적 정밀도 제어가 필요하다는 결론을 얻었다.",
      noteSlug: "troubleshooting-gemm-neighbor-pixel-optimization-failure",
    },
    {
      title: "Multi Weight Loading 중 segmentation fault",
      problem:
        "FP32, FP16, INT8 weight 파일의 file pointer 위치가 서로 달라져 잘못된 weight가 로드되었다.",
      solution:
        "ftell과 fseek로 모든 weight 파일의 pointer를 동일한 위치로 동기화했다.",
      result:
        "nboxes가 계산되고 object detection 결과가 출력되었다.",
      noteSlug: "troubleshooting-mixed-precision-weight-pointer-sync",
    },
    {
      title: "TensorFlow C Binding ARM 빌드 문제",
      problem:
        "TensorFlow 공식 C library가 x86 중심으로 제공되어 Jetson Nano ARM 환경에서 -ltensorflow를 찾지 못하거나 incompatible library 문제가 발생했다.",
      solution:
        "ARM Ubuntu 18.04 환경에서 TensorFlow C binding을 직접 빌드하고 링커 환경을 구성했다.",
      result:
        "C/C++에서 TensorFlow library 호출 가능성을 검증했고 quantization 모듈을 사용할 기반을 확보했다.",
      noteSlug: "troubleshooting-tensorflow-c-binding-arm-build",
    },
    {
      title: "INT8 image casting으로 인한 정보 손실",
      problem:
        "0~1 float image 값을 int8로 단순 casting하면서 대부분 0으로 손실되었다.",
      solution:
        "image value range를 분석하고 scale factor 기반 quantization 필요성을 도출했다.",
      result:
        "단순 type casting 대신 quantize/dequantize 인터페이스를 설계했다.",
      noteSlug: "troubleshooting-int8-image-value-loss",
    },
    {
      title: "INT8 convolution overflow",
      problem:
        "weight와 input의 곱 및 convolution 누적 결과가 int8 범위를 초과했다.",
      solution:
        "int8, int16, int24 범위별 overflow 비율을 측정하고 output 저장 타입을 재검토했다.",
      result:
        "int16 result 저장이 int8보다 overflow를 크게 줄일 수 있음을 확인했다.",
      noteSlug: "troubleshooting-int8-convolution-overflow",
    },
    {
      title: "Bias Quantization 실패",
      problem:
        "bias를 quantize하면 dequantize 이후 원본 bias 복원이 어려워 detection이 실패했다.",
      solution:
        "bias float 유지와 Conv-Maxpool 통합 실행을 통한 변환 횟수 감소 방향으로 전환했다.",
      result:
        "bias quantization보다 변환 비용 절감이 현실적인 개선 방향임을 확인했다.",
      noteSlug: "troubleshooting-bias-quantization-detection-failure",
    },
    {
      title: "Conv-Maxpool 통합 후 검출 실패",
      problem:
        "Conv와 Maxpool을 통합 실행하면 수행시간은 감소했지만 detection이 되지 않는 문제가 남았다.",
      solution:
        "Conv layer의 output 크기 조정, maxpool layer skip, dequantize/activation 순서 조정 등을 검토했다.",
      result:
        "평균 5% 수행시간 감소는 확인했지만, 정확도 보존을 위해 후속 검증이 필요하다는 결론을 얻었다.",
      noteSlug: "troubleshooting-conv-maxpool-integrated-execution",
    },
    {
      title: "ResNet/MobileNet 구조 확장 문제",
      problem:
        "YOLOv3-tiny 중심 초기 프레임워크는 residual block과 inverted residual block을 지원하지 못했다.",
      solution:
        "ResNet residual block과 MobileNetV2 bottleneck 구조를 분석하고 framework ver.0.2 확장 방향을 설계했다.",
      result:
        "VGG16, VGG19, ResNet50 동작 확인 및 MobileNet 지원 수정 작업으로 확장되었다.",
      noteSlug: "troubleshooting-mixed-precision-framework-model-extension",
    },
    {
      title: "Jetson Nano 실험 시간 문제",
      problem:
        "Mini ImageNet 4만 장 실험도 Jetson Nano에서 1회 수행에 1~2일이 걸릴 정도로 오래 걸렸다.",
      solution:
        "전체 ImageNet 대신 Mini ImageNet을 사용하고, 데이터셋 축소 후 실험을 지속하는 방향을 선택했다.",
      result:
        "실험 가능성을 유지하면서 정확도, 실행시간, 메모리 사용량 비교 계획을 수립했다.",
      noteSlug: "troubleshooting-jetson-nano-experiment-scale",
    },
  ],
  improvements: [
    {
      title: "입력 크기 조정 기반 실행시간 개선",
      description:
        "Letterbox image의 임의 영역을 줄이기 위해 image 비율에 맞춰 network input size를 조정하는 실험을 수행했다.",
      result:
        "기존 평균 3.8908초, 수정 평균 3.1635초로 감소했으나 detection 정확도 저하 발생",
      icon: "Gauge",
    },
    {
      title: "Conv-Maxpool 통합 실행",
      description:
        "Conv layer 직후 Maxpool을 별도 실행하지 않고 Conv layer 내부에서 함께 처리했다.",
      result: "평균 약 5% 수행시간 감소",
      icon: "Layers",
    },
    {
      title: "GCC INT8 실행 개선",
      description:
        "GCC로 컴파일한 YOLOv3-tiny에서 FP32와 INT8 실행시간을 비교했다.",
      result: "FP32 3.454초 대비 INT8 2.207초, 약 35% faster",
      icon: "Gauge",
    },
    {
      title: "INT8 Overflow 분석 기반 저장 타입 개선",
      description:
        "convolution result를 int8에 직접 저장하지 않고 int16/int32 임시 버퍼 또는 int24 가능성을 검토했다.",
      result: "int16 weight×input 단일 계산 기준 overflow 0건",
      icon: "Activity",
    },
    {
      title: "CIFAR-10 Baseline 확보",
      description:
        "Mixed Precision 정확도 변화를 비교하기 위해 VGG16, VGG19, ResNet50 baseline을 확보했다.",
      result: "VGG16 test acc 88.08%, ResNet50 test acc 72.73%",
      icon: "BarChart",
    },
  ],
  performance: [
    {
      label: "연구 활동 기간",
      value: "1년 8개월",
      description: "2021.07 ~ 2023.02 학부연구생 활동",
      icon: "Calendar",
    },
    {
      label: "지원 정밀도",
      value: "3종",
      description: "FP32, FP16, INT8 정밀도 조합 실험",
      icon: "Cpu",
    },
    {
      label: "대상 모델",
      value: "5종 이상",
      description:
        "YOLOv3-tiny, VGG16, VGG19, ResNet50, MobileNet 계열 실험/준비",
      icon: "Brain",
    },
    {
      label: "TensorFlow ARM 빌드",
      value: "약 34시간",
      description: "Jetson Nano에서 TensorFlow C binding을 Bazel로 빌드",
      icon: "Clock",
    },
    {
      label: "GCC INT8 개선",
      value: "35% faster",
      description: "GCC 기준 FP32 3.454초 대비 INT8 2.207초 실행",
      icon: "Gauge",
    },
    {
      label: "Armclang INT8 개선",
      value: "5% faster",
      description: "armclang 기준 FP32 3.313초 대비 INT8 3.154초 실행",
      icon: "Gauge",
    },
    {
      label: "Conv-Maxpool 개선",
      value: "평균 5%",
      description: "Conv와 Maxpool 일괄 실행 시 수행시간 감소 관찰",
      icon: "Layers",
    },
    {
      label: "VGG16 CIFAR-10",
      value: "88.08%",
      description:
        "Mixed Precision 실험 기준점으로 사용할 test accuracy 확보",
      icon: "BarChart",
    },
    {
      label: "ResNet50 CIFAR-10",
      value: "72.73%",
      description: "ResNet 계열 baseline test accuracy 확보",
      icon: "BarChart",
    },
    {
      label: "Mini ImageNet",
      value: "약 4만 장",
      description:
        "Jetson Nano 실험 시간을 고려해 축소 데이터셋 사용",
      icon: "Database",
    },
  ],
  retrospective: {
    learned: [
      "CNN 경량화는 단순히 자료형을 줄이는 문제가 아니라 layer 구조, memory allocation, activation 범위, detection layer의 수치 특성, compiler/toolchain까지 함께 보는 시스템 최적화 문제라는 점을 배웠다.",
      "im2col/GEMM처럼 병목이 분명한 연산도 임의로 계산량을 줄이면 segmentation fault, No Detection, 정확도 저하로 이어질 수 있어 네트워크 구조를 보존하는 최적화가 중요하다는 점을 확인했다.",
      "YOLOv3-tiny의 route/yolo layer처럼 detection 결과와 직접 연결되는 layer는 정수형 전환이 어렵고, 어떤 layer는 float 계열 정밀도를 유지해야 한다는 점을 실험으로 이해했다.",
      "INT8 inference에서는 weight와 input을 줄이는 것보다 중간 결과의 저장 타입과 overflow 제어가 더 중요할 수 있다는 점을 확인했다.",
      "ARM 기반 임베디드 환경에서는 라이브러리와 컴파일러 지원 여부가 연구 속도를 크게 좌우하며, TensorFlow C binding, Bazel, ARM Compiler, environment-modules 같은 toolchain 이해가 필요했다.",
      "실패한 실험도 연구 방향을 좁히는 근거가 된다는 점을 배웠다.",
      "프레임워크를 하나의 모델에만 맞추면 확장성이 떨어지며, ResNet residual block이나 MobileNetV2 inverted residual block처럼 모델별 구조를 추상화해야 한다는 점을 배웠다.",
    ],
    improvement: [
      "레이어별 precision 조합에 따른 정확도, 실행시간, 메모리 사용량을 자동 수집하는 benchmark script를 추가한다.",
      "YOLOv3-tiny 외에 VGG16, ResNet50, MobileNetV2 등 다양한 CNN 구조에 동일한 Mixed Precision Framework를 적용한다.",
      "INT8 result 저장 공간으로 int16, int24, int32를 비교하고 정확도 손실과 메모리 사용량을 정량화한다.",
      "Conv-Maxpool 통합 실행 후 검출 실패 원인을 분석해 실행시간 감소뿐 아니라 정확도 보존까지 검증한다.",
      "Mini ImageNet, CIFAR-10 기반 실험을 자동화해 confusion matrix, layer별 runtime, memory usage를 함께 수집한다.",
      "Jetson Nano 실험 시간이 긴 문제를 줄이기 위해 데이터셋 샘플링 전략과 실험 배치 방식을 개선한다.",
    ],
    noteSlug: "retrospective-arm-embedded-cnn-mixed-precision",
  },
  relatedNoteSlugs: [
    "note-cnn-lightweight-optimization",
    "note-yolov3-tiny-layer-architecture",
    "note-im2col-gemm-bottleneck",
    "note-mixed-precision-cnn",
    "note-int8-quantization-overflow",
    "note-tensorflow-c-binding-arm",
    "note-arm-fp16-compiler",
    "note-conv-maxpool-integration",
    "note-cnn-model-extension-resnet-mobilenet",
  ],
};
