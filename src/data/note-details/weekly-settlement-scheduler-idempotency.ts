import type { TechnicalNoteDetail } from "@/types/note";
import { weeklySettlementSchedulerIdempotency } from "../notes/weekly-settlement-scheduler-idempotency";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const weeklySettlementSchedulerIdempotencyDetail: TechnicalNoteDetail = {
  ...weeklySettlementSchedulerIdempotency,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "매니저 정산은 주기적으로 자동 실행되어야 했습니다. 정산 대상은 지난주에 완료된 예약 중 아직 정산 처리가 되지 않은 건이며, 초기에는 다음 설계 요건을 동시에 만족해야 했습니다.",
    },
    {
      type: "list",
      items: [
        "정산이 매주 특정 시점에 자동으로 실행되어야 한다.",
        "같은 예약이 두 번 정산되면 안 된다 (이중 지급 방지).",
        "스케줄러가 실패하거나 누락된 경우를 대비해 관리자가 수동으로도 실행할 수 있어야 한다.",
        "스케줄러와 수동 실행이 동일한 계산 로직을 사용해야 한다.",
      ],
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "정산처럼 금전이 관련된 배치 작업은 중복 실행 방지가 핵심 설계 요소입니다. 스케줄러가 정상 실행되더라도 같은 예약이 두 번 정산되면 매니저에게 이중 지급이 발생합니다.",
        "스케줄러와 수동 실행이 다른 서비스 메서드를 호출하면 복구 시 동작이 달라질 수 있습니다. 수동 실행은 스케줄러 오류 복구 수단이므로 두 경로의 동작이 동일해야 합니다.",
        "수수료율이 코드 여러 곳에 하드코딩되어 있으면 변경 시 누락이 생기고 불일치가 발생합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "조회 단계 중복 제외",
          description:
            "getCompletedReservationsWithoutSettlement 쿼리가 기존 Settlement 레코드가 없는 완료 예약만 반환합니다. 같은 기간을 두 번 실행해도 이미 생성된 Settlement가 있는 예약은 조회 단계에서 걸러집니다.",
          badge: "멱등성",
        },
        {
          title: "수동·자동 동일 메서드",
          description:
            "SettlementScheduler와 POST /api/admin/settlements 모두 동일한 createWeeklySettlement 메서드를 호출합니다. 차이는 날짜 범위 계산 방식과 settledBy 값(시스템=0L, 관리자=관리자ID)뿐입니다.",
          badge: "단일 진입점",
        },
        {
          title: "SettlementConfig 상수화",
          description:
            "SettlementConfig.FEE_RATE = 30으로 수수료율을 한 곳에서 관리합니다. 수수료율이 변경될 때 SettlementConfig만 수정하면 계산 로직 전체에 반영됩니다.",
          badge: "단일 변경점",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "java",
      filename: "SettlementScheduler.java",
      code: "@Scheduled(cron = \"0 0 2 * * THU\")  // 매주 목요일 새벽 2시\npublic void runWeeklySettlement() {\n    LocalDate startDate = LocalDate.now()\n        .minusWeeks(1)\n        .with(DayOfWeek.MONDAY);  // 지난주 월요일\n    LocalDate endDate = startDate.plusDays(6); // 지난주 일요일\n    adminSettlementService.createWeeklySettlement(\n        startDate, endDate, 0L  // settledBy=0L: 시스템 자동\n    );\n}",
    },
    {
      type: "code",
      language: "java",
      filename: "SettlementCalculator.java",
      code: "// SettlementConfig.FEE_RATE = 30\nint platformFee = price * FEE_RATE / 100;\nint managerAmount = price * (100 - FEE_RATE) / 100;",
    },
    troubleshootingHeading(4),
    {
      type: "list",
      items: [
        "정산 실행 방식: 수동 실행만 가능 → 자동(매주 목요일 2시) + 수동 병행",
        "중복 정산 위험: 수동 실행 시 중복 가능 → 조회 단계에서 기존 Settlement 제외",
        "수수료율 변경 방법: 코드 여러 곳 수정 → SettlementConfig 한 곳만 수정",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "같은 날짜 범위로 정산을 여러 번 실행해도 두 번째 이후 실행에서 대상 예약이 조회되지 않아 신규 Settlement가 생성되지 않습니다. 스케줄러 실패 시 관리자가 날짜 범위를 지정해 수동 실행하면 동일한 계산 결과가 보장됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "현재 스케줄러는 단일 JVM 인스턴스를 전제합니다. 서버가 여러 대로 늘어나면 같은 시각에 여러 인스턴스가 동시에 정산을 실행할 수 있습니다. 중복 정산 방지 쿼리가 어느 정도 보호하지만 ShedLock이나 데이터베이스 락을 추가하면 더 안전합니다. 또한 SettlementStatus.PENDING에서 SETTLED로 전이하는 처리가 아직 구현되지 않아, 정산 생성 후 실제 지급 상태 전이 흐름을 명확히 할 필요가 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "statistic-concurrency-optimistic-lock",
    "multi-module-shared-domain-port-pattern",
  ],
};
