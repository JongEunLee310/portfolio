import type { TechnicalNoteCard } from "@/types/note";
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
];
