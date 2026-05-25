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
import { googleOauthExceptionMaskingDetail } from "./note-details/google-oauth-exception-masking";
import { openaiResponseDirectAccessDetail } from "./note-details/openai-response-direct-access";
import { multirepoCIDetail } from "./note-details/multirepo-ci-duplication-and-drift";
import { statelessPromptContextLossDetail } from "./note-details/stateless-prompt-context-loss";
import { socialIdUniqueConstraintMismatchDetail } from "./note-details/social-id-unique-constraint-mismatch";
import { llmResponseFormatNotEnforcedDetail } from "./note-details/llm-response-format-not-enforced";
import { smartFarmCloudMonitoringArchitectureDetail } from "./note-details/smart-farm-cloud-monitoring-architecture";
import { smartFarmRetrospectiveDetail } from "./note-details/smart-farm-retrospective";
import { sensorDataFlowResponsibilitySeparationDetail } from "./note-details/sensor-data-flow-responsibility-separation";
import { sensorRestIngestionValidationDetail } from "./note-details/sensor-rest-ingestion-validation";
import { duplicateSensorDataIdempotencyDetail } from "./note-details/duplicate-sensor-data-idempotency";
import { sensorTimestampMeasurementStorageMismatchDetail } from "./note-details/sensor-timestamp-measurement-storage-mismatch";
import { sensorLogTableGrowthQueryDegradationDetail } from "./note-details/sensor-log-table-growth-query-degradation";
import { latestSensorValueQueryOptimizationDetail } from "./note-details/latest-sensor-value-query-optimization";
import { sensorThresholdAlertFalsePositiveDetail } from "./note-details/sensor-threshold-alert-false-positive";
import { realtimeDashboardRefreshDelayDetail } from "./note-details/realtime-dashboard-refresh-delay";
import { abnormalSensorValueDetectionDetail } from "./note-details/abnormal-sensor-value-detection";
import { remoteControlDeviceStateMismatchDetail } from "./note-details/remote-control-device-state-mismatch";
import { remoteControlRetryPolicyDetail } from "./note-details/remote-control-retry-policy";
import { questionOptionAnswerConsistencyDetail } from "./note-details/question-option-answer-consistency";
import { questionUpdateChildDataTransactionDetail } from "./note-details/question-update-child-data-transaction";
import { questionSearchFilterConditionDetail } from "./note-details/question-search-filter-condition";
import { randomQuestionSelectionDuplicateDetail } from "./note-details/random-question-selection-duplicate";
import { examSubmitScoreConsistencyDetail } from "./note-details/exam-submit-score-consistency";
import { examTimeoutSubmitRaceConditionDetail } from "./note-details/exam-timeout-submit-race-condition";
import { roleBasedQuestionAccessDetail } from "./note-details/role-based-question-access";
import { refreshTokenReissueLoopDetail } from "./note-details/refresh-token-reissue-loop";
import { excelQuestionImportValidationDetail } from "./note-details/excel-question-import-validation";
import { questionImageUploadOrphanFileDetail } from "./note-details/question-image-upload-orphan-file";
import { softDeleteQueryLeakDetail } from "./note-details/soft-delete-query-leak";
import { corsCookieAuthFailureDetail } from "./note-details/cors-cookie-auth-failure";
import { goormBankRetrospectiveDetail } from "./note-details/goorm-bank-retrospective";

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
  googleOauthExceptionMaskingDetail,
  openaiResponseDirectAccessDetail,
  multirepoCIDetail,
  statelessPromptContextLossDetail,
  socialIdUniqueConstraintMismatchDetail,
  llmResponseFormatNotEnforcedDetail,
  smartFarmRetrospectiveDetail,
  smartFarmCloudMonitoringArchitectureDetail,
  sensorDataFlowResponsibilitySeparationDetail,
  sensorRestIngestionValidationDetail,
  duplicateSensorDataIdempotencyDetail,
  sensorTimestampMeasurementStorageMismatchDetail,
  sensorLogTableGrowthQueryDegradationDetail,
  latestSensorValueQueryOptimizationDetail,
  sensorThresholdAlertFalsePositiveDetail,
  realtimeDashboardRefreshDelayDetail,
  abnormalSensorValueDetectionDetail,
  remoteControlDeviceStateMismatchDetail,
  remoteControlRetryPolicyDetail,
  questionOptionAnswerConsistencyDetail,
  questionUpdateChildDataTransactionDetail,
  questionSearchFilterConditionDetail,
  randomQuestionSelectionDuplicateDetail,
  examSubmitScoreConsistencyDetail,
  examTimeoutSubmitRaceConditionDetail,
  roleBasedQuestionAccessDetail,
  refreshTokenReissueLoopDetail,
  excelQuestionImportValidationDetail,
  questionImageUploadOrphanFileDetail,
  softDeleteQueryLeakDetail,
  corsCookieAuthFailureDetail,
  goormBankRetrospectiveDetail,
];
