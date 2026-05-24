import { publicPath } from "@/utils/publicPath";
import type { AboutData } from "@/types/about";
import { externalLinks } from "@/constants/externalLinks";

export const aboutData: AboutData = {
  profile: {
    name: "이종은",
    role: "백엔드 / 클라우드 개발자",
    location: "대한민국, 경기 안산",
    email: "whddms1208@gmail.com",
    experience: "백엔드·클라우드 프로젝트 1년+",
    avatar: publicPath("/images/profile/avatar.svg"),
    links: [
      { label: "Email", href: externalLinks.email, icon: "Mail" },
      { label: "GitHub", href: externalLinks.github, icon: "Github" },
      { label: "LinkedIn", href: externalLinks.linkedin, icon: "ExternalLink" },
      { label: "GitLab", href: externalLinks.gitlab, icon: "ExternalLink" },
    ],
    introduction: [
      "구현보다 설계를 먼저 논의하고, 직감보다 수치로 검증하는 백엔드·클라우드 개발자입니다.",
      "Java·Python 두 스택으로 MSA 백엔드를 설계하고 AWS·Kubernetes 기반 인프라를 직접 구축·운영하는 데 강점이 있으며, API 설계부터 CI/CD 자동화·운영 모니터링까지 서비스 전 주기를 담당해왔습니다.",
      "원칙이 실제 운영 환경에서 작동하는지를 반복해서 검증하며, 더 나은 구조를 찾아가는 과정을 즐깁니다.",
    ],
  },
  sections: {
    profile: {
      id: "profile",
      eyebrow: "PROFILE",
      title: "이종은",
    },
    roles: {
      id: "roles",
      eyebrow: "WHAT I BUILD",
      title: "역할과 책임",
      description: "API 설계, 클라우드 인프라, 자동화와 협업 흐름까지 서비스가 운영되는 전체 맥락을 고려합니다.",
    },
    timeline: {
      id: "career-education",
      eyebrow: "CAREER & EDUCATION",
      title: "경력 및 교육",
      description: "연구실, 부트캠프, 팀 프로젝트를 순서대로 거치며 백엔드와 클라우드 실전 경험을 쌓았습니다.",
    },
    techStack: {
      id: "tech-stack",
      eyebrow: "TECH STACK",
      title: "기술 스택",
      description: "Spring Boot, FastAPI, AWS, Kubernetes, CI/CD, 데이터베이스를 중심으로 학습하고 적용합니다.",
    },
    workStyle: {
      id: "working-style",
      eyebrow: "WORKING STYLE",
      title: "일하는 방식",
    },
    growthMetrics: {
      id: "growth-metrics",
      eyebrow: "GROWTH METRICS",
      title: "지표로 보는 성장",
    },
  },
  roles: [
    {
      title: "백엔드 API 설계",
      description: "Spring Boot와 FastAPI로 REST API, JWT 인증·인가, 역할 기반 접근 제어를 구현합니다.",
      icon: "Server",
      tags: ["Spring Boot", "FastAPI", "JWT"],
    },
    {
      title: "클라우드 / DevOps",
      description: "AWS, Kubernetes, Docker 기반 환경에서 배포 자동화와 운영 관측 흐름을 구성합니다.",
      icon: "Cloud",
      tags: ["AWS", "Kubernetes", "Docker"],
    },
    {
      title: "자동화와 협업",
      description: "GitHub Actions, Jenkins, Notion, AI 에이전트 코딩 방식으로 팀 개발 속도를 높입니다.",
      icon: "Code2",
      tags: ["GitHub Actions", "Jenkins", "Claude Code", "Codex", "Cursor", "GitHub Copilot"],
    },
    {
      title: "데이터와 성능 개선",
      description: "MySQL, PostgreSQL, QueryDSL과 성능 측정을 바탕으로 데이터 접근 비용과 병목을 줄입니다.",
      icon: "Database",
      tags: ["MySQL", "PostgreSQL", "QueryDSL"],
    },
  ],
  timeline: [
    {
      type: "project",
      badge: "진행 중",
      title: "AI Agent Pipeline Backend Design",
      organization: "개인 프로젝트",
      period: "2026.04 ~ 진행 중",
      description:
        "FastAPI와 MSA 구조로 CI 파이프라인 실행과 AI 코드 리뷰를 연동하는 백엔드를 개발 중입니다. Celery+Redis 비동기 전환으로 동시 200명 기준 /run 응답 중앙값을 61% 단축했습니다.",
    },
    {
      type: "bootcamp",
      badge: "수료",
      title: "Kernel360 백엔드 심화 캠프 5기",
      organization: "패스트캠퍼스",
      period: "2025.04 ~ 2025.07",
      description:
        "Java Spring Boot 기반 기업 연계 프로젝트에서 RFP를 직접 분석하고, 서비스 개발부터 배포·운영 흐름까지 담당했습니다.",
    },
    {
      type: "project",
      badge: "팀 프로젝트",
      title: "가사도우미 매칭 서비스 백엔드",
      organization: "팀 프로젝트",
      period: "2025.05 ~ 2025.07",
      description:
        "257개 파일 규모의 공통 모듈을 8개 도메인 모듈로 전환하는 아키텍처 설계를 주도하고, JWT 인증·인가와 예약-매칭-결제 흐름, Blue-Green 무중단 배포를 구현했습니다.",
    },
    {
      type: "project",
      badge: "개인 프로젝트",
      title: "ChatGPT 인터랙티브 웹 서비스",
      organization: "개인 프로젝트",
      period: "2024.11 ~ 2025.01",
      description:
        "4개 독립 FastAPI 마이크로서비스를 멀티레포 구조로 설계하고 OpenAI API로 공감 전용 AI 페르소나를 구현했습니다. GitHub Actions CI와 SonarCloud 정적 분석으로 코드 품질 검증을 자동화했습니다.",
    },
    {
      type: "project",
      badge: "팀 프로젝트",
      title: "문제 있는 은행장",
      organization: "구름 팀 프로젝트",
      period: "2022.10 ~ 2022.11",
      description:
        "AWS EKS 기반 자격증 기출문제 모의고사 서비스. 시험 기간 트래픽 급증에 대비해 오토스케일링·CI/CD·CloudWatch 모니터링·OpenSearch 로그 스택을 구축했습니다.",
    },
    {
      type: "bootcamp",
      badge: "수료",
      title: "쿠버네티스 전문가 양성과정 5기",
      organization: "구름",
      period: "2022.07 ~ 2022.11",
      description:
        "AWS와 Kubernetes 클러스터 환경에서 오토스케일링, 모니터링, 로그 스택 구축을 학습하고 팀 프로젝트에 적용했습니다.",
    },
    {
      type: "project",
      badge: "팀 프로젝트",
      title: "스마트팜 재배기 모니터링 시스템",
      organization: "팀 프로젝트",
      period: "2022.03 ~ 2022.07",
      description:
        "Azure Cloud 기반 IoT 센서 데이터 수집·이상 감지·원격 디바이스 제어 플랫폼. DAS와 ModbusTCP로 통신하는 Data Collector와 Monitoring Engine을 구성하고 원격 데이터 수집·DB 업로드·디바이스 제어를 담당했습니다.",
    },
    {
      type: "education",
      badge: "졸업",
      title: "컴퓨터전자시스템공학부 / 통계학과",
      organization: "한국외국어대학교",
      period: "2017.02 ~ 2023.02",
      description:
        "컴퓨터공학 트랙을 주 전공, 통계학을 이중 전공으로 이수했습니다. 알고리즘·OS부터 금융수학·데이터마이닝까지 두 분야를 함께 다뤘습니다.",
    },
    {
      type: "career",
      badge: "학부연구생",
      title: "임베디드 CNN 최적화 연구",
      organization: "HUFS System Software Lab",
      period: "2021.07 ~ 2023.02",
      description:
        "ARM 기반 임베디드 시스템에서 Mixed Precision CNN 최적화 프레임워크를 개발했습니다. 논문 2편을 작성하고 모델 추론 시간을 5~7% 단축했습니다.",
    },
  ],
  workStyle: {
    quote: "구현보다 설계가 먼저이고, 직감보다 측정이 먼저입니다.",
    principles: [
      "구현보다 구조가 먼저입니다. 도메인 경계와 API 책임이 명확해진 다음에 코드를 씁니다.",
      "성능 문제는 측정이 먼저입니다. 병목이 어디인지 수치로 확인하기 전에는 코드에 손을 대지 않습니다.",
      "설계 결정의 이유를 기록으로 남깁니다. 나중에 합류한 팀원도 같은 논쟁을 반복하지 않도록.",
      "사람보다 자동화가 먼저 문제를 걸러야 리뷰가 정말 중요한 것에 집중할 수 있습니다.",
    ],
  },
  growthMetrics: [
    {
      label: "대표 프로젝트",
      value: "5+",
      description: "백엔드/클라우드 중심 프로젝트",
      icon: "Layers",
    },
    {
      label: "연구 경험",
      value: "1년 7개월",
      description: "HUFS System Software Lab",
      icon: "Calendar",
    },
    {
      label: "자격 / 수상",
      value: "4개",
      description: "SAA, SQLD, ADsP, ACK 장려상",
      icon: "Code2",
    },
    {
      label: "전공 기반",
      value: "2개",
      description: "컴퓨터공학·통계학",
      icon: "Github",
    },
  ],
};
