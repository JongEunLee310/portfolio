import type { TechnicalNoteDetail } from "@/types/note";
import { sensorLogTableGrowthQueryDegradation } from "../notes/sensor-log-table-growth-query-degradation";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const sensorLogTableGrowthQueryDegradationDetail: TechnicalNoteDetail = {
  ...sensorLogTableGrowthQueryDegradation,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 온도, 습도, 조도, 토양 수분 등 센서 데이터를 주기적으로 수집하고 MySQL에 누적 저장하는 구조를 목표로 했습니다. 센서 데이터는 사용자가 직접 입력하는 데이터와 달리 시간이 지날수록 자동으로 증가합니다. 초기에는 데이터 양이 많지 않아 단순 조회로도 문제가 드러나지 않을 수 있지만, 데이터가 누적될수록 조회 구조에 따라 성능이 나빠질 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "최신값 조회 왜곡",
          description: "대시보드에서 현재 온도·습도를 보여줄 때 전체 이력 중 마지막 값을 찾아야 하는 구조",
          badge: "최신값",
        },
        {
          title: "기간 그래프 조회",
          description: "특정 시간 범위 변화 추이를 표시할 때 기간 조건 없이 전체 로그를 조회하는 구조",
          badge: "그래프",
        },
        {
          title: "구역별 상태 조회",
          description: "특정 스마트팜 구역의 전체 센서 상태를 확인할 때 불필요한 범위까지 읽는 구조",
          badge: "구역",
        },
        {
          title: "통계 조회",
          description: "평균·최대·최소·이상 상태 발생 횟수를 계산할 때 원본 전체를 매번 탐색하는 구조",
          badge: "통계",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이 문제는 단순한 DB 튜닝 문제가 아닙니다. 스마트팜 모니터링 시스템이 장기 운영될 수 있는 구조인지 확인하는 문제입니다. '데이터가 적을 때는 빠르다'는 관찰이 '구조가 안전하다'는 근거가 될 수 없습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심 원인은 센서 로그 데이터를 시계열성 데이터로 인식하지 않고 일반 CRUD 조회 방식으로 접근했다는 점입니다. 일반 사용자 데이터는 전체 건수가 느리게 증가하지만, 센서 로그는 장비 수와 전송 주기에 따라 빠르게 누적됩니다. 조회 구조가 이 증가를 고려하지 않으면 데이터가 많아질수록 성능이 선형적으로 나빠집니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "조회 패턴 분석 부족",
          description: "어떤 조건으로 자주 조회하는지 정리되지 않아 인덱스 설계 기준이 없었음",
          badge: "분석",
        },
        {
          title: "기간 조건 부재",
          description: "그래프·이력 조회에 시간 범위 제한이 없어 전체 로그를 대상으로 조회",
          badge: "기간",
        },
        {
          title: "최신값 조회 최적화 부족",
          description: "센서별 최신 1건을 찾기 위해 전체 이력을 정렬하거나 애플리케이션에서 필터링",
          badge: "최신",
        },
        {
          title: "저장 구조와 조회 구조 미분리",
          description: "원본 로그 테이블이 최신값·기간·통계 모든 화면 요청을 동시에 처리",
          badge: "구조",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "센서 데이터에서 자주 조회하는 조건은 sensorId, measuredAt, farmId, zoneId, sensorType 등의 조합입니다. 이 중 어떤 조합이 실제로 많이 쓰이는지 파악하지 않으면 인덱스를 추가해도 효과가 없을 수 있습니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 센서 로그 테이블을 '계속 증가하는 시계열 데이터'로 보고, 조회 목적별로 접근 방식을 나누는 것입니다. 대시보드에서 필요한 데이터는 대부분 전체 로그가 아니라 제한된 범위입니다. 최신값 조회는 센서별 최신 1건, 그래프 조회는 선택한 기간, 통계는 특정 기간 집계로 구분해야 합니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "단순 로그 조회 구조",
          description: "조회 목적을 구분하지 않고 원본 로그를 직접 조회하는 구조입니다.",
          bullets: [
            "최신값을 전체 이력에서 마지막 값으로 선택",
            "그래프 조회에 기간 조건 없이 전체 반환",
            "애플리케이션에서 필터링·정렬 처리",
            "데이터 증가에 따라 응답 시간 선형 증가",
            "통계 계산 시 매번 원본 전체 탐색",
          ],
        },
        {
          title: "조회 패턴 기반 구조",
          description: "화면 목적에 맞게 조회 조건과 인덱스를 분리하는 구조입니다.",
          bullets: [
            "최신값은 센서별 최신 1건만 조회",
            "그래프 조회에 measuredAt 범위 조건 필수",
            "DB에서 정렬·필터링 처리",
            "인덱스와 기간 조건으로 row 스캔 범위 제한",
            "통계는 기간 제한 또는 집계 구조 검토",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "인덱스는 단순히 추가한다고 해결되는 것이 아니라 실제 조회 조건과 맞아야 효과가 있습니다. 주요 조회 패턴인 '특정 센서의 최신값', '특정 기간의 그래프', '구역별 상태'에 따라 필요한 인덱스 후보가 달라집니다. 또한 오래된 데이터에 대한 보관 전략도 함께 검토해야 합니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 센서 로그가 계속 증가하는데 조회 조건이 충분히 제한되지 않았을 때 성능 저하가 발생하는 흐름입니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "before-query-optimization.mermaid",
      code: "flowchart TD\n    A[Sensor Data Ingestion] --> B[(Sensor Log Table)]\n    B --> C[Table Rows Grow Over Time]\n\n    D[Dashboard Request] --> E[Query Sensor Logs]\n    E --> F{Query Uses Proper Filter?}\n\n    F -- No --> G[Scan Large Row Range]\n    G --> H[Sort or Filter Many Rows]\n    H --> I[Slow Response]\n\n    F -- Yes --> J[Use Sensor + Time Range Condition]\n    J --> K[Return Required Rows Only]",
    },
    {
      type: "paragraph",
      content:
        "아래 표는 조회 목적별로 문제 구조와 개선 방향을 비교한 것입니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "문제 구조",
          description: "조회 목적을 구분하지 않은 상태입니다.",
          bullets: [
            "최신값: 전체 이력에서 마지막 값 선택",
            "그래프: 전체 로그 조회 후 화면에서 필터링",
            "정렬: 애플리케이션에서 정렬 처리",
            "반환: 필요 이상으로 많은 row 반환",
          ],
        },
        {
          title: "개선 방향",
          description: "조회 목적별로 접근 방식을 나눈 상태입니다.",
          bullets: [
            "최신값: 센서별 최신 1건만 조회",
            "그래프: measuredAt 범위 조건으로 DB에서 제한",
            "정렬: DB 인덱스와 ORDER BY 활용",
            "반환: 필요한 컬럼과 기간만 반환",
          ],
        },
      ],
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드와 DB 실행 계획이 남아 있지 않기 때문에, 검증했어야 하는 기준을 정리합니다. 검증에서 중요한 것은 API 응답이 성공하는지가 아니라, 데이터가 많아져도 조회 시간이 크게 늘어나지 않는지를 확인하는 것입니다.",
    },
    {
      type: "list",
      items: [
        "최신값 조회: 특정 센서에 데이터 다수 존재 → 가장 최근 measuredAt 1건 반환",
        "기간 그래프 조회: 최근 24시간 조건 → 해당 기간 데이터만 반환",
        "오래된 데이터 포함: 과거 데이터 대량 존재 → 최근 조회 성능이 크게 영향받지 않음",
        "센서별 조회: 여러 센서 데이터 혼재 → 특정 센서 데이터만 반환",
        "구역별 조회: 여러 구역 데이터 혼재 → 특정 구역 데이터만 반환",
        "기간 조건 누락: 전체 이력 요청 → 기본 기간 적용 또는 범위 제한",
        "정렬 확인: measuredAt 기준 정렬 요청 → DB 정렬 결과가 시간 순서와 일치",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 최신값·기간 조회 API 응답 시간, 조회당 반환 row 수, 전체 row 수 대비 조회 row 비율(조회 범위 제한 효과), 인덱스 적용 전후 응답 시간 비교, full scan 발생 여부(쿼리 구조 위험도 확인)",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "센서 로그 테이블 증가 문제를 성능 관점에서 정리하면서, 스마트팜 모니터링 시스템은 데이터 저장뿐 아니라 데이터 조회의 지속 가능성까지 고려해야 한다는 점을 확인할 수 있었습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "최신값 조회",
          description:
            "전체 이력에서 마지막 값을 선택하던 구조에서 → 센서별 최신 1건 중심 조회 구조로",
          badge: "최신값",
        },
        {
          title: "그래프 조회",
          description:
            "전체 로그를 반환하던 구조에서 → measuredAt 범위 조건으로 DB에서 제한하는 구조로",
          badge: "그래프",
        },
        {
          title: "데이터 증가 대응",
          description:
            "row 증가에 취약하던 구조에서 → 인덱스와 기간 조건으로 스캔 범위를 제한하는 구조로",
          badge: "증가",
        },
        {
          title: "운영 안정성",
          description:
            "장기 운영 시 성능 저하가 예측되던 구조에서 → 데이터 증가를 전제로 설계된 구조로",
          badge: "운영",
        },
      ],
    },
    {
      type: "list",
      items: [
        "대시보드 조회가 전체 로그에 의존하지 않도록 설계할 수 있습니다.",
        "센서별 최신값 조회와 기간별 그래프 조회를 분리할 수 있습니다.",
        "데이터가 증가해도 주요 조회 성능 저하를 줄일 수 있습니다.",
        "인덱스와 조회 조건을 실제 사용 패턴에 맞게 검토할 수 있습니다.",
        "장기적으로 집계 테이블·파티셔닝·아카이빙 같은 확장 전략을 검토할 기반이 생깁니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 DB 실행 계획이 남아 있지 않아 인덱스 적용 효과나 응답 시간 개선 수치는 확인할 수 없습니다. 이 문서에서는 센서 로그 증가에 대비한 조회 구조 설계 판단을 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 배운 점은 센서 데이터 저장 기능은 처음부터 장기 누적을 전제로 설계해야 한다는 것입니다. 초기 데이터가 적을 때 빠르게 동작한다고 해서 구조가 안전하다고 볼 수 없습니다. 스마트팜 대시보드는 대부분 전체 데이터가 아니라 목적별로 제한된 데이터를 필요로 합니다. 이처럼 조회 목적이 다르다면 쿼리도 다르게 설계해야 합니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "인덱스는 '있으면 좋은 것'이 아니라 조회 패턴과 맞아야 효과가 있습니다. sensorId, measuredAt, farmId, zoneId, sensorType 같은 컬럼이 어떤 조합으로 실제로 조회되는지 먼저 파악해야 합니다. 조합이 맞지 않는 인덱스는 조회 성능에 도움이 되지 않고 쓰기 성능만 떨어뜨릴 수 있습니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 실제 조회 패턴을 기준으로 인덱스를 설계해야 합니다. 대시보드 최신값 조회 전용으로 센서별 최신 상태를 별도 구조로 관리하면 응답 속도를 안정화할 수 있습니다. 기간 그래프 조회에는 기본 조회 범위를 두어 실수로 전체 이력을 요청하는 상황을 방지할 수 있습니다. 데이터가 충분히 쌓이면 날짜 단위 파티셔닝이나 시간 단위 집계 테이블이 자연스러운 확장 방향이 됩니다.",
    },
  ],
  relatedNoteSlugs: [
    "smart-farm-cloud-monitoring-architecture",
    "sensor-data-flow-responsibility-separation",
    "sensor-rest-ingestion-validation",
    "duplicate-sensor-data-idempotency",
    "sensor-timestamp-measurement-storage-mismatch",
  ],
};
