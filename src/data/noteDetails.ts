import type { TechnicalNoteDetail } from "@/types/note";
import { aiDevopsRetrospectiveDetail } from "./note-details/ai-devops-retrospective";
import { aiLogAnalysisLatencyDetail } from "./note-details/ai-log-analysis-latency";
import { asyncPipelineTransitionDetail } from "./note-details/async-pipeline-transition";
import { dbRoundTripOptimizationDetail } from "./note-details/db-round-trip-optimization";
import { metricCardinalityTroubleshootingDetail } from "./note-details/metric-cardinality-troubleshooting";
import { rabbitmqEventTopologyDetail } from "./note-details/rabbitmq-event-topology";

export const noteDetails: TechnicalNoteDetail[] = [
  dbRoundTripOptimizationDetail,
  asyncPipelineTransitionDetail,
  rabbitmqEventTopologyDetail,
  aiLogAnalysisLatencyDetail,
  metricCardinalityTroubleshootingDetail,
  aiDevopsRetrospectiveDetail,
];
