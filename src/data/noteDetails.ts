import type { TechnicalNoteDetail } from "@/types/note";
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

export const noteDetails: TechnicalNoteDetail[] = [
  dbRoundTripOptimizationDetail,
  asyncPipelineTransitionDetail,
  rabbitmqEventTopologyDetail,
  aiLogAnalysisLatencyDetail,
  metricCardinalityTroubleshootingDetail,
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
];
