import type { ProjectDetail } from "@/types/project";
import { smartFarm } from "../projects/smart-farm";

export const smartFarmDetail: ProjectDetail = {
  ...smartFarm,
  heroImage: "/images/projects/smart-farm/thumbnail.svg",
  heroHighlights: [
    { label: "개발 기여", value: "데이터 수집 / DB 업로드 / 디바이스 제어", icon: "Code2" },
    { label: "핵심 시스템", value: "실시간 모니터링 + 원격 제어", icon: "Activity" },
    { label: "인프라", value: "Azure VM + MySQL DB", icon: "Cloud" },
  ],
  overview:
    "클라우드 기반 스마트팜 실시간 모니터링 및 원격 제어 시스템은 원격지 DAS 장비에서 수집한 센서 및 디바이스 상태 데이터를 Azure VM의 Data Collector가 ModbusTCP로 수집하고, Azure MySQL DB에 저장한 뒤, API Server와 Monitoring Engine을 통해 사용자 애플리케이션에 실시간 조회, 이상 감지 알림, 원격 디바이스 제어 기능을 제공하는 프로젝트이다. 사용자는 Mobile 또는 Windows Application을 통해 센서 상태를 주기적으로 확인하고, 이상 값이 감지되면 알림을 받은 뒤 현장 방문 없이 디바이스 제어 요청을 수행할 수 있다.",
  problem: {
    title: "현장 중심 모니터링의 한계와 원격 제어 필요성",
    items: [
      "센서 값을 확인하기 위해 담당자가 현장에 직접 방문해야 하는 구조였다.",
      "이상 상황 발생 시 알림과 대응이 분리되어 있어 즉각적인 조치가 어려웠다.",
      "원격지 장비 상태를 실시간으로 수집하고 제어하는 통합 구조가 필요했다.",
    ],
  },
  solution: {
    title: "Azure Cloud 기반 실시간 수집, 이상 감지, 원격 제어 구조",
    items: [
      "Azure VM에서 Data Collector, API Server, Monitoring Engine, Device Controller를 운영했다.",
      "DAS와 ModbusTCP로 통신해 센서 및 디바이스 상태 데이터를 수집하고 MySQL DB에 저장했다.",
      "Monitoring Engine이 이상 값을 감지하면 Outlier 저장과 사용자 알림을 수행했다.",
      "사용자의 제어 요청을 API Server와 Device Controller를 통해 원격지 디바이스로 전달했다.",
    ],
  },
  architecture: {
    title: "클라우드 기반 IoT 모니터링 아키텍처",
    description:
      "원격지 DAS, Azure VM 기반 서버 모듈, Azure MySQL DB, Mobile/Windows Application이 연결된 구조이다.",
    nodes: [
      {
        id: "client-apps",
        title: "Client Applications",
        items: ["Mobile Application", "Windows Application", "센서 조회", "원격 제어 요청"],
        icon: "Monitor",
      },
      {
        id: "azure-server",
        title: "Azure Cloud Server",
        items: ["API Server", "Data Collector", "Monitoring Engine", "Device Controller"],
        icon: "Cloud",
      },
      {
        id: "data-layer",
        title: "Data Layer",
        items: ["Azure MySQL DB", "센서 데이터", "이상 값", "알림 이력"],
        icon: "Database",
      },
      {
        id: "remote-devices",
        title: "Remote Device Layer",
        items: ["DAS", "Sensors", "Devices", "ModbusTCP"],
        icon: "Workflow",
      },
    ],
  },
  architectureFlow: {
    title: "실시간 모니터링 및 원격 제어 플로우",
    description:
      "센서 데이터는 DAS에서 Azure VM의 Data Collector로 수집되고, 사용자의 제어 요청은 API Server와 Device Controller를 거쳐 DAS로 전달된다.",
    groups: [
      {
        id: "clients",
        title: "사용자 / 외부",
        nodes: [
          {
            id: "mobile-app",
            title: "Mobile Application",
            items: ["센서 조회", "알림 확인", "원격 제어"],
            icon: "Monitor",
          },
          {
            id: "windows-app",
            title: "Windows Application",
            items: ["모니터링 화면", "디바이스 제어 UI"],
            icon: "Monitor",
          },
          {
            id: "telegram",
            title: "Telegram Notification",
            items: ["이상 값 알림"],
            icon: "Zap",
          },
        ],
      },
      {
        id: "gateway",
        title: "API Gateway",
        nodes: [
          {
            id: "api-server",
            title: "API Server",
            items: ["REST API", "센서 데이터 조회", "제어 요청 전달"],
            icon: "Server",
          },
        ],
      },
      {
        id: "services",
        title: "서비스",
        nodes: [
          {
            id: "data-collector",
            title: "Data Collector",
            items: ["ModbusTCP 수집", "DB 업로드"],
            icon: "Cloud",
          },
          {
            id: "monitoring-engine",
            title: "Monitoring Engine",
            items: ["이상 값 감지", "Outlier 저장", "알림 트리거"],
            icon: "Activity",
          },
          {
            id: "device-controller",
            title: "Device Controller",
            items: ["제어 요청 처리", "DAS 제어 통신"],
            icon: "Settings",
          },
        ],
      },
      {
        id: "data",
        title: "데이터",
        nodes: [
          {
            id: "mysql-db",
            title: "Azure MySQL DB",
            items: ["센서 데이터", "목표 값", "알림 이력"],
            icon: "Database",
          },
          {
            id: "outlier-store",
            title: "Outlier Data",
            items: ["이상 값 감지 결과"],
            icon: "Shield",
          },
        ],
      },
      {
        id: "infra-integrations",
        title: "인프라 / 외부 연동",
        nodes: [
          {
            id: "azure-vm",
            title: "Azure VM",
            items: ["서버 실행 환경"],
            icon: "Cloud",
          },
          {
            id: "das",
            title: "DAS",
            items: ["센서 및 디바이스 상태 수집 장치"],
            icon: "Workflow",
          },
          {
            id: "sensors-devices",
            title: "Sensors & Devices",
            items: ["센서 값 제공", "제어 대상 장치"],
            icon: "Workflow",
          },
        ],
      },
    ],
    connections: [
      { from: "sensors-devices", to: "das", tone: "data", label: "센서 및 디바이스 상태 데이터" },
      { from: "das", to: "data-collector", tone: "data", label: "ModbusTCP 데이터 수집" },
      { from: "data-collector", to: "mysql-db", tone: "data", label: "센서 데이터 저장" },
      { from: "monitoring-engine", to: "mysql-db", tone: "data", label: "기준 값 조회" },
      { from: "monitoring-engine", to: "outlier-store", tone: "data", label: "이상 값 저장" },
      { from: "monitoring-engine", to: "telegram", tone: "async", label: "이상 상황 알림" },
      { from: "mobile-app", to: "api-server", tone: "sync", label: "센서 조회 / 제어 요청" },
      { from: "windows-app", to: "api-server", tone: "sync", label: "센서 조회 / 제어 요청" },
      { from: "api-server", to: "mysql-db", tone: "data", label: "센서 데이터 조회" },
      { from: "api-server", to: "device-controller", tone: "sync", label: "제어 명령 전달" },
      { from: "device-controller", to: "das", tone: "sync", label: "ModbusTCP 디바이스 제어" },
      { from: "api-server", to: "mobile-app", tone: "async", label: "WebSocket 상태 변경 알림" },
      { from: "api-server", to: "windows-app", tone: "async", label: "WebSocket 상태 변경 알림" },
    ],
    legends: [
      { label: "동기 요청", tone: "solid" },
      { label: "비동기 이벤트", tone: "dashed" },
      { label: "데이터 흐름", tone: "muted" },
    ],
  },
  features: [
    {
      title: "실시간 센서 데이터 수집",
      description:
        "원격지 DAS에서 센서 및 디바이스 상태 데이터를 주기적으로 수집하고 Azure MySQL DB에 저장한다.",
      icon: "Activity",
    },
    {
      title: "REST API 기반 센서 조회",
      description:
        "전체 센서 조회, 특정 센서 조회, 특정 날짜의 24시간 센서 데이터 조회 API를 제공한다.",
      icon: "Server",
    },
    {
      title: "이상 값 감지 및 알림",
      description:
        "Monitoring Engine이 기준 값을 기반으로 이상 값을 감지하고 Outlier 저장 및 사용자 알림을 수행한다.",
      icon: "Zap",
    },
    {
      title: "원격 디바이스 제어",
      description:
        "사용자의 제어 요청을 API Server와 Device Controller를 통해 원격지 디바이스로 전달한다.",
      icon: "Settings",
    },
    {
      title: "Mobile/Windows 앱 연동",
      description:
        "Mobile 및 Windows Application과 연동해 센서 조회, 알림 이력 확인, 제어 기능을 제공한다.",
      icon: "Monitor",
    },
  ],
  techStackGroups: [
    {
      title: "Backend",
      items: [
        { name: "Java", category: "language" },
        { name: "REST API", category: "backend" },
        { name: "API Server", category: "backend" },
        { name: "Monitoring Engine", category: "backend" },
        { name: "WebSocket", category: "backend" },
      ],
    },
    {
      title: "Infra & DevOps",
      items: [
        { name: "Azure Cloud", category: "infra" },
        { name: "Azure VM", category: "infra" },
      ],
    },
    {
      title: "Messaging",
      items: [
        { name: "ModbusTCP", category: "messaging" },
        { name: "Py4J", category: "tool" },
      ],
    },
    {
      title: "Data",
      items: [
        { name: "MySQL", category: "database" },
        { name: "Azure MySQL DB", category: "database" },
      ],
    },
    {
      title: "Frontend",
      items: [
        { name: "Mobile Application", category: "frontend" },
        { name: "Windows Application", category: "frontend" },
      ],
    },
  ],
  screenshots: [
    {
      title: "Smart Farm Monitoring",
      image: "/images/projects/smart-farm/thumbnail.svg",
      description:
        "센서 데이터 수집, 원격 제어, 이벤트 알림 흐름을 요약한 프로젝트 대표 화면이다.",
    },
  ],
  contributions: [
    {
      date: "2022.03",
      title: "인프라 설계 및 구성, API 설계, 프론트엔드 및 앱 설계",
      description: "Azure VM과 MySQL DB 구성, API 구조 설계, Mobile/Windows Application UI 설계를 진행했다.",
    },
    {
      date: "2022.04",
      title: "원격지 데이터 수집기 클라우드 연동 및 API Server 개발",
      description: "DAS와 ModbusTCP로 통신하는 Data Collector를 Azure VM에 구성하고, 센서 데이터 조회 REST API를 개발했다.",
    },
    {
      date: "2022.05",
      title: "모니터링 서비스, 프론트엔드/앱 초기 버전, 알림 시스템 개발",
      description: "이상 값을 감지하는 Monitoring Engine, Mobile/Windows Application 초기 버전, Telegram 알림 시스템을 구현했다.",
    },
    {
      date: "2022.06",
      title: "원격 디바이스 제어 시스템 개발 및 전체 기능 테스트",
      description: "Device Controller를 개발해 API Server와 DAS를 연결하고, 수집-저장-이상감지-알림-제어 전체 플로우를 검증했다.",
    },
    {
      date: "2022.07",
      title: "프로젝트 마감",
      description: "최종 결과 보고서와 논문을 작성하고 프로젝트를 마감했다.",
    },
  ],
  troubleshooting: [
    {
      title: "원격 센서 데이터 수집 안정화",
      problem: "원격지 DAS에서 수집되는 센서 값이 비정상적이거나 수집 실패가 발생할 수 있었다.",
      solution:
        "Data Collector를 Azure VM에서 실행하고, 비정상 데이터 수집 또는 수집 실패 시 정상화 기능을 개발했다.",
      result: "무정지 실시간 데이터 수집 환경을 목표로 안정적인 수집 구조를 구성했다.",
      noteSlug: "smart-farm-data-collector-recovery",
    },
    {
      title: "DB 저장 및 데이터 손실 방지",
      problem: "센서 데이터가 실시간으로 누적되기 때문에 데이터 손실이 발생하면 모니터링 신뢰성이 낮아질 수 있었다.",
      solution: "Azure MySQL DB 저장 구조와 DB 이중화 전략을 적용했다.",
      result: "데이터 손실 방지를 고려한 클라우드 DB 구조를 설계했다.",
      noteSlug: "smart-farm-db-replication",
    },
    {
      title: "원격 디바이스 제어 연동",
      problem: "사용자의 앱 제어 요청을 실제 원격지 디바이스 동작으로 연결해야 했다.",
      solution:
        "API Server가 Device Controller를 호출하고, Device Controller가 DAS와 ModbusTCP로 통신해 제어를 수행하도록 구성했다.",
      result: "사용자가 현장에 가지 않고도 디바이스를 제어할 수 있는 흐름을 구현했다.",
      noteSlug: "smart-farm-remote-device-control",
    },
  ],
  improvements: [
    {
      title: "24시간 센서 데이터 조회 최적화",
      description:
        "특정 센서의 24시간 원본 데이터를 그대로 전달하지 않고 시간 간격별 평균 값으로 가공해 제공하여 차트 표시 부담을 줄였다.",
      result:
        "클라이언트가 24시간 센서 변화 데이터를 빠르게 시각화할 수 있는 API 응답 구조를 구성했다.",
      icon: "Activity",
    },
    {
      title: "무정지 실시간 데이터 수집 안정성 개선",
      description:
        "원격지 DAS의 센서 데이터 수집 실패나 비정상 데이터 발생 가능성을 고려해 Azure VM 기반 수집 구조와 정상화 기능을 구성했다.",
      result:
        "센서 데이터가 지속적으로 수집되고 DB에 저장될 수 있는 실시간 모니터링 기반을 마련했다.",
      icon: "Zap",
    },
    {
      title: "원격 디바이스 제어 응답성 개선",
      description:
        "사용자가 현장에 직접 방문하지 않고 API Server와 Device Controller를 통해 원격으로 디바이스를 제어할 수 있도록 구성했다.",
      result:
        "이상 상황 발생 후 앱에서 제어 요청을 수행하고 상태 변경을 확인할 수 있는 대응 흐름을 만들었다.",
      icon: "Settings",
    },
    {
      title: "이상 값 추적 구조 개선",
      description:
        "Monitoring Engine이 기준 값을 기반으로 이상 값을 감지하고 일반 센서 데이터와 분리된 Outlier 정보로 저장하도록 구성했다.",
      result:
        "이상 상황 이력 추적과 알림 처리가 쉬운 데이터 구조를 확보했다.",
      icon: "Shield",
    },
  ],
  performance: [
    {
      label: "24시간 차트 조회",
      value: "원본 데이터 → 평균값 가공 제공",
      description: "하루치 원본 데이터 대신 시간 간격별 평균값을 API에서 가공해 클라이언트 차트 렌더링 부담을 줄였다.",
      icon: "BarChart",
    },
    {
      label: "실시간 수집 안정성",
      value: "무정지 수집 구조",
      description: "비정상 데이터 수집 또는 수집 실패 시 정상화 기능을 개발해 데이터 수집 흐름이 끊기지 않도록 구성했다.",
      icon: "Activity",
    },
    {
      label: "데이터 손실 방지",
      value: "DB 이중화 적용",
      description: "센서 데이터 손실 시 모니터링 신뢰도가 저하되는 문제를 방지하기 위해 DB 이중화 구조를 적용했다.",
      icon: "Database",
    },
    {
      label: "원격 제어 대응",
      value: "현장 방문 없이 디바이스 제어",
      description: "이상 상황 발생 시 현장 이동 없이 앱에서 제어 요청을 수행하고 WebSocket으로 상태 변경을 즉시 확인할 수 있게 했다.",
      icon: "Settings",
    },
    {
      label: "서버 확장성",
      value: "Azure VM + Cloud DB",
      description: "온프레미스 대비 서버 구축과 증설이 유연한 Azure VM과 MySQL DB 기반 구조로 운영 환경을 구성했다.",
      icon: "Cloud",
    },
  ],
  retrospective: {
    learned: [
      "수집, 저장, 이상 감지, 알림, 제어까지 이어지는 전체 IoT 서비스 흐름을 경험했다.",
      "원격지 장비와 서버를 연결할 때는 API 설계뿐 아니라 통신 프로토콜, 데이터 수집 안정성, 장애 대응까지 고려해야 한다는 점을 배웠다.",
      "Data Collector와 Device Controller처럼 데이터 수집과 제어 책임을 분리하는 설계가 중요했다.",
    ],
    improvement: [
      "데이터 수집 실패나 비정상 데이터 정상화 로직에 대한 정량 지표를 추가로 측정한다.",
      "DB 이중화 구성 방식과 장애 복구 시나리오를 더 구체적으로 문서화한다.",
      "향후 Big Data 또는 AI 기반 예측 모델을 적용해 이상 감지를 고도화한다.",
    ],
    noteSlug: "smart-farm-retrospective",
  },
  relatedNoteSlugs: [
    "smart-farm-data-collector-recovery",
    "smart-farm-db-replication",
    "smart-farm-remote-device-control",
    "smart-farm-api-server-design",
    "smart-farm-monitoring-engine",
  ],
};
