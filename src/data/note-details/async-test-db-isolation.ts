import type { TechnicalNoteDetail } from "@/types/note";
import { asyncTestDbIsolation } from "../notes/async-test-db-isolation";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const asyncTestDbIsolationDetail: TechnicalNoteDetail = {
  ...asyncTestDbIsolation,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "통합 테스트를 여러 개 실행하면 이전 테스트에서 만든 데이터가 다음 테스트에 영향을 줘 결과가 달라졌습니다. 로컬에서는 통과하지만 CI에서 실패하는 비결정적 실패가 발생했습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "UUID 스키마로 테스트 세션을 격리하고, 트랜잭션 롤백으로 각 케이스를 격리합니다. 두 전략을 조합하면 세션 수준과 케이스 수준 격리를 모두 달성할 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "UNIQUE 제약이 있는 테이블(이메일, 사용자명)에서 이전 테스트 잔여 데이터로 중복 키 오류가 발생했습니다.",
        "'Pipeline이 없어야 한다'를 검증하는 테스트가 이전 테스트에서 만든 Pipeline을 읽어 실패했습니다.",
        "테스트 순서에 따라 결과가 달라져 CI 환경에서 간헐적으로 실패했습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "UUID 스키마 격리 (세션 수준)",
          description:
            "test_engine fixture(session scope)가 테스트 세션 시작 시 UUID 기반 스키마를 생성합니다. SQLAlchemy connect 이벤트로 search_path를 고정하고, 세션 종료 시 DROP SCHEMA CASCADE로 완전히 삭제합니다.",
          badge: "Schema Isolation",
        },
        {
          title: "트랜잭션 롤백 (케이스 수준)",
          description:
            "db_session fixture(function scope)가 각 테스트마다 트랜잭션을 시작하고 종료 시 롤백합니다. 테스트 성공/실패 여부와 관계없이 finally 블록에서 롤백을 보장합니다.",
          badge: "Rollback",
        },
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "tests/conftest.py",
      code: '# 세션 수준 격리: UUID 스키마 생성\nschema_name = f"test_{uuid.uuid4().hex}"\n\n@event.listens_for(engine.sync_engine, "connect")\ndef set_search_path(dbapi_connection, connection_record):\n    cursor = dbapi_connection.cursor()\n    cursor.execute(f\'SET search_path TO "{schema_name}"\')\n    cursor.close()\n\n# 케이스 수준 격리: 트랜잭션 롤백\nasync with session_factory() as session:\n    transaction = await session.begin()\n    try:\n        yield session\n    finally:\n        if transaction.is_active:\n            await transaction.rollback()',
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "DELETE로 정리하는 방식은 빠지는 데이터가 생길 수 있습니다. 트랜잭션 롤백만 사용하면 commit이 필요한 테스트에서 한계가 있습니다. UUID 스키마 + 롤백 조합이 완전한 격리를 보장합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "테스트 간 데이터 간섭",
          before: "발생",
          after: "없음",
          change: "완전 격리",
        },
        {
          label: "CI 비결정적 실패",
          before: "간헐적 발생",
          after: "미발생",
          change: "안정화",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "각 테스트 세션은 독립된 PostgreSQL 스키마에서 실행됩니다. 스키마는 테스트 세션 종료 시 자동으로 삭제됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "PostgreSQL 스키마는 테스트 격리의 강력한 도구입니다. search_path만 바꾸면 완전히 독립된 테이블 공간을 사용할 수 있습니다.",
        "session-scoped fixture와 function-scoped fixture를 조합해 세션 수준/케이스 수준 격리를 모두 처리할 수 있습니다.",
        "finally 블록으로 테스트 성공/실패 여부와 관계없이 스키마 정리를 보장합니다.",
        "TEST_DATABASE_URL 환경 변수를 필수화하면 CI 환경에서만 통합 테스트가 실행되도록 통제할 수 있습니다.",
      ],
    },
  ],
  relatedNoteSlugs: ["async-session-join-optimization", "async-sqlalchemy-eager-loading"],
};
