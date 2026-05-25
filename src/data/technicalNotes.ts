import type { TechnicalNoteCard } from "@/types/note";
import { questionOptionAnswerConsistency } from "./notes/question-option-answer-consistency";
import { questionUpdateChildDataTransaction } from "./notes/question-update-child-data-transaction";
import { questionSearchFilterCondition } from "./notes/question-search-filter-condition";
import { randomQuestionSelectionDuplicate } from "./notes/random-question-selection-duplicate";
import { examSubmitScoreConsistency } from "./notes/exam-submit-score-consistency";
import { examTimeoutSubmitRaceCondition } from "./notes/exam-timeout-submit-race-condition";
import { roleBasedQuestionAccess } from "./notes/role-based-question-access";
import { refreshTokenReissueLoop } from "./notes/refresh-token-reissue-loop";
import { excelQuestionImportValidation } from "./notes/excel-question-import-validation";
import { questionImageUploadOrphanFile } from "./notes/question-image-upload-orphan-file";
import { softDeleteQueryLeak } from "./notes/soft-delete-query-leak";
import { corsCookieAuthFailure } from "./notes/cors-cookie-auth-failure";
import { goormBankRetrospective } from "./notes/goorm-bank-retrospective";
import { googleOauthExceptionMasking } from "./notes/google-oauth-exception-masking";
import { openaiResponseDirectAccess } from "./notes/openai-response-direct-access";
import { multirepoCI } from "./notes/multirepo-ci-duplication-and-drift";
import { statelessPromptContextLoss } from "./notes/stateless-prompt-context-loss";
import { socialIdUniqueConstraintMismatch } from "./notes/social-id-unique-constraint-mismatch";
import { llmResponseFormatNotEnforced } from "./notes/llm-response-format-not-enforced";
import { aiDevopsProjectRetrospective } from "./notes/ai-devops-project-retrospective";
import { aiDevopsRetrospective } from "./notes/ai-devops-retrospective";
import { aiLogAnalysisLatency } from "./notes/ai-log-analysis-latency";
import { albCorsTroubleshooting } from "./notes/alb-cors-troubleshooting";
import { statisticConcurrencyOptimisticLock } from "./notes/statistic-concurrency-optimistic-lock";
import { reissueInfiniteRequest } from "./notes/reissue-infinite-request";
import { nPlusOnePreventionQuerydslProjection } from "./notes/n-plus-one-prevention-querydsl-projection";
import { multiModuleSharedDomainPortPattern } from "./notes/multi-module-shared-domain-port-pattern";
import { weeklySettlementSchedulerIdempotency } from "./notes/weekly-settlement-scheduler-idempotency";
import { multiEnvironmentLoginTokenOverwrite } from "./notes/multi-environment-login-token-overwrite";
import { fileUploadDeleteApiSeparation } from "./notes/file-upload-delete-api-separation";
import { querydslInfoLayerDataFlow } from "./notes/querydsl-info-layer-data-flow";
import { domainModuleBoundaryFromMonolith } from "./notes/domain-module-boundary-from-monolith";
import { haloRetrospective } from "./notes/halo-retrospective";
import { asyncSessionJoinOptimization } from "./notes/async-session-join-optimization";
import { celeryPreforkAsyncioNullpool } from "./notes/celery-prefork-asyncio-nullpool";
import { asyncSqlalchemyEagerLoading } from "./notes/async-sqlalchemy-eager-loading";
import { msaRabbitmqMigration } from "./notes/msa-rabbitmq-migration";
import { asyncTestDbIsolation } from "./notes/async-test-db-isolation";
import { asyncPipelineTransition } from "./notes/async-pipeline-transition";
import { dbRoundTripOptimization } from "./notes/db-round-trip-optimization";
import { metricCardinalityTroubleshooting } from "./notes/metric-cardinality-troubleshooting";
import { querydslProjectionOptimization } from "./notes/querydsl-projection-optimization";
import { rabbitmqEventTopology } from "./notes/rabbitmq-event-topology";
import { smartFarmCloudMonitoringArchitecture } from "./notes/smart-farm-cloud-monitoring-architecture";
import { smartFarmRetrospective } from "./notes/smart-farm-retrospective";
import { sensorDataFlowResponsibilitySeparation } from "./notes/sensor-data-flow-responsibility-separation";
import { sensorRestIngestionValidation } from "./notes/sensor-rest-ingestion-validation";
import { duplicateSensorDataIdempotency } from "./notes/duplicate-sensor-data-idempotency";
import { sensorTimestampMeasurementStorageMismatch } from "./notes/sensor-timestamp-measurement-storage-mismatch";
import { sensorLogTableGrowthQueryDegradation } from "./notes/sensor-log-table-growth-query-degradation";
import { latestSensorValueQueryOptimization } from "./notes/latest-sensor-value-query-optimization";
import { sensorThresholdAlertFalsePositive } from "./notes/sensor-threshold-alert-false-positive";
import { realtimeDashboardRefreshDelay } from "./notes/realtime-dashboard-refresh-delay";
import { abnormalSensorValueDetection } from "./notes/abnormal-sensor-value-detection";
import { remoteControlDeviceStateMismatch } from "./notes/remote-control-device-state-mismatch";
import { remoteControlRetryPolicy } from "./notes/remote-control-retry-policy";
import { noteCnnLightweightOptimization } from "./notes/note-cnn-lightweight-optimization";
import { noteYolov3TinyLayerArchitecture } from "./notes/note-yolov3-tiny-layer-architecture";
import { noteIm2colGemmBottleneck } from "./notes/note-im2col-gemm-bottleneck";
import { noteMixedPrecisionCnn } from "./notes/note-mixed-precision-cnn";
import { noteInt8QuantizationOverflow } from "./notes/note-int8-quantization-overflow";
import { noteTensorflowCBindingArm } from "./notes/note-tensorflow-c-binding-arm";
import { noteArmFp16Compiler } from "./notes/note-arm-fp16-compiler";
import { noteConvMaxpoolIntegration } from "./notes/note-conv-maxpool-integration";
import { noteCnnModelExtensionResnetMobilenet } from "./notes/note-cnn-model-extension-resnet-mobilenet";
import { distributedTracingCorrelationId } from "./notes/distributed-tracing-correlation-id";
import { consumerIdempotencyProcessedEvent } from "./notes/consumer-idempotency-processed-event";
import { msaHttpRetryCircuitBreaker } from "./notes/msa-http-retry-circuit-breaker";
import { msaRouterDeletionTest404 } from "./notes/msa-router-deletion-test-404";
import { eventSchemaVersioningDeployOrder } from "./notes/event-schema-versioning-deploy-order";
import { crossServiceJoinDbSeparation } from "./notes/cross-service-join-db-separation";
import { msaLoadTestThreadpoolOwnership } from "./notes/msa-load-test-threadpool-ownership";
import { msaDbSplitIntegrationTest } from "./notes/msa-db-split-integration-test";
import { reservationCancelRefundFlow } from "./notes/reservation-cancel-refund-flow";

export const technicalNotes: TechnicalNoteCard[] = [
  dbRoundTripOptimization,
  asyncPipelineTransition,
  rabbitmqEventTopology,
  aiLogAnalysisLatency,
  metricCardinalityTroubleshooting,
  aiDevopsProjectRetrospective,
  aiDevopsRetrospective,
  distributedTracingCorrelationId,
  consumerIdempotencyProcessedEvent,
  msaHttpRetryCircuitBreaker,
  msaRouterDeletionTest404,
  eventSchemaVersioningDeployOrder,
  crossServiceJoinDbSeparation,
  msaLoadTestThreadpoolOwnership,
  msaDbSplitIntegrationTest,
  asyncSessionJoinOptimization,
  celeryPreforkAsyncioNullpool,
  asyncSqlalchemyEagerLoading,
  msaRabbitmqMigration,
  asyncTestDbIsolation,
  querydslProjectionOptimization,
  albCorsTroubleshooting,
  statisticConcurrencyOptimisticLock,
  reissueInfiniteRequest,
  nPlusOnePreventionQuerydslProjection,
  multiModuleSharedDomainPortPattern,
  weeklySettlementSchedulerIdempotency,
  reservationCancelRefundFlow,
  multiEnvironmentLoginTokenOverwrite,
  fileUploadDeleteApiSeparation,
  querydslInfoLayerDataFlow,
  domainModuleBoundaryFromMonolith,
  haloRetrospective,
  googleOauthExceptionMasking,
  openaiResponseDirectAccess,
  multirepoCI,
  statelessPromptContextLoss,
  socialIdUniqueConstraintMismatch,
  llmResponseFormatNotEnforced,
  smartFarmRetrospective,
  smartFarmCloudMonitoringArchitecture,
  sensorDataFlowResponsibilitySeparation,
  sensorRestIngestionValidation,
  duplicateSensorDataIdempotency,
  sensorTimestampMeasurementStorageMismatch,
  sensorLogTableGrowthQueryDegradation,
  latestSensorValueQueryOptimization,
  sensorThresholdAlertFalsePositive,
  realtimeDashboardRefreshDelay,
  abnormalSensorValueDetection,
  remoteControlDeviceStateMismatch,
  remoteControlRetryPolicy,
  questionOptionAnswerConsistency,
  questionUpdateChildDataTransaction,
  questionSearchFilterCondition,
  randomQuestionSelectionDuplicate,
  examSubmitScoreConsistency,
  examTimeoutSubmitRaceCondition,
  roleBasedQuestionAccess,
  refreshTokenReissueLoop,
  excelQuestionImportValidation,
  questionImageUploadOrphanFile,
  softDeleteQueryLeak,
  corsCookieAuthFailure,
  goormBankRetrospective,
  noteCnnLightweightOptimization,
  noteYolov3TinyLayerArchitecture,
  noteIm2colGemmBottleneck,
  noteMixedPrecisionCnn,
  noteInt8QuantizationOverflow,
  noteTensorflowCBindingArm,
  noteArmFp16Compiler,
  noteConvMaxpoolIntegration,
  noteCnnModelExtensionResnetMobilenet,
];
