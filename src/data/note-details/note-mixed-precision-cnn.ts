import type { TechnicalNoteDetail } from "@/types/note";
import { noteMixedPrecisionCnn } from "../notes/note-mixed-precision-cnn";

export const noteMixedPrecisionCnnDetail: TechnicalNoteDetail = {
  ...noteMixedPrecisionCnn,
  template: "technical-summary",
  toc: [
    { id: "background", title: "설계 배경", depth: 1 },
    { id: "cfg-flags", title: "cfg 기반 precision 플래그", depth: 1 },
    { id: "weight-loader", title: "다중 weight 파일 로딩", depth: 1 },
    { id: "dispatch", title: "레이어 분기 실행", depth: 1 },
    { id: "lesson", title: "배운 점", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "background",
      title: "1. 설계 배경",
    },
    {
      type: "paragraph",
      content:
        "YOLOv3-tiny에서 INT8 전체 적용 시 실행 시간은 3.45s → 2.21s로 단축되었지만 dog confidence가 81% → 31%로 크게 하락했습니다. 레이어별로 정밀도를 다르게 설정하는 Mixed Precision 전략이 필요했습니다. darknet2 코드베이스에서 layer 구조체에 precision 플래그를 추가하고, cfg 파싱과 weight 로딩을 함께 수정해 프로토타입을 구현했습니다.",
    },
    {
      type: "heading",
      id: "cfg-flags",
      title: "2. cfg 기반 precision 플래그",
    },
    {
      type: "paragraph",
      content:
        "Darknet의 cfg 파일에서 각 [convolutional] 블록에 fp32=, fp16=, int8= 플래그를 추가해 레이어별 precision을 직접 지정합니다. parser.c의 parse_convolutional 함수에서 option_find_int_quiet로 이 플래그를 읽어 layer 구조체에 저장합니다.",
    },
    {
      type: "code",
      language: "c",
      filename: "darknet2/src/parser.c",
      code: "// cfg 플래그 파싱\nint fp32 = option_find_int_quiet(options, \"fp32\", 1);\nint fp16 = option_find_int_quiet(options, \"fp16\", 0);\nint int8 = option_find_int_quiet(options, \"int8\", 0);\nprintf(\"fp32 : %d fp16: %d int8 : %d\\n\", fp32, fp16, int8);\n\n// layer 생성 시 플래그 전달\nconvolutional_layer layer = make_convolutional_layer(\n    batch, h, w, c, n, groups, size, stride, padding,\n    activation, batch_normalize, binary, xnor,\n    params.net->adam, fp32, fp16, int8\n);",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "코드에 하드코딩하면 실험마다 재컴파일이 필요하고, 별도 precision 설정 파일은 cfg와 동기화 문제가 발생합니다. cfg 파일 변경만으로 precision 조합을 바꿀 수 있어 실험 속도가 빨랐습니다.",
    },
    {
      type: "heading",
      id: "weight-loader",
      title: "3. 다중 weight 파일 로딩",
    },
    {
      type: "paragraph",
      content:
        "FP32, FP16, INT8 precision에 해당하는 weight를 각각 별도 파일로 분리하고, load_weights_upto_detect 함수에서 레이어 precision 플래그에 따라 분기 로드합니다. 세 파일 모두 동일한 Darknet weight 포맷을 사용하므로 기존 load_convolutional_weights 코드를 재사용할 수 있습니다.",
    },
    {
      type: "code",
      language: "c",
      filename: "darknet2/src/parser.c",
      code: "void load_weights_upto_detect(\n    network *net,\n    char *weights_fp32, char *weights_fp16, char *weights_int8,\n    int start, int cutoff\n) {\n    FILE *fp_fp32 = fopen(weights_fp32, \"rb\");\n    FILE *fp_fp16 = fopen(weights_fp16, \"rb\");\n    FILE *fp_int8  = fopen(weights_int8,  \"rb\");\n\n    // 세 파일 헤더를 각각 읽어 포인터를 weight 시작 위치로 맞춤\n    // (major, minor, revision, seen을 모두 읽어야 함)\n    fread(&major_fp32, sizeof(int), 1, fp_fp32);\n    // ... fp16, int8도 동일하게 헤더 읽기\n\n    for (i = start; i < net->n && i < cutoff; ++i) {\n        layer l = net->layers[i];\n        if (l.type == CONVOLUTIONAL) {\n            if (l.fp32 == 1) {\n                load_convolutional_weights(l, fp_fp32);\n                cp = ftell(fp_fp32);\n                fseek(fp_fp16, cp, SEEK_SET); // 다른 두 파일도 동기화\n                fseek(fp_int8,  cp, SEEK_SET);\n            } else if (l.fp16 == 1) {\n                load_convolutional_weights(l, fp_fp16);\n                cp = ftell(fp_fp16);\n                fseek(fp_fp32, cp, SEEK_SET);\n                fseek(fp_int8,  cp, SEEK_SET);\n            } else if (l.int8 == 1) {\n                load_convolutional_weights(l, fp_int8);\n                // 나머지 두 파일 동기화\n            }\n        }\n    }\n}",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "세 파일의 헤더(major, minor, revision, seen)를 모두 읽어야 포인터가 weight 데이터 시작점에 위치합니다. seen 블록 읽기를 주석 처리하면 포인터 동기화가 깨져 segmentation fault가 발생합니다. 실제로 이 문제로 detection 성공 후 프로세스 종료 시 segfault가 발생했고, seen 블록 주석 해제로 해결했습니다.",
    },
    {
      type: "heading",
      id: "dispatch",
      title: "4. 레이어 분기 실행",
    },
    {
      type: "paragraph",
      content:
        "yolov2_forward_network_q 함수에서 레이어 순회 시 precision 플래그로 분기합니다. l.mixed == 1이고 l.int8 == 1이거나 l.fp16이면 forward_convolutional_layer_q(INT8/FP16 경량 연산)를, 그 외에는 forward_convolutional_layer_cpu(FP32)를 호출합니다.",
    },
    {
      type: "code",
      language: "c",
      filename: "yolov3_mixed/src/yolov2_forward_network_quantized.c",
      code: "// 레이어 타입과 precision 플래그로 분기\nif (l.type == CONVOLUTIONAL) {\n    if (l.mixed == 1 && l.int8 == 1 || l.mixed == 1 && l.fp16)\n        forward_convolutional_layer_q(l, state); // INT8/FP16 경량 실행\n    else\n        forward_convolutional_layer_cpu(l, state); // FP32\n}\nelse if (l.type == MAXPOOL) {\n    forward_maxpool_layer_cpu(l, state);\n}\nelse if (l.type == ROUTE) {\n    forward_route_layer_cpu(l, state);\n}\n// ... upsample, yolo 등 나머지 타입은 FP32 고정",
    },
    {
      type: "heading",
      id: "lesson",
      title: "5. 배운 점",
    },
    {
      type: "list",
      items: [
        "cfg 파일에 precision 플래그를 두면 코드 재컴파일 없이 precision 조합을 바꿀 수 있어 실험 반복 속도가 빠릅니다.",
        "다중 파일에서 weight를 분기 로드할 때는 각 파일의 포인터 위치가 항상 동기화되어야 합니다. 헤더 읽기를 생략하면 손상된 메모리가 종료 시점에 segfault로 드러납니다.",
        "darknet2에서 프로토타입을 구현한 뒤 yolov3_mixed(AlexeyAB/yolo2_light 포크)로 이식하면서, 레이어 분기 조건을 인덱스 기반에서 플래그 기반으로 전환해 유지보수성을 높였습니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "note-yolov3-tiny-layer-architecture",
    "note-int8-quantization-overflow",
    "note-arm-fp16-compiler",
  ],
};
