import type { TechnicalNoteDetail } from "@/types/note";
import { aiDevopsProjectRetrospectiveDetail } from "./note-details/ai-devops-project-retrospective";
import { aiDevopsRetrospectiveDetail } from "./note-details/ai-devops-retrospective";
import { aiLogAnalysisLatencyDetail } from "./note-details/ai-log-analysis-latency";
import { asyncPipelineTransitionDetail } from "./note-details/async-pipeline-transition";
import { dbRoundTripOptimizationDetail } from "./note-details/db-round-trip-optimization";
import { metricCardinalityTroubleshootingDetail } from "./note-details/metric-cardinality-troubleshooting";
import { rabbitmqEventTopologyDetail } from "./note-details/rabbitmq-event-topology";
import { asyncSessionJoinOptimizationDetail } from "./note-details/async-session-join-optimization";
import { celeryPreforkAsyncioNullpoolDetail } from "./note-details/celery-prefork-asyncio-nullpool";
import { asyncSqlalchemyEagerLoadingDetail } from "./note-details/async-sqlalchemy-eager-loading";
import { msaRabbitmqMigrationDetail } from "./note-details/msa-rabbitmq-migration";
import { asyncTestDbIsolationDetail } from "./note-details/async-test-db-isolation";
import { distributedTracingCorrelationIdDetail } from "./note-details/distributed-tracing-correlation-id";
import { consumerIdempotencyProcessedEventDetail } from "./note-details/consumer-idempotency-processed-event";
import { msaHttpRetryCircuitBreakerDetail } from "./note-details/msa-http-retry-circuit-breaker";
import { msaRouterDeletionTest404Detail } from "./note-details/msa-router-deletion-test-404";
import { eventSchemaVersioningDeployOrderDetail } from "./note-details/event-schema-versioning-deploy-order";
import { crossServiceJoinDbSeparationDetail } from "./note-details/cross-service-join-db-separation";
import { msaLoadTestThreadpoolOwnershipDetail } from "./note-details/msa-load-test-threadpool-ownership";
import { msaDbSplitIntegrationTestDetail } from "./note-details/msa-db-split-integration-test";
import { statisticConcurrencyOptimisticLockDetail } from "./note-details/statistic-concurrency-optimistic-lock";
import { reissueInfiniteRequestDetail } from "./note-details/reissue-infinite-request";
import { nPlusOnePreventionQuerydslProjectionDetail } from "./note-details/n-plus-one-prevention-querydsl-projection";
import { multiModuleSharedDomainPortPatternDetail } from "./note-details/multi-module-shared-domain-port-pattern";
import { weeklySettlementSchedulerIdempotencyDetail } from "./note-details/weekly-settlement-scheduler-idempotency";
import { multiEnvironmentLoginTokenOverwriteDetail } from "./note-details/multi-environment-login-token-overwrite";
import { albCorsTroubleshootingDetail } from "./note-details/alb-cors-troubleshooting";
import { fileUploadDeleteApiSeparationDetail } from "./note-details/file-upload-delete-api-separation";
import { querydslInfoLayerDataFlowDetail } from "./note-details/querydsl-info-layer-data-flow";
import { domainModuleBoundaryFromMonolithDetail } from "./note-details/domain-module-boundary-from-monolith";
import { haloRetrospectiveDetail } from "./note-details/halo-retrospective";
import { reservationCancelRefundFlowDetail } from "./note-details/reservation-cancel-refund-flow";
import { noteYolov3TinyLayerArchitectureDetail } from "./note-details/note-yolov3-tiny-layer-architecture";
import { noteIm2colGemmBottleneckDetail } from "./note-details/note-im2col-gemm-bottleneck";
import { noteCnnLightweightOptimizationDetail } from "./note-details/note-cnn-lightweight-optimization";
import { noteMixedPrecisionCnnDetail } from "./note-details/note-mixed-precision-cnn";
import { noteInt8QuantizationOverflowDetail } from "./note-details/note-int8-quantization-overflow";
import { noteArmFp16CompilerDetail } from "./note-details/note-arm-fp16-compiler";
import { noteConvMaxpoolIntegrationDetail } from "./note-details/note-conv-maxpool-integration";
import { noteTensorflowCBindingArmDetail } from "./note-details/note-tensorflow-c-binding-arm";
import { noteCnnModelExtensionResnetMobilenetDetail } from "./note-details/note-cnn-model-extension-resnet-mobilenet";

export const noteDetails: TechnicalNoteDetail[] = [
  dbRoundTripOptimizationDetail,
  asyncPipelineTransitionDetail,
  rabbitmqEventTopologyDetail,
  aiLogAnalysisLatencyDetail,
  metricCardinalityTroubleshootingDetail,
  aiDevopsProjectRetrospectiveDetail,
  aiDevopsRetrospectiveDetail,
  asyncSessionJoinOptimizationDetail,
  celeryPreforkAsyncioNullpoolDetail,
  asyncSqlalchemyEagerLoadingDetail,
  msaRabbitmqMigrationDetail,
  asyncTestDbIsolationDetail,
  distributedTracingCorrelationIdDetail,
  consumerIdempotencyProcessedEventDetail,
  msaHttpRetryCircuitBreakerDetail,
  msaRouterDeletionTest404Detail,
  eventSchemaVersioningDeployOrderDetail,
  crossServiceJoinDbSeparationDetail,
  msaLoadTestThreadpoolOwnershipDetail,
  msaDbSplitIntegrationTestDetail,
  statisticConcurrencyOptimisticLockDetail,
  reissueInfiniteRequestDetail,
  nPlusOnePreventionQuerydslProjectionDetail,
  multiModuleSharedDomainPortPatternDetail,
  weeklySettlementSchedulerIdempotencyDetail,
  reservationCancelRefundFlowDetail,
  multiEnvironmentLoginTokenOverwriteDetail,
  albCorsTroubleshootingDetail,
  fileUploadDeleteApiSeparationDetail,
  querydslInfoLayerDataFlowDetail,
  domainModuleBoundaryFromMonolithDetail,
  haloRetrospectiveDetail,
  noteYolov3TinyLayerArchitectureDetail,
  noteIm2colGemmBottleneckDetail,
  noteCnnLightweightOptimizationDetail,
  noteMixedPrecisionCnnDetail,
  noteInt8QuantizationOverflowDetail,
  noteArmFp16CompilerDetail,
  noteConvMaxpoolIntegrationDetail,
  noteTensorflowCBindingArmDetail,
  noteCnnModelExtensionResnetMobilenetDetail,
];
