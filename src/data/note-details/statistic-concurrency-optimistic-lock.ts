import type { TechnicalNoteDetail } from "@/types/note";
import { statisticConcurrencyOptimisticLock } from "../notes/statistic-concurrency-optimistic-lock";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const statisticConcurrencyOptimisticLockDetail: TechnicalNoteDetail = {
  ...statisticConcurrencyOptimisticLock,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "예약 체크아웃이 완료되거나 리뷰가 등록될 때 매니저와 수요자의 통계 테이블을 함께 갱신해야 했습니다. 통계에는 예약 수, 리뷰 수, 평균 평점처럼 여러 요청이 같은 사용자 통계 row를 동시에 변경할 수 있는 값이 포함되어 있었습니다.",
    },
    {
      type: "paragraph",
      content:
        "초기 구현에서는 Repository의 벌크 업데이트 쿼리로 카운트를 직접 증가시키는 방식과 엔티티를 조회해 도메인 메서드로 변경하는 방식이 섞여 있었습니다. 이 구조에서는 동시 요청이 들어올 때 통계 값의 일관성을 보장하기 어렵고, JPA의 변경 감지와 버전 기반 충돌 감지도 충분히 활용하기 어려웠습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "벌크 업데이트는 JPA 영속성 컨텍스트를 우회해 @Version 기반 충돌 감지와 함께 쓰기 어렵습니다. 동일 row를 엔티티 변경 방식과 혼재해 쓰면 변경 경로가 두 개가 됩니다.",
        "@Retryable은 Spring AOP 프록시를 통해 동작합니다. 같은 클래스 내부 호출이나 self-invocation 구조에서는 프록시가 적용되지 않아 재시도가 발생하지 않습니다.",
        "충돌 발생 시 재시도 횟수를 초과하면 클라이언트에 명확한 실패 응답(CONCURRENT_UPDATE_ERROR)을 내려줄 @Recover 처리가 별도로 필요했습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "벌크 업데이트 제거",
          description:
            "통계 Repository의 벌크 업데이트 메서드를 제거하고, 예약 완료 시 통계 엔티티를 조회한 뒤 도메인 메서드로 값을 변경하는 방식으로 일원화했습니다.",
          badge: "단일 변경 경로",
        },
        {
          title: "@Version 추가",
          description:
            "CustomerStatistic, ManagerStatistic 엔티티에 @Version 필드를 추가해 같은 row를 동시에 수정하면 JPA가 버전 값을 기준으로 충돌을 감지하도록 했습니다.",
          badge: "낙관적 락",
        },
        {
          title: "별도 서비스로 분리",
          description:
            "통계 갱신 로직을 ReservationStatisticUpdateServiceImpl로 분리해 @Retryable이 AOP 프록시를 통해 정상 적용되도록 트랜잭션 경계를 정리했습니다.",
          badge: "프록시 경계 분리",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "예약 체크아웃 흐름은 ManagerStatistic, CustomerStatistic을 조회한 다음 ReservationStatisticUpdateService에 갱신을 위임합니다. ReservationStatisticUpdateServiceImpl의 통계 갱신 메서드에 @Retryable이 적용되고, OptimisticLockException 발생 시 최대 5회, 50ms 간격으로 재시도합니다.",
    },
    {
      type: "code",
      language: "java",
      filename: "ReservationStatisticUpdateServiceImpl.java",
      code: "@Retryable(\n    retryFor = OptimisticLockException.class,\n    maxAttempts = 5,\n    backoff = @Backoff(delay = 50)\n)\npublic void updateManagerStatistic(Long managerId) {\n    ManagerStatistic stat = managerStatisticRepository\n        .findByManagerId(managerId)\n        .orElseThrow(() -> new MemberStatisticException(MANAGER_STATISTIC_NOT_FOUND));\n    stat.increaseReservationCount();\n}\n\n@Recover\npublic void recoverManagerStatistic(\n        OptimisticLockException e, Long managerId) {\n    throw new MemberStatisticException(CONCURRENT_UPDATE_ERROR);\n}",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "통계 업데이트 구조 변경 전후 정량 측정값이 없습니다. 동시성 부하 테스트 없이 히스토리 커밋 기준으로 정리한 사례입니다.",
    },
    {
      type: "list",
      items: [
        "벌크 업데이트와 엔티티 변경 혼재 → 엔티티 조회 후 도메인 메서드 호출 단일화",
        "@Version 기반 낙관적 락 도입으로 동시 수정 충돌 감지 가능",
        "@Retryable 최대 5회 재시도, @Recover에서 CONCURRENT_UPDATE_ERROR 반환",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "통계 갱신 책임이 별도 서비스로 분리되고, 충돌 시 자동 재시도와 실패 응답 흐름이 명확해졌습니다. 예약 완료와 리뷰 등록 모두 동일한 구조로 통계를 갱신하며, 도메인 메서드가 카운트와 평균 평점 계산 책임을 담당합니다.",
      },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "카운터성 데이터는 단순히 count = count + 1처럼 보이지만, 여러 요청이 같은 row를 변경하는 순간 동시성 문제가 됩니다. JPA에서 벌크 업데이트와 엔티티 변경 감지를 섞으면 변경 경로가 두 개가 돼 @Version 충돌 감지가 의도대로 동작하지 않습니다. @Retryable 같은 AOP 기반 기능은 프록시를 통과하는 public 메서드인지, 트랜잭션 경계가 적절한지까지 함께 확인해야 합니다.",
    },
  ],
  relatedNoteSlugs: [
    "n-plus-one-prevention-querydsl-projection",
    "weekly-settlement-scheduler-idempotency",
  ],
};
