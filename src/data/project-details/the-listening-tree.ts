import type { ProjectDetail } from "@/types/project";
import { theListeningTree } from "../projects/the-listening-tree";

export const theListeningTreeDetail: ProjectDetail = {
  ...theListeningTree,
  heroImage: "/images/projects/the-listening-tree/hero.svg",
  heroHighlights: [
    { label: "마이크로서비스", value: "4개", icon: "Layers" },
    { label: "CI/CD 파이프라인", value: "3개", icon: "GitBranch" },
    { label: "트러블슈팅 기록", value: "6건", icon: "FileText" },
  ],
  overview:
    "The Listening Tree는 하루 한 번 이야기를 남기면 GPT-4o 기반 AI 상담사가 따뜻하게 공감하는 심리 상담 서비스입니다. AI는 정보 제공을 거절하고 오직 공감에만 응답하도록 시스템 프롬프트로 설계되었습니다. 이야기가 쌓일수록 메인 화면의 나무에 나뭇잎이 추가되고, 현재 월(KST 기준)에 따라 봄·여름·가을·겨울 테마로 UI가 전환됩니다. 백엔드는 auth_service, auto_response, memory_service, user_service 4개의 독립 FastAPI 마이크로서비스로 구성되며, Google OAuth 2.0과 JWT 이중 토큰으로 인증을 처리합니다.",
  problem: {
    title: "감정을 털어놓을 공간의 부재",
    items: [
      "정보 검색이 아닌 감정 공유와 공감을 원하는 사용자에게 맞는 AI 인터페이스의 부재",
      "일반 챗봇의 질문-답변 구조는 단순 공감 응답에 적합하지 않음",
      "이야기를 꾸준히 기록하고 싶지만 습관화를 유도하는 시각적 구조 부재",
    ],
  },
  solution: {
    title: "AI 공감 상담사와 시각적 이야기 나무",
    items: [
      "시스템 프롬프트로 AI에게 '정보 제공 거부 + 공감 중심' 페르소나를 부여해 상담 특화 응답 생성",
      "이야기가 쌓일수록 화면의 나무에 나뭇잎이 늘어나 기록 축적의 시각적 피드백 제공",
      "하루 한 번 제한(기획 단계)으로 과도한 의존 없이 규칙적인 사용 패턴 유도",
    ],
  },
  architecture: {
    title: "마이크로서비스 아키텍처",
    description:
      "4개의 독립 FastAPI 서비스로 구성. 각 서비스는 별도 git 레포지토리로 관리.",
    nodes: [
      {
        id: "frontend",
        title: "Vue 3 Frontend",
        items: [
          "로그인, 메인(나무 시각화), 이야기 작성 페이지",
          "Vuex 상태 관리 (로그인 상태, 계절 테마)",
        ],
        icon: "Monitor",
      },
      {
        id: "auth-service",
        title: "auth_service",
        items: [
          "Google OAuth 2.0 Authorization Code Flow",
          "JWT access/refresh 토큰 발급",
          "SQLAlchemy + Alembic 사용자 DB 관리",
        ],
        icon: "Shield",
      },
      {
        id: "auto-response",
        title: "auto_response",
        items: [
          "GPT-4o 기반 AI 공감 응답 생성",
          "초기 인사말 및 이야기 응답 2개 엔드포인트",
          "OpenAI Responses API (max_output_tokens=100)",
        ],
        icon: "MessageSquare",
      },
      {
        id: "external",
        title: "외부 서비스",
        items: [
          "Google OAuth API (토큰 발급, 사용자 정보 조회)",
          "OpenAI API (gpt-4o 응답 생성)",
        ],
        icon: "Cloud",
      },
    ],
  },
  architectureFlow: {
    title: "서비스 요청 흐름",
    description:
      "브라우저 → FastAPI 마이크로서비스 → 외부 API 순서로 동기 처리.",
    groups: [
      {
        id: "clients",
        title: "사용자 / 외부",
        nodes: [
          {
            id: "browser",
            title: "Vue 3 SPA",
            items: ["로그인 / 메인 / 이야기 작성 페이지"],
            icon: "Monitor",
          },
        ],
      },
      {
        id: "services",
        title: "마이크로서비스",
        nodes: [
          {
            id: "auth-service",
            title: "auth_service",
            items: ["Google OAuth 연동, JWT 발급, 사용자 DB 저장"],
            icon: "Shield",
          },
          {
            id: "auto-response",
            title: "auto_response",
            items: ["GPT-4o 공감 응답 생성, 2개 엔드포인트"],
            icon: "MessageSquare",
          },
        ],
      },
      {
        id: "data-ai",
        title: "데이터 & AI",
        nodes: [
          {
            id: "postgres",
            title: "PostgreSQL",
            items: ["사용자 정보 저장 (social_id, email, name)"],
            icon: "Database",
          },
          {
            id: "openai-api",
            title: "OpenAI API",
            items: ["gpt-4o Responses API"],
            icon: "Zap",
          },
        ],
      },
      {
        id: "infra-integrations",
        title: "인프라 / 외부 연동",
        nodes: [
          {
            id: "google-oauth",
            title: "Google OAuth API",
            items: ["Authorization Code → access_token + user_info"],
            icon: "ExternalLink",
          },
          {
            id: "aws-ecr",
            title: "AWS ECR",
            items: ["Docker 이미지 레지스트리"],
            icon: "FileDown",
          },
        ],
      },
    ],
    connections: [
      {
        from: "browser",
        to: "auth-service",
        tone: "sync",
        label: "POST /login/google {code}",
      },
      {
        from: "auth-service",
        to: "google-oauth",
        tone: "sync",
        label: "token + userinfo 조회",
      },
      {
        from: "auth-service",
        to: "postgres",
        tone: "sync",
        label: "사용자 조회 / 신규 생성",
      },
      {
        from: "browser",
        to: "auto-response",
        tone: "sync",
        label: "GET /initial_response",
      },
      {
        from: "browser",
        to: "auto-response",
        tone: "sync",
        label: "POST /response {message}",
      },
      {
        from: "auto-response",
        to: "openai-api",
        tone: "sync",
        label: "client.responses.create()",
      },
    ],
    legends: [
      { label: "동기 요청", tone: "solid" },
      { label: "비동기 이벤트", tone: "dashed" },
      { label: "데이터 흐름", tone: "muted" },
    ],
  },
  features: [
    {
      title: "AI 공감 응답",
      description:
        "GPT-4o 기반 심리 상담사 페르소나. 사용자 이야기에 100토큰 이내의 따뜻한 한 마디 응답. 정보 검색 요청은 거절하고 감정 공감에만 응답한다.",
      icon: "MessageSquare",
    },
    {
      title: "나무 시각화",
      description:
        "이야기가 추가될수록 나무에 나뭇잎이 쌓이는 인터랙티브 시각화. 이야기 수에 따라 나무 성장 상태가 변화하며 기록 축적을 시각적으로 확인할 수 있다.",
      icon: "Layers",
    },
    {
      title: "계절 연동 UI",
      description:
        "현재 월(KST)을 기준으로 봄·여름·가을·겨울 테마가 자동 전환. 배경, 텍스트, 버튼, 나뭇잎 색상이 계절에 맞게 변경된다.",
      icon: "Zap",
    },
    {
      title: "Google OAuth 로그인",
      description:
        "Google OAuth 2.0 Authorization Code Flow. 로그인 후 JWT access/refresh 이중 토큰 발급. 비로그인 사용자는 이야기 작성 시 401 에러 페이지로 리다이렉트된다.",
      icon: "Shield",
    },
    {
      title: "초기 인사말",
      description:
        "서비스 진입 시 AI가 먼저 따뜻한 인사말을 전달. 사용자가 이야기를 입력할 준비가 될 수 있도록 맥락을 제공한다.",
      icon: "MessageSquare",
    },
  ],
  techStackGroups: [
    {
      title: "Backend",
      items: [
        { name: "Python 3.12", category: "language" },
        { name: "FastAPI", category: "backend" },
        { name: "SQLAlchemy 2.x", category: "backend" },
        { name: "Alembic", category: "backend" },
        { name: "httpx", category: "backend" },
        { name: "python-jose", category: "backend" },
      ],
    },
    {
      title: "AI",
      items: [
        { name: "OpenAI SDK", category: "ai" },
        { name: "GPT-4o", category: "ai" },
        { name: "Responses API", category: "ai" },
      ],
    },
    {
      title: "Frontend",
      items: [
        { name: "Vue 3", category: "frontend" },
        { name: "Vuex", category: "frontend" },
        { name: "Tailwind CSS", category: "frontend" },
        { name: "Vite", category: "tool" },
        { name: "axios", category: "tool" },
      ],
    },
    {
      title: "Infra & DevOps",
      items: [
        { name: "Docker", category: "infra" },
        { name: "AWS ECR", category: "infra" },
        { name: "GitHub Actions", category: "devops" },
        { name: "SonarCloud", category: "devops" },
      ],
    },
    {
      title: "Data",
      items: [
        { name: "PostgreSQL", category: "database" },
        { name: "SQLite (테스트)", category: "database" },
      ],
    },
  ],
  screenshots: [
    {
      title: "메인 페이지 (나무 시각화)",
      image: "/images/projects/the-listening-tree/main.svg",
      description: "이야기 수에 따라 나뭇잎이 쌓이는 나무와 계절 연동 테마",
    },
    {
      title: "이야기 작성 페이지",
      image: "/images/projects/the-listening-tree/story.svg",
      description: "사용자 메시지 입력 및 AI 공감 응답 표시",
    },
    {
      title: "로그인 페이지",
      image: "/images/projects/the-listening-tree/signin.svg",
      description: "Google OAuth 소셜 로그인 버튼",
    },
  ],
  contributions: [
    {
      date: "2025.01",
      title: "인증 서비스 설계 및 구현",
      description:
        "Google OAuth 2.0 Authorization Code Flow 구현. JWT access/refresh 이중 토큰 발급 및 갱신 엔드포인트 설계. SQLAlchemy 모델과 Alembic 마이그레이션으로 사용자 DB 스키마 관리.",
    },
    {
      date: "2025.01",
      title: "AI 응답 서비스 구현",
      description:
        "OpenAI Responses API를 사용한 심리 상담 응답 생성. 시스템 프롬프트로 공감 중심 페르소나 설계. 초기 인사말(GET) + 이야기 응답(POST) 2개 엔드포인트 구현.",
    },
    {
      date: "2025.01",
      title: "프론트엔드 구현",
      description:
        "Vue 3 + Vuex 상태 관리. 계절 연동 UI 테마 시스템(seasonStore). 나무 시각화 컴포넌트(TreeVisualization) 개발. OAuth 콜백 처리 및 로그인 흐름 구현.",
    },
    {
      date: "2025.02",
      title: "CI/CD 파이프라인 구축",
      description:
        "auth_service, memory_service, user_service에 GitHub Actions 워크플로우 추가. pytest + SonarCloud 코드 품질 검사 → Docker 빌드 → AWS ECR + Docker Hub 이미지 배포 파이프라인 구성.",
    },
  ],
  troubleshooting: [
    {
      title: "Google OAuth 예외 재래핑",
      problem:
        "except Exception이 내부에서 raise한 HTTPException까지 잡아 원래 오류 메시지가 변형됨. 네트워크 오류·인증 오류·내부 오류가 모두 400으로 묶임.",
      solution:
        "except HTTPException: raise를 가장 먼저 배치해 재래핑 차단. httpx 예외를 HTTPStatusError·TimeoutException·RequestError로 분리.",
      result:
        "오류 유형별 상태 코드(400/502/503/504) 분리. 클라이언트가 재시도 여부를 판단할 수 있는 명확한 응답 반환.",
      noteSlug: "001-google-oauth-exception-masking",
    },
    {
      title: "OpenAI 응답 구조 직접 접근 취약성",
      problem:
        "response.output[0].content[0].text 직접 접근 시 빈 응답에서 IndexError 발생. 개발 중 추가한 print(user_message)가 사용자 상담 내용을 표준 출력에 노출.",
      solution:
        "응답 텍스트 추출 함수 분리 및 빈 응답 방어 로직 추가. print() 2개 제거. 오류 원인별 상태 코드 분기.",
      result:
        "빈 응답 → 503 반환으로 명확화. 사용자 메시지 표준 출력 노출 제거. API 오류·파싱 오류 구분 가능.",
      noteSlug: "002-openai-response-direct-access",
    },
    {
      title: "social_id 단독 unique 제약 불일치",
      problem:
        "DB는 social_id 단독 unique, 핸들러는 social_id + social_provider 복합 조건으로 조회. ADR 설계 의도가 모델과 마이그레이션에 반영되지 않음.",
      solution:
        "UniqueConstraint('social_id', 'social_provider')로 교체. Alembic 마이그레이션 순서(인덱스 제거 → 복합 제약 생성)대로 수정.",
      result:
        "DB 제약과 애플리케이션 조회 로직 정합성 확보. 다중 OAuth 제공자 추가 시 같은 social_id 값 충돌 방지.",
      noteSlug: "005-social-id-unique-constraint-mismatch",
    },
    {
      title: "멀티레포 CI 이름 불일치",
      problem:
        "auth_service CI를 복붙하면서 name 필드 수정 누락. memory_service·user_service가 GitHub Actions에서 'The Tree Auth Service CI'로 표시.",
      solution:
        "memory_service, user_service 워크플로우 name 필드를 각 서비스명으로 수정.",
      result: "CI 대시보드에서 서비스별 워크플로우 구분 가능.",
      noteSlug: "003-multirepo-ci-duplication-and-drift",
    },
  ],
  performance: [
    {
      label: "AI 응답 토큰 상한",
      value: "100",
      description: "max_output_tokens=100으로 짧고 집중된 공감 응답 보장",
      icon: "Zap",
    },
    {
      label: "인증 서비스 테스트 케이스",
      value: "3건",
      description:
        "pytest로 검증한 Google OAuth 핸들러 시나리오 (기존 사용자·신규 사용자·이메일 없음)",
      icon: "CheckCircle",
    },
    {
      label: "CI/CD 자동화 서비스",
      value: "3개",
      description:
        "GitHub Actions 파이프라인 적용 서비스 수 (auth, memory, user)",
      icon: "GitBranch",
    },
    {
      label: "트러블슈팅 문서",
      value: "6건",
      description: "개발 중 발견·해결한 문제 기록 수",
      icon: "FileText",
    },
  ],
  retrospective: {
    learned: [
      "except Exception as e는 FastAPI의 HTTPException까지 잡는다. 의도적으로 raise한 애플리케이션 오류가 재래핑되지 않으려면 except HTTPException: raise를 가장 먼저 배치해야 한다.",
      "멀티레포 구조에서 CI 워크플로우를 복붙으로 관리하면 이름·설정·의존성 버전 불일치가 빠르게 누적된다. GitHub Reusable Workflows 같은 공유 수단을 초기에 설계해야 한다.",
      "DB 모델 설계 결정(ADR)과 실제 마이그레이션 코드가 동기화되지 않으면 확장 시 예상치 못한 unique 충돌이 발생한다.",
      "테스트 격리 구조(FakeClient, FakeDBSession)를 처음부터 설계하지 않으면 나중에 리팩토링 범위가 핸들러 구조 전체로 확장된다.",
    ],
    improvement: [
      "서비스 전체 logging 인프라 도입 (현재 print() 2개가 사용자 메시지를 표준 출력에 노출, 구조화 로그 미존재)",
      "auto_response 서비스 테스트 격리 구현 (현재 테스트 0개, FakeClient + monkeypatch 구조 설계 필요)",
      "GitHub Reusable Workflows로 4개 서비스 CI 공통화 (현재 서비스별 중복 워크플로우)",
    ],
    noteSlug: "",
  },
  relatedNoteSlugs: [
    "001-google-oauth-exception-masking",
    "002-openai-response-direct-access",
    "003-multirepo-ci-duplication-and-drift",
    "004-stateless-prompt-context-loss",
    "005-social-id-unique-constraint-mismatch",
    "006-llm-response-format-not-enforced",
  ],
};
