# 기술 노트 문서 유형 재설계

## 배경

기존 `NoteCategory`는 도메인(database, messaging, observability 등)과 형식(troubleshooting)이 혼재하여 필터 축이 일관되지 않았다. `NoteFilterValue`도 별도 타입으로 분리되어 있어 타입 불일치가 발생하고 있었다.

## 목표

- 문서 유형 필터를 "독자가 이 문서에서 어떤 경험을 기대하는가" 기준으로 통일
- `NoteCategory`와 `NoteFilterValue`를 단일 타입으로 합치기
- 48개 노트 전체를 새 유형으로 재분류

---

## 타입 시스템 변경

### Before

```ts
type NoteCategory =
  | "performance" | "architecture" | "async" | "database"
  | "aws" | "observability" | "messaging" | "troubleshooting" | "security";

type NoteFilterValue =
  | "all" | "performance" | "database" | "async"
  | "devops" | "architecture" | "troubleshooting";
```

### After

```ts
type NoteCategory =
  | "troubleshooting"
  | "architecture"
  | "performance"
  | "concept"
  | "retrospective";

type NoteFilterValue = "all" | NoteCategory;
```

---

## 필터 레이블

| value | label |
|---|---|
| all | All |
| troubleshooting | 트러블슈팅 |
| architecture | 아키텍처 분석 |
| performance | 성능 분석 |
| concept | 개념 정리 |
| retrospective | 회고 |

---

## 유형 정의

| 유형 | 구조 |
|---|---|
| troubleshooting | 문제 → 진단 → 해결 |
| architecture | 결정 배경 → 설계 → 트레이드오프 |
| performance | 측정 → 병목 → 최적화 결과 |
| concept | 개념 → 동작 원리 → 적용 |
| retrospective | 맥락 → 시도 → 교훈 |

---

## 노트 재분류 (48개)

### troubleshooting (23개)

| slug |
|---|
| 001-google-oauth-exception-masking |
| 002-openai-response-direct-access |
| 003-multirepo-ci-duplication-and-drift |
| 005-social-id-unique-constraint-mismatch |
| 006-llm-response-format-not-enforced |
| alb-cors-troubleshooting |
| async-sqlalchemy-eager-loading |
| async-test-db-isolation |
| celery-prefork-asyncio-nullpool |
| consumer-idempotency-processed-event |
| container-image-architecture-compatibility |
| cross-service-join-db-separation |
| distributed-tracing-correlation-id |
| event-schema-versioning-deploy-order |
| metric-cardinality-troubleshooting |
| msa-db-split-integration-test |
| msa-http-retry-circuit-breaker |
| msa-load-test-threadpool-ownership |
| msa-router-deletion-test-404 |
| note-int8-quantization-overflow |
| note-tensorflow-c-binding-arm |
| note-arm-fp16-compiler |
| smart-farm-data-collector-recovery |

### architecture (14개)

| slug |
|---|
| async-pipeline-transition |
| eks-observability-cloudwatch-opensearch |
| fluentbit-cloudwatch-log-pipeline |
| jenkins-ecr-argocd-cicd |
| kubernetes-hpa-cluster-autoscaler |
| msa-rabbitmq-migration |
| note-cnn-model-extension-resnet-mobilenet |
| note-mixed-precision-cnn |
| note-yolov3-tiny-layer-architecture |
| rabbitmq-event-topology |
| smart-farm-api-server-design |
| smart-farm-db-replication |
| smart-farm-monitoring-engine |
| smart-farm-remote-device-control |

### performance (7개)

| slug |
|---|
| ai-log-analysis-latency |
| async-session-join-optimization |
| db-round-trip-optimization |
| note-cnn-lightweight-optimization |
| note-conv-maxpool-integration |
| note-im2col-gemm-bottleneck |
| querydsl-projection-optimization |

### concept (3개)

| slug |
|---|
| 004-stateless-prompt-context-loss |
| springboot-jwt-social-login |
| swagger-api-documentation |

### retrospective (1개)

| slug |
|---|
| ai-devops-retrospective |

---

## 변경 범위

| 파일 | 변경 내용 |
|---|---|
| `src/types/note.ts` | NoteCategory, NoteFilterValue 타입 교체 |
| `src/data/filters.ts` | noteCategoryFilters 5개로 교체 |
| `src/data/notes/*.ts` | 48개 파일의 category 필드 수정 |
