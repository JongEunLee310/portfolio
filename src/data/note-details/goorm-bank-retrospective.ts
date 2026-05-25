import type { TechnicalNoteDetail } from "@/types/note";
import { goormBankRetrospective } from "../notes/goorm-bank-retrospective";

export const goormBankRetrospectiveDetail: TechnicalNoteDetail = {
  ...goormBankRetrospective,
  template: "retrospective",
  toc: [
    { id: "overview", title: "개요", depth: 1 },
    { id: "phase1", title: "Phase 1 · MVP 기능 구현", depth: 1 },
    { id: "phase2", title: "Phase 2 · 인증·사용자 기능 확장", depth: 1 },
    { id: "phase3", title: "Phase 3 · 배포 자동화·운영 환경 실험", depth: 1 },
    { id: "phase4", title: "Phase 4 · 최종 운영 구조 정리", depth: 1 },
    { id: "reflection", title: "전체를 돌아보며", depth: 1 },
    { id: "status", title: "현재 상태", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "overview",
      title: "개요",
    },
    {
      type: "paragraph",
      content:
        "문제은행 서비스는 국가기술자격시험 기출문제를 사용자가 쉽게 조회하고, 모의고사 형태로 풀어보며, 자신의 정답·오답 비율을 확인할 수 있도록 만들기 위해 시작한 프로젝트다. 처음에는 문제 조회와 풀이 기능을 중심으로 한 단순 웹 서비스를 목표로 했지만, 개발 과정에서 로그인, 게시판, 마이페이지, CI/CD, EKS 배포, 로그 수집, 오토스케일링까지 포함하는 클라우드 기반 학습 서비스 구조로 확장되었다.",
    },
    {
      type: "paragraph",
      content:
        "결과적으로 이 프로젝트는 단순 CRUD 프로젝트라기보다, Spring Boot 기반 백엔드 서비스가 Kubernetes 환경에서 어떻게 배포·운영되는지 경험한 프로젝트에 가까워졌다.",
    },
    {
      type: "list",
      items: [
        "Phase 1 — 기출문제 조회, 모의고사, 정답·오답 통계, 자유게시판 MVP 구현",
        "Phase 2 — 서비스 계정 로그인, 네이버 OAuth, 마이페이지 개인 통계 연동",
        "Phase 3 — Jenkins CI, Argo CD EKS 배포, GitOps 흐름 실험",
        "Phase 4 — Fluent Bit 로그 수집, CloudWatch, OpenSearch, HPA 오토스케일링",
      ],
    },
    {
      type: "heading",
      id: "phase1",
      title: "Phase 1 · MVP 기능 구현 단계",
    },
    {
      type: "paragraph",
      content:
        "초기 단계에서는 문제 조회, 문제 풀이, 모의고사, 정답 확인, 정답·오답 통계 조회를 중심으로 구현했다. 로그인하지 않아도 기출문제와 모의고사를 사용할 수 있도록 공개 기능으로 구성하고, 로그인 사용자는 마이페이지에서 풀이 결과 기반 통계를 확인할 수 있도록 했다. 커뮤니티 성격을 더하기 위해 자유게시판과 댓글 기능도 함께 구현했다.",
    },
    {
      type: "paragraph",
      content: "고민했던 것",
    },
    {
      type: "comparison",
      items: [
        {
          title: "문제 도메인을 CRUD로 다루기",
          description:
            "문제 하나는 단순한 텍스트가 아니라 선택지, 정답, 해설, 유형, 과목, 회차 등의 하위 데이터를 함께 가진다. 객관식과 주관식, 단일 정답과 복수 정답 같은 규칙이 들어가면 단순 입력 검증만으로는 부족하다.",
          bullets: [
            "단순 CRUD: 초기 구현 빠름, 수정 시 선택지·정답·해설 일부만 갱신되면 데이터 불일치",
            "도메인 검증 중심: 풀이 가능한 상태를 유지하는 복합 aggregate로 처리 — 다음 프로젝트에서 적용할 방향",
          ],
        },
        {
          title: "공개 기능과 로그인 기능의 범위",
          description:
            "모든 기능을 로그인 뒤에 숨기면 서비스 접근성이 낮아지고, 문제은행의 공개 조회 성격과 맞지 않는다. 반대로 모든 기능을 공개하면 개인 통계와 작성 권한 관리가 어렵다.",
          bullets: [
            "전체 로그인 필수: 진입 장벽 높음, 문제은행 공개 조회 성격과 맞지 않음",
            "조회·모의고사 공개 + 통계·작성 로그인 필수: 접근성과 개인화를 함께 유지 — 채택",
          ],
        },
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "문제 수정은 단순히 문제 본문만 바꾸는 작업이 아니었다. 선택지, 정답, 해설 같은 하위 데이터까지 함께 갱신해야 했고, 일부만 수정되거나 일부만 실패하면 사용자가 보는 문제 상태가 깨질 수 있었다. 근본 원인은 문제 도메인이 복합 aggregate에 가까운데 초기에는 단순 CRUD처럼 다루려 했기 때문이다.",
    },
    {
      type: "heading",
      id: "phase2",
      title: "Phase 2 · 인증·사용자 기능 확장 단계",
    },
    {
      type: "paragraph",
      content:
        "사용자의 풀이 결과를 누적하고 개인화된 통계를 보여주려면 사용자 식별이 필요했다. 서비스 계정 로그인과 네이버 소셜 로그인을 도입하고, 로그인 사용자를 기준으로 정답·오답 비율을 확인할 수 있는 마이페이지 기능을 구성했다.",
    },
    {
      type: "paragraph",
      content: "채택하지 않은 방향",
    },
    {
      type: "comparison",
      items: [
        {
          title: "모든 문제 조회·풀이 기능을 로그인 필수로 제한",
          description: "초기 진입 장벽이 높아지고 문제은행 서비스의 공개 조회 성격과 맞지 않아 채택하지 않았다.",
          bullets: [
            "로그인 필수: 접근 장벽 높음, 포트폴리오 관점에서 OAuth 경험은 별도로 보여줄 수 있음",
            "공개 조회 유지: 서비스 목적과 일치, 로그인 후 개인 통계 기능이 방문 이유가 됨 — 채택",
          ],
        },
        {
          title: "소셜 로그인만 제공",
          description: "서비스 계정 기반 흐름을 테스트하거나 기본 인증 구조를 설명하기 어렵다.",
          bullets: [
            "소셜 로그인만: 가입 부담 감소, 자체 인증 구조 설명 어려움",
            "자체 + 네이버 OAuth 병행: 양쪽 흐름 모두 경험 — 채택",
          ],
        },
        {
          title: "풀이 결과를 비로그인 사용자에게도 영구 저장",
          description: "사용자 식별 기준이 모호하고, 브라우저 저장소 기반으로 처리하면 신뢰성 있는 통계 관리가 어렵다.",
          bullets: [
            "브라우저 저장소: 구현 단순, 기기 간 동기화 불가, 통계 신뢰성 낮음",
            "로그인 기반 저장: 서버 영속화, 개인 통계 기능의 진입점이 됨 — 채택",
          ],
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "인증은 단순히 '로그인을 붙이는 작업'이 아니라, 서비스의 사용 흐름을 어디까지 열고 어디서부터 보호할지 결정하는 설계 문제라는 것을 확인했다.",
    },
    {
      type: "heading",
      id: "phase3",
      title: "Phase 3 · 배포 자동화·운영 환경 실험 단계",
    },
    {
      type: "paragraph",
      content:
        "로컬에서 기능을 구현하는 것만으로는 실제 서비스 운영 흐름을 설명하기 어려웠다. AWS 서울 리전에 VPC와 EKS Cluster를 구성하고, CI용 EC2에서 Jenkins를 통해 빌드·테스트·이미지 생성 흐름을 구성했다. 이후 Argo CD를 이용해 Kubernetes 환경에 애플리케이션을 배포하는 CD 구조를 실험했다.",
    },
    {
      type: "paragraph",
      content: "채택하지 않은 대안",
    },
    {
      type: "comparison",
      items: [
        {
          title: "EC2 단일 서버 배포",
          description: "빠르게 배포할 수 있지만 Kubernetes 운영 경험을 얻기 어렵다.",
          bullets: [
            "EC2 단일: 배포 빠름, HPA·Cluster Autoscaler 실험 불가",
            "EKS + Argo CD: 배포 복잡도 높음, GitOps 흐름과 운영 관찰 경험 가능 — 채택",
          ],
        },
        {
          title: "Docker Compose 기반 배포",
          description: "로컬 또는 단일 서버에는 적합하지만 EKS, Argo CD, HPA/CA 실험과 거리가 있다.",
          bullets: [
            "Docker Compose: 구성 단순, Kubernetes 리소스 직접 경험 불가",
            "EKS 직접 구성: 복잡하지만 학습 목적에 부합 — 채택",
          ],
        },
        {
          title: "Elastic Beanstalk",
          description: "운영 부담은 줄어들지만 Kubernetes 리소스와 GitOps 흐름을 직접 다루기 어렵다.",
          bullets: [
            "Beanstalk: 관리형 서비스로 운영 부담 낮음, Kubernetes 개념 학습 제한",
            "EKS 직접 운영: 학습 비용 높음, Node·Pod·Service·Ingress 전체 흐름 이해 — 채택",
          ],
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이 단계에서는 효율성보다 학습 범위가 더 중요했다. Jenkins로 CI를 구성하고, Argo CD로 EKS 배포 상태를 관리하는 구조가 프로젝트의 목적에 더 잘 맞았다.",
    },
    {
      type: "heading",
      id: "phase4",
      title: "Phase 4 · 최종 운영 구조 정리 단계",
    },
    {
      type: "paragraph",
      content:
        "최종 방향은 단순 배포가 아니라, 배포된 서비스를 관찰하고 운영할 수 있는 구조를 만드는 것이었다. EKS 위에 애플리케이션을 배포하고, 로그는 Fluent Bit을 통해 수집하여 CloudWatch와 OpenSearch로 전달하는 구조를 구성했다. 오토스케일링은 CloudWatch 메트릭 기반 계획에서 EKS Metric Server 기반 HPA 구조로 변경했다.",
    },
    {
      type: "paragraph",
      content: "모니터링·로그 수집 도구 비교",
    },
    {
      type: "comparison",
      items: [
        {
          title: "Fluentd",
          description: "로그 수집·변환에 강하지만 메모리 소비가 상대적으로 크다. 복잡한 로그 처리에 적합하다.",
          bullets: [
            "장점: 플러그인 생태계 풍부, 복잡한 필터·변환 가능",
            "한계: 경량 수집에는 Fluent Bit 대비 무거움",
          ],
        },
        {
          title: "Fluent Bit",
          description: "경량 에이전트로 EKS DaemonSet 방식 수집에 적합하다. CloudWatch·OpenSearch 연동이 용이하다.",
          bullets: [
            "장점: 메모리 효율 높음, AWS 플러그인 내장",
            "EKS 로그 수집에 채택 — 채택",
          ],
        },
        {
          title: "Prometheus + Grafana",
          description: "시계열 메트릭 시각화에 강하다. AWS 서비스와 통합하려면 별도 구성이 필요하다.",
          bullets: [
            "장점: 메트릭 알림과 시각화 강력",
            "한계: AWS 기반 프로젝트에서 CloudWatch와 역할이 겹침, 추가 구성 비용",
          ],
        },
        {
          title: "CloudWatch + OpenSearch",
          description: "AWS 서비스와 자연스럽게 연결되고 EKS 로그 저장·검색·관찰에 적합하다.",
          bullets: [
            "장점: EKS와 AWS 생태계 연동 용이, 로그 검색·대시보드 구성 가능",
            "로그 수집·분석 구조로 채택 — 채택",
          ],
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "도구 비교의 핵심은 '무엇이 더 좋은 도구인가'가 아니라 '현재 프로젝트의 목적에 무엇이 더 적절한가'였다. 문제은행 서비스는 AWS EKS 기반 학습 프로젝트였기 때문에, AWS 서비스와 자연스럽게 연결되는 도구를 우선했다. 오토스케일링도 처음에는 CloudWatch 메트릭 기반을 검토했지만, Kubernetes 내부 리소스 사용량 기준으로 파드를 조절하는 흐름을 이해하기 위해 Metric Server 기반 HPA를 선택했다.",
    },
    {
      type: "heading",
      id: "reflection",
      title: "전체를 돌아보며",
    },
    {
      type: "cards",
      items: [
        {
          title: "문제은행 서비스는 단순 CRUD보다 도메인 규칙이 중요했다",
          description:
            "문제 하나는 선택지, 정답, 해설, 유형, 과목, 회차 등의 하위 데이터를 함께 가진다. 객관식과 주관식, 단일 정답과 복수 정답 같은 규칙이 들어가면 단순 입력 검증만으로는 부족하다. 다음에 비슷한 서비스를 만든다면 문제 생성과 수정 로직은 더 명확하게 도메인 규칙 중심으로 분리할 필요가 있다.",
        },
        {
          title: "공개 기능과 로그인 기능의 경계를 나누는 것이 중요했다",
          description:
            "기출문제 조회와 모의고사는 공개하고, 게시글 작성·댓글 작성·마이페이지 통계는 로그인 사용자에게만 제공한 것은 좋은 선택이었다. 모든 기능을 로그인 뒤에 숨겼다면 접근성이 낮아졌을 것이고, 반대로 모두 공개했다면 개인 통계와 작성 권한 관리가 어려웠을 것이다.",
        },
        {
          title: "EKS는 기능 구현보다 운영 개념을 배우는 데 더 큰 의미가 있었다",
          description:
            "단일 서버 배포에 비해 VPC, Cluster, Node, Pod, Service, Ingress, CI/CD, 로그 수집, 스케일링까지 고려해야 할 요소가 많았다. 그만큼 백엔드 애플리케이션이 실제 운영 환경에서 어떤 단위로 배포되고 관찰되는지를 이해할 수 있었다. 비용 효율이나 개발 속도 측면에서는 과한 선택일 수 있지만, 운영 환경을 경험하기 위한 학습 프로젝트로서는 의미가 있었다.",
        },
        {
          title: "도구 선택은 '좋은 도구'보다 '현재 목적에 맞는 도구'가 중요했다",
          description:
            "여러 선택지가 있었지만, 최종적으로는 프로젝트의 맥락에 맞는 방향을 골라야 했다. 도구 비교를 기능 목록으로만 하면 결론이 흐려진다. '운영자가 무엇을 보고 싶은가', '장애가 났을 때 어디서 확인할 것인가', '이 프로젝트의 학습 목표가 무엇인가'를 먼저 정하고 도구를 선택해야 한다.",
        },
      ],
    },
    {
      type: "heading",
      id: "status",
      title: "현재 상태",
    },
    {
      type: "cards",
      items: [
        {
          title: "MVP 기능 구현",
          description: "기출문제 조회, 모의고사, 정답 확인, 정답·오답 통계, 자유게시판, 댓글 기능",
          badge: "완료",
        },
        {
          title: "인증·사용자 기능",
          description: "서비스 계정 로그인, 네이버 소셜 로그인, 로그인 사용자 권한 제어, 마이페이지 통계",
          badge: "완료",
        },
        {
          title: "CI/CD 구성",
          description: "Jenkins 기반 CI, Argo CD 기반 EKS 배포 흐름",
          badge: "구현·실험 완료",
        },
        {
          title: "운영 환경 구성",
          description: "AWS 서울 리전 VPC, EKS Cluster, CI용 EC2, CloudWatch, OpenSearch, Fluent Bit",
          badge: "구현·실험 완료",
        },
        {
          title: "스케일링 구성",
          description: "EKS Metric Server 기반 HPA, Cluster Autoscaler 개념 정리",
          badge: "구현·실험 완료",
        },
        {
          title: "트러블슈팅 문서화",
          description: "question, exam, auth, file, database, infra 영역별 문제 정리",
          badge: "진행 중",
        },
      ],
    },
    {
      type: "paragraph",
      content: "남은 과제",
    },
    {
      type: "list",
      items: [
        "문제 등록·수정 과정에서 선택지, 정답, 해설 데이터의 일관성을 보장하는 도메인 검증 구조를 더 명확히 문서화한다.",
        "모의고사 결과 저장과 정답·오답 통계 산출 기준을 정리하고, 재풀이·중복 풀이·회차별 통계 정책을 보완한다.",
        "EKS 배포 구조를 다이어그램으로 정리해 VPC, Cluster, Jenkins, Argo CD, Pod, Service, 로그 수집 흐름을 한눈에 볼 수 있게 만든다.",
        "HPA와 Cluster Autoscaler의 역할 차이를 정리하고, 실제 부하 테스트 수치가 있다면 스케일링 검증 문서에 추가한다.",
        "포트폴리오에서는 기능 구현 프로젝트가 아니라 문제은행 서비스 + Kubernetes 운영 학습 프로젝트로 포지셔닝한다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "question-option-answer-consistency",
    "exam-submit-score-consistency",
    "cors-cookie-auth-failure",
    "refresh-token-reissue-loop",
    "soft-delete-query-leak",
    "excel-question-import-validation",
  ],
};
