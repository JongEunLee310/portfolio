import type { TechnicalNoteCard } from "@/types/note";
import { containerImageArchitectureCompatibility } from "./notes/container-image-architecture-compatibility";
import { eksObservabilityCloudwatchOpensearch } from "./notes/eks-observability-cloudwatch-opensearch";
import { fluentbitCloudwatchLogPipeline } from "./notes/fluentbit-cloudwatch-log-pipeline";
import { jenkinsEcrArgoCdCicd } from "./notes/jenkins-ecr-argocd-cicd";
import { kubernetesHpaClusterAutoscaler } from "./notes/kubernetes-hpa-cluster-autoscaler";
import { springbootJwtSocialLogin } from "./notes/springboot-jwt-social-login";
import { swaggerApiDocumentation } from "./notes/swagger-api-documentation";
import { googleOauthExceptionMasking } from "./notes/001-google-oauth-exception-masking";
import { openaiResponseDirectAccess } from "./notes/002-openai-response-direct-access";
import { multirepoCI } from "./notes/003-multirepo-ci-duplication-and-drift";
import { statelessPromptContextLoss } from "./notes/004-stateless-prompt-context-loss";
import { socialIdUniqueConstraintMismatch } from "./notes/005-social-id-unique-constraint-mismatch";
import { llmResponseFormatNotEnforced } from "./notes/006-llm-response-format-not-enforced";
import { aiDevopsRetrospective } from "./notes/ai-devops-retrospective";
import { aiLogAnalysisLatency } from "./notes/ai-log-analysis-latency";
import { albCorsTroubleshooting } from "./notes/alb-cors-troubleshooting";
import { asyncPipelineTransition } from "./notes/async-pipeline-transition";
import { dbRoundTripOptimization } from "./notes/db-round-trip-optimization";
import { metricCardinalityTroubleshooting } from "./notes/metric-cardinality-troubleshooting";
import { querydslProjectionOptimization } from "./notes/querydsl-projection-optimization";
import { rabbitmqEventTopology } from "./notes/rabbitmq-event-topology";
import { smartFarmApiServerDesign } from "./notes/smart-farm-api-server-design";
import { smartFarmDataCollectorRecovery } from "./notes/smart-farm-data-collector-recovery";
import { smartFarmDbReplication } from "./notes/smart-farm-db-replication";
import { smartFarmMonitoringEngine } from "./notes/smart-farm-monitoring-engine";
import { smartFarmRemoteDeviceControl } from "./notes/smart-farm-remote-device-control";
import { noteCnnLightweightOptimization } from "./notes/note-cnn-lightweight-optimization";
import { noteYolov3TinyLayerArchitecture } from "./notes/note-yolov3-tiny-layer-architecture";
import { noteIm2colGemmBottleneck } from "./notes/note-im2col-gemm-bottleneck";
import { noteMixedPrecisionCnn } from "./notes/note-mixed-precision-cnn";
import { noteInt8QuantizationOverflow } from "./notes/note-int8-quantization-overflow";
import { noteTensorflowCBindingArm } from "./notes/note-tensorflow-c-binding-arm";
import { noteArmFp16Compiler } from "./notes/note-arm-fp16-compiler";
import { noteConvMaxpoolIntegration } from "./notes/note-conv-maxpool-integration";
import { noteCnnModelExtensionResnetMobilenet } from "./notes/note-cnn-model-extension-resnet-mobilenet";

export const technicalNotes: TechnicalNoteCard[] = [
  dbRoundTripOptimization,
  asyncPipelineTransition,
  rabbitmqEventTopology,
  aiLogAnalysisLatency,
  metricCardinalityTroubleshooting,
  aiDevopsRetrospective,
  querydslProjectionOptimization,
  albCorsTroubleshooting,
  googleOauthExceptionMasking,
  openaiResponseDirectAccess,
  multirepoCI,
  statelessPromptContextLoss,
  socialIdUniqueConstraintMismatch,
  llmResponseFormatNotEnforced,
  smartFarmDataCollectorRecovery,
  smartFarmDbReplication,
  smartFarmRemoteDeviceControl,
  smartFarmApiServerDesign,
  smartFarmMonitoringEngine,
  eksObservabilityCloudwatchOpensearch,
  fluentbitCloudwatchLogPipeline,
  jenkinsEcrArgoCdCicd,
  kubernetesHpaClusterAutoscaler,
  springbootJwtSocialLogin,
  swaggerApiDocumentation,
  containerImageArchitectureCompatibility,
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
