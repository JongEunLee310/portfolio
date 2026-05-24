import type { TechnicalNoteDetail } from "@/types/note";
import { asyncPipelineTransition } from "../notes/async-pipeline-transition";

export const asyncPipelineTransitionDetail: TechnicalNoteDetail = {
  ...asyncPipelineTransition,
  template: "technical-summary",
  toc: [
    { id: "background", title: "전환 배경", depth: 1 },
    { id: "problem", title: "동기 실행의 문제", depth: 1 },
    { id: "solution", title: "202 Accepted 패턴", depth: 1 },
    { id: "implementation", title: "구현 핵심", depth: 1 },
    { id: "caution", title: "주의점", depth: 1 },
    { id: "result", title: "개선 결과", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "background",
      title: "1. 전환 배경",
    },
    {
      type: "paragraph",
      content:
        "파이프라인 실행은 Git clone, 의존성 설치, Job 순차 실행, 로그 저장까지 수 초에서 수십 초가 걸립니다. 초기 구현에서는 POST /run 엔드포인트가 이 전체 과정을 동기로 처리했습니다. 단일 요청이 커넥션을 수십 초 동안 점유하자 커넥션 풀이 고갈됐고, 그 사이에 들어오는 GET /projects 같은 단순 조회 요청도 대기 상태에 빠졌습니다.",
    },
    {
      type: "heading",
      id: "problem",
      title: "2. 동기 실행의 문제",
    },
    {
      type: "comparison",
      items: [
        {
          title: "동기 실행 흐름",
          description: "POST /run이 완료까지 커넥션을 점유합니다.",
          bullets: [
            "Git clone (3~10s)",
            "의존성 설치 (5~30s)",
            "Job 순차 실행 (임의)",
            "JobRunLog 저장 → 응답 반환",
          ],
        },
        {
          title: "커넥션 풀 영향",
          description: "동시 실행 요청이 늘면 풀이 고갈됩니다.",
          bullets: [
            "기본 풀 크기: 5개",
            "파이프라인 3개 동시 실행 → 풀 60% 점유",
            "단순 GET 요청도 커넥션 대기",
            "pool_timeout으로 500 에러 발생",
          ],
        },
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "connection-pool-log.txt",
      code: "# pool_timeout 초과 에러\nTimeoutError: QueuePool limit of size 5 overflow 10\nreached, connection timed out, timeout 30.00\n\n# 당시 활성 커넥션 분포\nPOST /pipelines/a1/run   → 18s 점유 중\nPOST /pipelines/a2/run   → 24s 점유 중\nGET  /projects           → 대기 (풀 고갈)",
    },
    {
      type: "heading",
      id: "solution",
      title: "3. 202 Accepted 패턴",
    },
    {
      type: "paragraph",
      content:
        "요청 수신과 실행을 분리했습니다. POST /run은 PipelineRun을 QUEUED 상태로 생성하고 즉시 202를 반환합니다. 실제 실행은 FastAPI BackgroundTasks를 통해 별도 태스크로 위임합니다. 클라이언트는 GET /pipelines/{id}/run/{run_id}로 상태를 폴링합니다.",
    },
    {
      type: "list",
      items: [
        "DRAFT → READY → QUEUED: 요청 수신 시 전이. 202 반환 시점의 상태.",
        "QUEUED → RUNNING: BackgroundTask가 실행을 시작하는 시점에 전이.",
        "RUNNING → SUCCESS / FAILED: 모든 Job 완료 후 결과에 따라 전이.",
      ],
    },
    {
      type: "heading",
      id: "implementation",
      title: "4. 구현 핵심",
    },
    {
      type: "code",
      language: "python",
      filename: "pipelines.py",
      code: "@router.post(\"/pipelines/{id}/run\", status_code=202)\nasync def run_pipeline(\n    id: uuid.UUID,\n    background_tasks: BackgroundTasks,\n    session: AsyncSession = Depends(get_session),\n) -> PipelineRunAcceptedResponse:\n    # 요청 세션 안에서: PipelineRun 생성 + QUEUED 전이\n    pipeline_run = PipelineRun(pipeline_id=id, status=PipelineRunStatus.QUEUED)\n    session.add(pipeline_run)\n    await session.commit()  # 여기서 커넥션 반환\n\n    # 별도 태스크로 디스패치 — 요청 세션과 무관\n    background_tasks.add_task(execute_pipeline_run, pipeline_run.id)\n\n    return PipelineRunAcceptedResponse(\n        pipeline_run_id=pipeline_run.id,\n        status=PipelineRunStatus.QUEUED,\n    )",
    },
    {
      type: "code",
      language: "python",
      filename: "pipeline_execution_service.py",
      code: "async def execute_pipeline_run(pipeline_run_id: uuid.UUID) -> None:\n    # 요청 세션이 아닌 독립적인 세션을 생성\n    async with AsyncSessionLocal() as session:\n        pipeline_run = await session.get(PipelineRun, pipeline_run_id)\n        pipeline_run.status = PipelineRunStatus.RUNNING\n        await session.commit()\n\n        workspace = await git_cloner.clone(pipeline_run.repository_url)\n\n        for job in pipeline_run.jobs:\n            job_run_log = await executor.execute(job, workspace)\n            await repository.save_job_run_log(session, job_run_log)\n\n        pipeline_run.status = PipelineRunStatus.SUCCESS\n        await session.commit()",
    },
    {
      type: "heading",
      id: "caution",
      title: "5. 주의점",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "execute_pipeline_run은 반드시 자체 AsyncSessionLocal()을 생성해야 합니다. 요청 핸들러의 session을 캡처해 사용하면 요청 컨텍스트가 종료된 후 세션이 닫혀 MissingGreenlet 또는 DetachedInstanceError가 발생합니다.",
    },
    {
      type: "list",
      items: [
        "BackgroundTasks는 프로세스 재시작 시 태스크가 유실됩니다. 내구성이 필요하다면 RabbitMQ + Consumer 구조로 전환해야 합니다.",
        "QUEUED 상태의 PipelineRun이 쌓이면 워커 포화를 의미합니다. 동시 실행 수를 제한하는 세마포어나 큐 깊이 모니터링이 필요합니다.",
        "실패 시 FAILED 전이와 AI Review 요청이 원자적으로 처리되어야 합니다. 상태 업데이트 후 이벤트 발행 실패를 방지하기 위해 Transactional Outbox 패턴을 검토했습니다.",
      ],
    },
    {
      type: "heading",
      id: "result",
      title: "6. 개선 결과",
    },
    {
      type: "metrics",
      items: [
        {
          label: "POST /run 응답 시간",
          before: "18~45s",
          after: "80~150ms",
          change: "-99%",
        },
        {
          label: "커넥션 풀 점유 시간",
          before: "실행 전 구간",
          after: "commit 완료까지",
          change: "대폭 단축",
        },
        {
          label: "풀 고갈로 인한 500 에러",
          before: "동시 3건 이상 시 발생",
          after: "0건",
          change: "-100%",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "요청 흐름과 실행 흐름을 분리하자 커넥션 점유 시간이 대폭 줄었고, 실행 중 장애가 발생해도 다른 API 요청에 영향을 주지 않게 됐습니다. 실패 원인도 JobRunLog 기준으로 독립 추적할 수 있어 디버깅이 단순해졌습니다.",
    },
  ],
  relatedNoteSlugs: ["rabbitmq-event-topology", "celery-prefork-asyncio-nullpool", "db-round-trip-optimization"],
};
