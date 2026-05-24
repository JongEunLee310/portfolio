import type { TechnicalNoteDetail } from "@/types/note";
import { multiModuleSharedDomainPortPattern } from "../notes/multi-module-shared-domain-port-pattern";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const multiModuleSharedDomainPortPatternDetail: TechnicalNoteDetail = {
  ...multiModuleSharedDomainPortPattern,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "멀티모듈 전환 과정에서 여러 모듈이 공통으로 참조해야 하는 엔티티를 어떤 모듈에 두어야 하는지 결정하기 어려웠습니다. Reservation과 ServiceCategory는 reservation 모듈이 소유해야 하는 엔티티지만, evaluation(리뷰)과 payment(정산) 모듈도 예약 정보에 접근해야 했습니다.",
    },
    {
      type: "list",
      items: [
        "리뷰 작성 시 해당 예약이 완료 상태인지 확인 (evaluation → reservation)",
        "정산 처리 시 완료된 예약 목록과 금액 조회 (payment → reservation)",
        "evaluation이 reservation 모듈을 직접 의존하거나 reservation이 evaluation을 의존하면 순환 참조 또는 불필요한 결합이 생깁니다.",
      ],
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심은 엔티티의 소유권과 접근 필요성이 다른 모듈에 분산되어 있다는 점입니다. Reservation의 소유 모듈은 reservation이지만 접근이 필요한 모듈은 evaluation, payment입니다. 소유 모듈이 다른 모듈에 엔티티를 직접 제공하면 제공받는 쪽이 제공하는 쪽의 내부 구현에 묶이게 됩니다.",
    },
    {
      type: "list",
      items: [
        "evaluation → reservation 직접 의존 시: reservation 내부 구조 변경이 evaluation에 영향을 줍니다.",
        "reservation → evaluation 직접 의존 시: 순환 참조 발생 위험이 있습니다. 실제로 reservation/build.gradle에 evaluation과 payment를 직접 의존하는 상태에서 역방향 의존이 생기면 빌드가 실패합니다.",
        "공유 엔티티를 각 모듈에 복사하면 엔티티 불일치와 동기화 문제가 발생합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "shared-domain 모듈 분리",
          description:
            "Reservation, ServiceCategory 엔티티와 공통 Enum(ReservationStatus, MatchStatus)을 shared-domain 모듈에 배치해 모든 모듈이 같은 타입을 참조합니다.",
          badge: "8개 파일",
        },
        {
          title: "ReservationQueryPort 인터페이스",
          description:
            "다른 모듈이 예약 데이터에 접근하는 방법을 인터페이스로 정의합니다. 접근자는 이 인터페이스만 알면 되고, 구현은 reservation 모듈 내부에 숨깁니다.",
          badge: "Port & Adapter",
        },
        {
          title: "구현체는 reservation 모듈에",
          description:
            "ReservationQueryPortImpl이 인터페이스를 구현하고 내부적으로 JPA Repository와 QueryDSL 쿼리를 수행합니다. Spring DI가 런타임에 구현체를 주입합니다.",
          badge: "의존성 역전",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "text",
      filename: "shared-domain 모듈 구성 (8개 파일)",
      code: "shared-domain/\n└── com/kernel/sharedDomain/\n    ├── domain/entity/\n    │   ├── Reservation.java\n    │   └── ServiceCategory.java\n    ├── common/enums/\n    │   ├── ReservationStatus.java\n    │   └── MatchStatus.java\n    └── service/\n        ├── ReservationQueryPort.java   // 13개 메서드\n        └── response/\n            ├── ScheduleAndMatchInfo.java\n            ├── ReservationScheduleInfo.java\n            └── ReservationManagerMappingInfo.java",
    },
    {
      type: "paragraph",
      content:
        "evaluation, payment의 소스 파일 전체에서 import com.kernel.reservation.* 검색 결과 0건입니다. 두 모듈은 com.kernel.sharedDomain.service.ReservationQueryPort만 참조합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "list",
      items: [
        "전체 서브 모듈 수: 8개 (admin, evaluation, global, inquiry, member, payment, reservation, shared-domain)",
        "shared-domain을 참조하는 모듈 수: 4개 (reservation, member, payment, evaluation)",
        "reservation 모듈을 직접 의존하는 모듈 수: 0개 (evaluation, payment 모두 reservation 직접 의존 없음)",
        "Port 인터페이스로 차단한 순환 참조 위험: 2건 (evaluation→reservation, payment→reservation)",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "evaluation과 payment가 reservation 내부의 Repository 클래스명, QueryDSL 구현, 패키지 구조에 의존하지 않게 됐습니다. Port 인터페이스 시그니처가 유지되는 한 reservation 내부 쿼리 최적화나 Repository 리팩토링이 다른 모듈에 영향을 주지 않습니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "reservation 모듈이 evaluation과 payment를 직접 의존하는 방향은 Port 패턴으로 해소되지 않았습니다. 이 방향은 향후 개선이 필요한 지점입니다. ReservationQueryPort의 13개 메서드에는 리뷰 검증용, 매니저 정산용, 관리자 정산용 조회가 혼재해 있어 사용 목적별 인터페이스 분리도 고려할 필요가 있습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "info",
      content:
        "멀티모듈에서 가장 어려운 결정은 어떤 엔티티를 어디에 둘 것인가입니다. 핵심 판단 기준은 엔티티의 소유권과 접근 필요성을 분리해서 생각하는 것입니다. 어떤 모듈이 데이터를 소유해야 하는지와 어떤 모듈이 데이터를 사용하는지가 다를 때 그 사이에 인터페이스를 두는 것이 모듈 경계를 지키는 방법입니다.",
    },
  ],
  relatedNoteSlugs: [
    "domain-module-boundary-from-monolith",
    "querydsl-info-layer-data-flow",
  ],
};
