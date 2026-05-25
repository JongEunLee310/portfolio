import type { TechnicalNoteDetail } from "@/types/note";
import { latestSensorValueQueryOptimization } from "../notes/latest-sensor-value-query-optimization";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const latestSensorValueQueryOptimizationDetail: TechnicalNoteDetail = {
  ...latestSensorValueQueryOptimization,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 온도, 습도, 조도, 토양 수분 등 센서 데이터를 주기적으로 수집하고, 사용자가 대시보드에서 현재 스마트팜 환경 상태를 확인할 수 있도록 하는 시스템이었습니다. 대시보드에서 가장 먼저 필요한 정보는 전체 센서 이력이 아니라, 각 센서의 가장 최근 측정값입니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "현재 온도",
          description: "온도 센서의 최신 측정값 — 전체 이력 중 마지막 값을 선택해야 하는 구조",
          badge: "온도",
        },
        {
          title: "현재 습도",
          description: "습도 센서의 최신 측정값 — 센서마다 개별 조회가 반복되는 구조",
          badge: "습도",
        },
        {
          title: "현재 조도",
          description: "조도 센서의 최신 측정값 — 데이터가 쌓일수록 조회 비용이 증가하는 구조",
          badge: "조도",
        },
        {
          title: "현재 상태 요약",
          description: "각 센서별 최신값 기반 상태 — 최신값 판단 기준이 명확하지 않은 구조",
          badge: "요약",
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "최신값만 필요한 상황에서 센서 이력 전체를 조회한 뒤, 애플리케이션이나 화면에서 마지막 값을 고르는 방식은 데이터가 쌓일수록 비효율적입니다. 초기 데이터가 적을 때는 문제가 잘 드러나지 않을 수 있지만, 스마트팜 센서 데이터는 주기적으로 계속 누적되기 때문에 최신값 하나를 얻기 위해 읽어야 하는 데이터가 불필요하게 늘어날 수 있습니다. 사용자는 스마트팜의 현재 상태를 빠르게 확인하고 싶기 때문에, 최신값 조회가 느리면 시스템 전체가 둔하게 느껴집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 근본 원인은 최신값 조회를 일반 이력 조회의 일부로 취급하는 것입니다. 센서 데이터 조회에는 여러 목적이 있습니다. 최신값 조회, 기간 그래프 조회, 통계 조회, 이상 이력 조회가 각각 다른 성격을 가지는데, 이 중 최신값 조회는 '많은 데이터를 보여주는 기능'이 아니라 '가장 최근 상태만 빠르게 확인하는 기능'입니다. 이를 이력 조회와 같은 방식으로 처리하면 다음 문제가 생깁니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "조회 목적 미분리",
          description: "최신값과 이력 조회를 같은 API나 쿼리로 처리해 불필요한 데이터 조회 발생",
          badge: "설계",
        },
        {
          title: "DB 정렬 미활용",
          description: "애플리케이션에서 마지막 값을 계산하는 방식으로 메모리와 CPU 낭비",
          badge: "정렬",
        },
        {
          title: "인덱스 부재",
          description: "최신값을 찾기 위해 많은 row를 탐색해 응답 시간 증가",
          badge: "인덱스",
        },
        {
          title: "측정 시각 기준 부족",
          description: "저장 시각 기준으로 최신을 판단해 늦게 도착한 과거 데이터가 최신값으로 보일 수 있음",
          badge: "시간",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "최신 센서값 조회에서는 measuredAt 기준이 중요합니다. 서버에 늦게 저장된 데이터의 createdAt이 더 클 수 있어 저장 시각 기준으로 최신을 판단하면 실제 최신 측정값이 아닌 지연 도착 데이터가 선택될 수 있습니다. 또한 여러 센서의 최신값을 각각 따로 조회하면 센서 개수만큼 쿼리가 반복되는 N회 조회 문제도 발생할 수 있습니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 최신값 조회를 이력 조회와 분리하고, DB에서 최신값만 선별하도록 하는 것입니다. 대시보드 현재 상태 조회와 그래프 이력 조회를 나누고, 최신값 조회는 측정 시각 기준으로 정렬해 필요한 건수만 반환하도록 합니다. 전체 이력을 가져온 뒤 최신값을 고르는 방식은 DB가 잘하는 일을 뒤늦게 반복하는 구조입니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "비효율 구조",
          description: "최신값 조회를 이력 조회와 분리하지 않은 상태입니다.",
          bullets: [
            "센서 이력 전체 조회 후 마지막 값 선택",
            "애플리케이션 또는 화면에서 정렬 처리",
            "저장 시각 기준으로 최신값 판단",
            "센서마다 별도 쿼리 반복 실행",
            "데이터 증가에 따라 응답 시간 선형 증가",
          ],
        },
        {
          title: "개선 구조",
          description: "조회 목적별로 분리해 DB에서 최신값만 선별하는 상태입니다.",
          bullets: [
            "measuredAt DESC 기준 최신 row만 조회",
            "DB 정렬과 조회 건수 제한 활용",
            "측정 시각 기준으로 최신값 판단",
            "여러 센서의 최신값을 한 번의 조회로 처리 검토",
            "현재 상태 조회 경로를 데이터 증가에 안정적으로 유지",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "단일 센서의 최신값이라면 sensorId와 measuredAt 조합 인덱스를 활용해 최신 1건만 반환하는 방식이 기본입니다. 여러 센서의 최신값을 한 번에 가져와야 한다면 GROUP BY 후 JOIN, Window Function, 또는 별도의 최신 상태 테이블 등 다양한 방식을 DB 버전과 센서 수를 고려해 검토할 수 있습니다. 초기 단계에서는 쿼리 최적화로 충분하지만, 센서 수가 늘고 대시보드 조회가 잦아지면 최신 상태 전용 구조도 선택지가 됩니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 대시보드가 현재 상태를 요청할 때 전략에 따라 조회 경로가 달라지는 흐름입니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "latest-sensor-value-fetch-strategy.mermaid",
      code: "flowchart TD\n    A[Dashboard Current Status Request] --> B[Query Sensor Logs]\n    B --> C{Fetch Strategy}\n\n    C -- Inefficient --> D[Fetch All History]\n    D --> E[Sort in Application]\n    E --> F[Pick Last Value]\n\n    C -- Optimized --> G[Order by measuredAt DESC]\n    G --> H[Limit Latest Rows]\n    H --> I[Return Current Status]",
    },
    {
      type: "paragraph",
      content:
        "아래 표는 조회 단계별로 비효율 구조와 기대 구조를 비교한 것입니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "비효율 구조",
          description: "데이터 처리를 DB 이후 단계에 미루는 방식입니다.",
          bullets: [
            "DB 조회: 센서 이력 전체 조회",
            "정렬: 서버 또는 화면에서 정렬",
            "선택: 전체 데이터 중 마지막 값 선택",
            "응답: 불필요한 이력 포함 가능",
          ],
        },
        {
          title: "기대 구조",
          description: "DB 조회 단계에서 최신값을 제한하는 방식입니다.",
          bullets: [
            "DB 조회: measuredAt DESC 기준 정렬",
            "제한: 필요한 최신 row만 반환",
            "기준: 측정 시각 기준 최신값 판단",
            "응답: 현재 상태에 필요한 값만 반환",
          ],
        },
      ],
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드와 쿼리 실행 계획이 남아 있지 않기 때문에, 검증했어야 하는 기준을 정리합니다. 검증에서 중요한 것은 API 응답이 성공하는지가 아니라, '가장 마지막에 저장된 데이터'가 아니라 '가장 최근에 측정된 데이터'가 반환되는지 확인하는 것입니다.",
    },
    {
      type: "list",
      items: [
        "단일 센서 최신값: 한 센서에 여러 측정값 존재 → measuredAt 기준 최신 1건 반환",
        "여러 센서 최신값: 온도, 습도, 조도 데이터 존재 → 센서별 최신값 각각 반환",
        "지연 도착 데이터: 과거 measuredAt 데이터가 늦게 저장 → 현재 최신값을 덮지 않음",
        "같은 시각 중복 데이터: 동일 measuredAt 데이터 존재 → tie-breaker 정책에 따라 1건 처리",
        "데이터 대량 누적: 과거 데이터가 많이 존재 → 최신값 조회 응답이 크게 저하되지 않음",
        "구역별 최신값: 여러 구역 센서 데이터 혼재 → 요청 구역의 최신값만 반환",
        "센서 데이터 없음: 특정 센서 데이터 부재 → 빈 값 또는 기본 상태 반환",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 최신값 조회 평균 응답 시간, p95 응답 시간, 조회당 반환 row 수, 조회당 스캔 row 수, 센서 수 증가에 따른 응답 시간 변화, 인덱스 적용 전후 응답 시간 비교. 현재 자료만으로 실제 수치를 확인할 수 없으므로 문서에는 '실제 측정 필요'로 남깁니다.",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "최신 센서값 조회를 이력 조회와 분리하면, 대시보드가 현재 상태를 표시하기 위해 불필요한 과거 데이터를 가져오지 않아도 됩니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "최신값 조회 경로",
          description:
            "전체 이력에서 마지막 값을 선택하던 구조에서 → measuredAt 기준 최신 1건 조회 구조로",
          badge: "최신값",
        },
        {
          title: "정렬 위치",
          description:
            "애플리케이션 또는 화면에서 정렬하던 구조에서 → DB 정렬과 건수 제한을 활용하는 구조로",
          badge: "정렬",
        },
        {
          title: "최신값 기준",
          description:
            "저장 시각 기준으로 판단하던 구조에서 → measuredAt 기준으로 최신 측정값을 명확히 하는 구조로",
          badge: "기준",
        },
        {
          title: "확장 기반",
          description:
            "데이터 증가에 취약하던 구조에서 → 최신 상태 테이블이나 캐시 구조로 확장 가능한 기반으로",
          badge: "확장",
        },
      ],
    },
    {
      type: "list",
      items: [
        "대시보드 현재 상태 조회의 불필요한 데이터 전송을 줄일 수 있습니다.",
        "센서 로그가 누적되어도 최신값 조회 성능 저하를 완화할 수 있습니다.",
        "최신값 판단 기준을 measuredAt으로 명확히 할 수 있습니다.",
        "그래프 조회와 현재 상태 조회의 책임을 분리할 수 있습니다.",
        "이후 최신 상태 테이블이나 캐시 구조로 확장할 수 있는 기반을 마련할 수 있습니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 쿼리 로그가 남아 있지 않아 응답 시간 개선률이나 스캔 row 감소량은 확인할 수 없습니다. 이 문서에서는 대시보드 현재 상태 조회를 위한 조회 목적 분리와 쿼리 최적화 판단을 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 배운 점은 '최신값 조회'와 '이력 조회'는 같은 센서 데이터를 사용하더라도 완전히 다른 조회 목적을 가진다는 것입니다. 이력 조회는 시간 흐름을 보여주는 데 목적이 있고, 최신값 조회는 현재 상태를 빠르게 보여주는 데 목적이 있습니다. 두 기능을 같은 방식으로 처리하면 어느 한쪽이 비효율적이 됩니다. 또한 최신값의 기준은 서버 저장 시각이 아니라 실제 측정 시각이어야 합니다. 이 문제는 성능 최적화가 단순히 쿼리를 빠르게 만드는 일이 아니라, 화면이 실제로 필요로 하는 데이터의 의미를 정확히 정의하는 일이라는 점을 보여줍니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "최신값은 createdAt이 가장 큰 데이터가 아니라 measuredAt이 가장 큰 데이터입니다. 예를 들어 measuredAt 10:00·10:02·10:01 순서로 저장된 데이터에서 마지막으로 저장된 데이터(createdAt 기준)는 10:01 측정값이지만, 실제 최신 측정값은 10:02 측정값입니다. 최신값 조회에서 이 기준이 뒤바뀌면 현재 상태가 아닌 과거 데이터를 대시보드에 표시하게 됩니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 최신 상태 전용 테이블을 두어 대시보드가 큰 로그 테이블을 직접 조회하지 않도록 할 수 있습니다. 조회 빈도가 높다면 최신값을 캐시에 보관하되 데이터 신선도 정책을 함께 정의해야 합니다. 센서 수가 늘어나면 센서별 LIMIT 1 반복 대신 한 번의 쿼리로 여러 센서의 최신값을 가져오는 방식을 검토해야 합니다. measuredAt이 같은 데이터가 여러 개일 경우의 tie-breaker 정책도 명확히 정해야 합니다. 대시보드 첫 화면은 사용자가 가장 자주 접하는 경로이므로 평균 응답 시간, p95, 스캔 row 수 등을 기록해 이후 성능 개선 근거를 남기는 것이 좋습니다.",
    },
  ],
  relatedNoteSlugs: [
    "smart-farm-cloud-monitoring-architecture",
    "sensor-data-flow-responsibility-separation",
    "sensor-rest-ingestion-validation",
    "duplicate-sensor-data-idempotency",
    "sensor-timestamp-measurement-storage-mismatch",
    "sensor-log-table-growth-query-degradation",
  ],
};
