import type { TechnicalNoteDetail } from "@/types/note";
import { celeryPreforkAsyncioNullpool } from "../notes/celery-prefork-asyncio-nullpool";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const celeryPreforkAsyncioNullpoolDetail: TechnicalNoteDetail = {
  ...celeryPreforkAsyncioNullpool,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "Celery + Redis 기반 파이프라인 실행 비동기화 구현 후 부하 테스트에서 태스크 약 50%가 DB 쿼리 단계에서 실패했습니다. 성공과 실패가 섞여 있어 재현도 불안정했습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "Celery prefork worker는 asyncio.run()마다 새 event loop를 생성하고 닫습니다. pool에 캐시된 커넥션이 닫힌 loop에 묶여 다음 태스크에서 mismatch가 발생합니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "asyncio.run()은 호출마다 새 event loop를 생성하고 완료 시 닫습니다.",
        "Task 1 완료 후 asyncpg 커넥션 C1이 닫힌 Loop L1에 바인딩된 채 QueuePool에 캐시됩니다.",
        "Task 2가 새 Loop L2에서 C1을 재사용하려 할 때 'attached to a different loop' RuntimeError가 발생합니다.",
        "dispose(close=False)는 커넥션 참조만 제거하며 pool 내부 async 상태는 초기화하지 않아 재발합니다.",
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "celery-worker-error.txt",
      code: "RuntimeError: Task <Task pending name='Task-46' coro=<execute_pipeline_run()...>>\n  got Future <Future pending cb=[BaseProtocol._on_waiter_completed()]>\n  attached to a different loop\nRuntimeError: Event loop is closed\n\n# pool pre-ping 단계에서 발생\n# execute_pipeline_run aborted: context load failed",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "NullPool 도입",
          description:
            "Celery worker 컨텍스트에서 DB_NULL_POOL=true 환경 변수로 NullPool을 선택합니다. 매 세션마다 새 커넥션을 생성하고 즉시 닫아 loop mismatch 가능성을 원천 차단합니다.",
          badge: "NullPool",
        },
        {
          title: "API 서버 QueuePool 유지",
          description:
            "API 서버는 asyncio.run()을 반복 호출하지 않으므로 기존 QueuePool을 그대로 유지합니다. 환경 변수로 pool 선택을 분기합니다.",
          badge: "QueuePool",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "NullPool은 커넥션 풀링 오버헤드가 없는 대신 태스크마다 TCP 핸드셰이크 비용이 발생합니다. Celery worker는 동시 요청이 많지 않고 태스크 실행 시간이 초 단위이므로 이 비용은 무시할 수 있습니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "태스크 실패율",
          before: "~50%",
          after: "0%",
          change: "-100%",
        },
        {
          label: "'different loop' 에러",
          before: "간헐적 발생",
          after: "미발생",
          change: "해소",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "모든 태스크가 'Task ... succeeded in Xs' 로그로 완료됩니다. context load failed 에러가 사라졌습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "asyncio.run()은 반복 호출마다 loop가 교체됩니다. Celery prefork 환경에서 QueuePool과 함께 사용하면 loop mismatch가 발생합니다.",
        "QueuePool.dispose(close=False)는 커넥션 참조만 제거하며 pool의 내부 async 상태는 초기화하지 않습니다.",
        "Celery worker처럼 asyncio.run()을 반복 호출하는 환경에서는 NullPool이 올바른 선택입니다.",
        "API 서버와 Celery worker가 같은 DB engine 설정을 공유할 때 환경 변수로 pool 전략을 분기할 수 있습니다.",
      ],
    },
  ],
  relatedNoteSlugs: ["async-session-join-optimization", "async-pipeline-transition"],
};
