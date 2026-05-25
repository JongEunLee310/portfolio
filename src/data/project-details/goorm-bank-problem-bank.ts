import { publicPath } from "@/utils/publicPath";
import type { ProjectDetail } from "@/types/project";
import { goormBankProblemBank } from "../projects/goorm-bank-problem-bank";

export const goormBankProblemBankDetail: ProjectDetail = {
  ...goormBankProblemBank,
  heroImage: publicPath("/images/projects/goorm-bank-hero.png"),
  heroHighlights: [
    { label: "문제 데이터", value: "27만 건", icon: "Database" },
    { label: "시험 회차", value: "2,700건", icon: "Layers" },
    { label: "담당 영역", value: "모니터링/로깅 100%", icon: "Activity" },
    { label: "완성도", value: "70%", icon: "Gauge" },
  ],
  overview:
    "문제 있는 은행장은 국가기술자격시험 기출문제를 기반으로 사용자가 시험 회차별 문제를 풀고 정답률을 확인할 수 있는 문제은행 서비스입니다. 시험기간 전후로 트래픽이 급격히 변하는 특성을 고려하여 AWS EKS 기반 클러스터를 구축하고, Jenkins와 Argo CD를 활용한 CI/CD, CloudWatch와 OpenSearch 기반 로그 수집 및 시각화, HPA와 Cluster Autoscaler를 통한 오토스케일링을 적용했습니다.",
  problem: {
    title: "시험기간 트래픽 급증과 운영 관측성 부족 문제",
    items: [
      "시험 전에는 트래픽이 급상승하고 시험 후에는 급감하여 고정 리소스 운영이 비효율적이었습니다.",
      "트래픽 증가 시 수동 대응이 필요해 서비스 안정성과 운영 효율성을 확보하기 어려웠습니다.",
      "EKS 클러스터 내부 애플리케이션 로그와 워커 노드 리소스 상태를 수집하고 시각화할 체계가 필요했습니다.",
      "사용자의 문제 풀이 이력과 정답률을 직관적으로 확인할 수 있는 학습 경험이 부족했습니다.",
    ],
  },
  solution: {
    title: "EKS 기반 확장형 배포와 CloudWatch/OpenSearch 관측성 구축",
    items: [
      "AWS EKS 기반 Kubernetes 클러스터에 프론트엔드와 백엔드 애플리케이션을 배포했습니다.",
      "Jenkins, ECR, Argo CD를 연결해 Docker 이미지 빌드와 Manifest 기반 배포를 자동화했습니다.",
      "Fluent Bit, CloudWatch, OpenSearch Dashboard를 활용해 로그 수집, 저장, 검색, 시각화 흐름을 구성했습니다.",
      "HPA와 Cluster Autoscaler를 구성해 Pod와 Node 확장 구조를 실험했습니다.",
      "JWT 기반 네이버 소셜 로그인, 문제풀이 API, 게시판 API, 회원 API를 제공했습니다.",
    ],
  },
  architecture: {
    title: "EKS 기반 문제은행 서비스 아키텍처",
    description:
      "React 클라이언트와 Spring Boot API를 EKS에 배포하고, Jenkins/ECR/Argo CD로 CI/CD를 구성했습니다. 운영 로그는 Fluent Bit과 CloudWatch를 거쳐 OpenSearch Dashboard에서 시각화했습니다.",
    nodes: [
      {
        id: "client",
        title: "Client",
        items: ["React SPA", "문제 풀이", "게시판", "프로필 정답률"],
        icon: "Monitor",
      },
      {
        id: "backend",
        title: "Backend API",
        items: ["Spring Boot", "JPA", "JWT", "Swagger UI"],
        icon: "Server",
      },
      {
        id: "eks",
        title: "EKS Platform",
        items: ["Kubernetes", "HPA", "Cluster Autoscaler", "Load Balancing"],
        icon: "Cloud",
      },
      {
        id: "observability",
        title: "Observability",
        items: ["Fluent Bit", "CloudWatch", "OpenSearch Dashboard"],
        icon: "Activity",
      },
    ],
  },
  architectureFlow: {
    title: "문제은행 서비스 운영 플로우",
    description:
      "사용자 요청은 React 클라이언트에서 Spring Boot API로 전달되고, 서비스는 RDS의 문제/회원/게시판 데이터를 조회합니다. 배포는 Jenkins와 Argo CD로 자동화하고, 로그는 CloudWatch와 OpenSearch로 분석합니다.",
    groups: [
      {
        id: "clients",
        title: "사용자 / 외부",
        nodes: [
          {
            id: "user",
            title: "사용자",
            items: ["문제 풀이", "게시판", "프로필 확인"],
            icon: "Users",
          },
          {
            id: "browser",
            title: "Web Client",
            items: ["React", "Typeit.js", "Chart.js"],
            icon: "Monitor",
          },
          {
            id: "naver-login",
            title: "Naver Social Login",
            items: ["소셜 로그인", "JWT 발급 흐름"],
            icon: "Shield",
          },
        ],
      },
      {
        id: "gateway",
        title: "API Gateway",
        nodes: [
          {
            id: "k8s-service",
            title: "Kubernetes Service",
            items: ["서비스 라우팅", "로드밸런싱"],
            icon: "Workflow",
          },
        ],
      },
      {
        id: "services",
        title: "마이크로서비스",
        nodes: [
          {
            id: "frontend",
            title: "Frontend App",
            items: ["문제집", "게시판", "로그인", "프로필"],
            icon: "Monitor",
          },
          {
            id: "backend",
            title: "Backend API",
            items: ["문제풀이 API", "게시판 API", "회원 API", "Swagger UI"],
            icon: "Server",
          },
        ],
      },
      {
        id: "data",
        title: "데이터",
        nodes: [
          {
            id: "rds",
            title: "Amazon RDS for PostgreSQL",
            items: ["회원 데이터", "게시글 데이터", "시험 회차", "문제 데이터"],
            icon: "Database",
          },
          {
            id: "ecr",
            title: "Amazon ECR",
            items: ["Frontend Image", "Backend Image"],
            icon: "FileDown",
          },
        ],
      },
      {
        id: "infra-integrations",
        title: "인프라 / 외부 연동",
        nodes: [
          {
            id: "jenkins",
            title: "Jenkins",
            items: ["Docker 이미지 빌드", "ECR Push", "주기적 빌드"],
            icon: "Settings",
          },
          {
            id: "argocd",
            title: "Argo CD",
            items: ["Manifest 기반 배포", "Frontend/Backend Application 관리"],
            icon: "GitBranch",
          },
          {
            id: "eks",
            title: "AWS EKS",
            items: ["Kubernetes 클러스터", "Pod 실행", "Node 관리"],
            icon: "Cloud",
          },
          {
            id: "fluentbit",
            title: "Fluent Bit",
            items: ["애플리케이션 로그 수집", "DaemonSet 배포"],
            icon: "FileText",
          },
          {
            id: "cloudwatch",
            title: "Amazon CloudWatch",
            items: ["EKS 지표 모니터링", "로그 그룹", "구독 필터"],
            icon: "Activity",
          },
          {
            id: "opensearch",
            title: "Amazon OpenSearch Service",
            items: ["로그 검색", "로그 분석", "Dashboard 시각화"],
            icon: "BarChart",
          },
          {
            id: "hpa-ca",
            title: "HPA & Cluster Autoscaler",
            items: ["Pod 확장", "Node 확장"],
            icon: "Gauge",
          },
        ],
      },
    ],
    connections: [
      { from: "user", to: "browser", tone: "sync", label: "웹 서비스 접속" },
      { from: "browser", to: "frontend", tone: "sync", label: "화면 요청" },
      { from: "frontend", to: "backend", tone: "sync", label: "API 호출" },
      { from: "browser", to: "naver-login", tone: "sync", label: "소셜 로그인" },
      { from: "naver-login", to: "backend", tone: "sync", label: "JWT 발급 및 회원 조회" },
      { from: "backend", to: "rds", tone: "data", label: "서비스 데이터 조회/저장" },
      { from: "jenkins", to: "ecr", tone: "async", label: "이미지 빌드 및 Push" },
      { from: "ecr", to: "argocd", tone: "data", label: "배포 이미지 참조" },
      { from: "argocd", to: "eks", tone: "async", label: "Manifest 기반 자동 배포" },
      { from: "eks", to: "frontend", tone: "sync", label: "Frontend Pod 실행" },
      { from: "eks", to: "backend", tone: "sync", label: "Backend Pod 실행" },
      { from: "frontend", to: "fluentbit", tone: "data", label: "로그 수집" },
      { from: "backend", to: "fluentbit", tone: "data", label: "로그 수집" },
      { from: "fluentbit", to: "cloudwatch", tone: "data", label: "로그 전달" },
      { from: "cloudwatch", to: "opensearch", tone: "data", label: "로그 스트림" },
      { from: "cloudwatch", to: "hpa-ca", tone: "data", label: "리소스 지표 확인" },
      { from: "hpa-ca", to: "eks", tone: "async", label: "Pod/Node 확장" },
    ],
    legends: [
      { label: "동기 요청", tone: "solid" },
      { label: "비동기 이벤트", tone: "dashed" },
      { label: "데이터 흐름", tone: "muted" },
    ],
  },
  features: [
    {
      title: "자격시험 기출문제 풀이",
      description:
        "선택한 자격시험의 기출문제를 한 문제씩 무작위 순서로 표시하고 정답/오답 피드백을 제공합니다.",
      icon: "BookOpen",
    },
    {
      title: "정답률 시각화",
      description:
        "프로필 페이지에서 오늘 푼 문제의 정답률과 오답률을 Chart.js 기반 파이차트로 확인할 수 있습니다.",
      icon: "BarChart",
    },
    {
      title: "네이버 소셜 로그인",
      description:
        "네이버 로그인 후 백엔드에서 JWT를 발급하고 회원 정보를 조회할 수 있는 인증 흐름을 제공합니다.",
      icon: "Shield",
    },
    {
      title: "자유게시판",
      description:
        "게시글 목록, 제목 검색, 페이지네이션, 상세 조회, 로그인 사용자 글쓰기 기능을 제공합니다.",
      icon: "MessageSquare",
    },
    {
      title: "CI/CD 자동화",
      description:
        "Jenkins로 이미지를 빌드하고 ECR에 업로드한 뒤 Argo CD로 Kubernetes Manifest 기반 배포를 자동화했습니다.",
      icon: "GitBranch",
    },
    {
      title: "로그/모니터링",
      description:
        "Fluent Bit, CloudWatch, OpenSearch Dashboard를 활용해 EKS 로그와 리소스 지표를 수집하고 시각화했습니다.",
      icon: "Activity",
    },
  ],
  techStackGroups: [
    {
      title: "Backend",
      items: [
        { name: "Spring Boot", category: "backend" },
        { name: "JPA", category: "backend" },
        { name: "Maven", category: "backend" },
        { name: "JWT", category: "backend" },
        { name: "Swagger UI", category: "tool" },
        { name: "Java", category: "language" },
      ],
    },
    {
      title: "Frontend",
      items: [
        { name: "React", category: "frontend" },
        { name: "Typeit.js", category: "frontend" },
        { name: "Chart.js", category: "frontend" },
      ],
    },
    {
      title: "Data",
      items: [{ name: "Amazon RDS for PostgreSQL", category: "database" }],
    },
    {
      title: "Infra & DevOps",
      items: [
        { name: "AWS EKS", category: "infra" },
        { name: "Kubernetes", category: "infra" },
        { name: "Docker", category: "devops" },
        { name: "Jenkins", category: "devops" },
        { name: "Argo CD", category: "devops" },
        { name: "Amazon ECR", category: "infra" },
        { name: "HPA", category: "infra" },
        { name: "Cluster Autoscaler", category: "infra" },
      ],
    },
    {
      title: "Observability",
      items: [
        { name: "Amazon CloudWatch", category: "observability" },
        { name: "Amazon OpenSearch Service", category: "observability" },
        { name: "OpenSearch Dashboard", category: "observability" },
        { name: "Fluent Bit", category: "observability" },
      ],
    },
  ],
  screenshots: [
    {
      title: "Home Page",
      image: publicPath("/images/projects/goorm-bank-home.png"),
      description: "서비스 로고와 타이핑 효과가 적용된 메인 화면입니다.",
    },
    {
      title: "문제집 페이지",
      image: publicPath("/images/projects/goorm-bank-problem-list.png"),
      description: "자격시험별 문제집과 시험 일정별 문제 목록을 확인하는 화면입니다.",
    },
    {
      title: "프로필 정답률",
      image: publicPath("/images/projects/goorm-bank-profile-chart.png"),
      description: "오늘 푼 문제의 정답률과 오답률을 파이차트로 표시합니다.",
    },
    {
      title: "OpenSearch Dashboard",
      image: publicPath("/images/projects/goorm-bank-opensearch.png"),
      description:
        "CloudWatch에서 스트림한 로그를 OpenSearch Dashboard에서 시각화한 화면입니다.",
    },
  ],
  contributions: [
    {
      date: "2022.10 1주차",
      title: "주제 선정 및 서비스 기획",
      description:
        "자격증 기출문제 공유 서비스를 주제로 선정하고 시험기간 트래픽 급증 문제를 프로젝트 목표로 정의했습니다.",
    },
    {
      date: "2022.10 2주차",
      title: "서비스 개발",
      description:
        "React 프론트엔드와 Spring Boot 백엔드 기반으로 문제풀이, 게시판, 로그인, 회원 API를 구현했습니다.",
    },
    {
      date: "2022.10 3주차",
      title: "EKS 클러스터 구성",
      description:
        "AWS EKS 기반 Kubernetes 클러스터와 애플리케이션 배포 환경을 구성했습니다.",
    },
    {
      date: "2022.10 4주차",
      title: "CI/CD 구축",
      description:
        "Jenkins, ECR, Argo CD를 활용해 이미지 빌드와 Manifest 기반 배포 자동화를 구성했습니다.",
    },
    {
      date: "2022.11 1주차",
      title: "로그/모니터링 및 오토스케일링",
      description:
        "Fluent Bit, CloudWatch, OpenSearch 기반 로그 수집과 HPA/CA 오토스케일링을 구성했습니다.",
    },
  ],
  troubleshootingNoteSlugs: [
    "goorm-bank-eks-application-log-troubleshooting",
    "goorm-bank-cloudwatch-container-insights-troubleshooting",
    "goorm-bank-jenkins-argocd-cicd-troubleshooting",
  ],
  improvements: [
    {
      title: "HPA 기반 Pod 오토스케일링",
      description:
        "CPU 사용률 기준으로 프론트엔드 Pod 수를 최소 1개, 최대 10개까지 자동 조절하도록 구성했습니다.",
      result: "부하 발생 시 Pod 수가 증가하고 부하 중단 후 감소하는 흐름을 확인했습니다.",
      icon: "Gauge",
    },
    {
      title: "ECR 이미지 수명 주기 관리",
      description:
        "Jenkins 빌드 결과로 쌓이는 ECR 이미지가 7일 후 만료되도록 수명 주기 규칙을 설정했습니다.",
      result: "불필요한 이미지 누적을 줄이고 저장소 관리 부담을 완화했습니다.",
      icon: "FileDown",
    },
    {
      title: "OpenSearch 로그 시각화",
      description:
        "CloudWatch 로그를 OpenSearch로 스트림하고 Dashboard에서 시간 단위 로그 확인과 필터링 검색을 구성했습니다.",
      result: "운영 로그를 검색, 분석, 시각화할 수 있는 기반을 마련했습니다.",
      icon: "BarChart",
    },
  ],
  performance: [
    {
      label: "시험 회차 데이터",
      value: "2,700건",
      description: "기사 시험 기준 회차별 공개 문제 데이터 생성",
      icon: "Layers",
    },
    {
      label: "시험 문제 데이터",
      value: "270,000건",
      description: "시험 문제 총 27만 건 생성",
      icon: "Database",
    },
    {
      label: "담당 영역 기여도",
      value: "100%",
      description: "모니터링 및 로깅 서비스 구축 담당",
      icon: "Activity",
    },
    {
      label: "담당 영역 완성도",
      value: "70%",
      description: "모니터링 및 로깅 서비스 구축 완성도",
      icon: "Gauge",
    },
    {
      label: "HPA 최대 Pod",
      value: "10개",
      description: "CPU 기준 최소 1개, 최대 10개로 Scale Out 설정",
      icon: "Server",
    },
  ],
  retrospectives: [
    {
      title: "회고",
      learned: [
        "AWS EKS 환경에서 Kubernetes 기반 애플리케이션 배포와 오토스케일링 구조를 경험했습니다.",
        "Fluent Bit, CloudWatch, OpenSearch Dashboard를 연결한 로그 수집 및 시각화 흐름을 학습했습니다.",
        "Jenkins, ECR, Argo CD를 활용한 CI/CD 파이프라인 구성의 복잡성과 인증 이슈를 경험했습니다.",
        "OpenSearch와 Elasticsearch, Fluent Bit과 Fluentd, Kibana와 OpenSearch Dashboard의 차이를 비교하며 운영 도구 선택 기준을 학습했습니다.",
      ],
      improvement: [
        "CloudWatch 경보 기반 알림과 노드 오토스케일링 정책을 더 명확히 구성합니다.",
        "애플리케이션 로그와 VPC Flow Logs를 구분해 목적에 맞는 로그 수집 대시보드를 재설계합니다.",
        "크롤링과 배치 시스템을 도입해 시험 정보와 문제 데이터 수집을 자동화합니다.",
        "저작권이 명확하지 않은 문제 데이터에 대해 삭제 요청 정책과 출처 관리 체계를 설계합니다.",
      ],
      noteSlug: "goorm-bank-retrospective",
    },
  ],
};
