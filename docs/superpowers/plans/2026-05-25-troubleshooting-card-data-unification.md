# Troubleshooting Card 데이터 단일화 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** project-detail의 `troubleshooting[]` 배열을 제거하고 note 파일을 단일 진실 공급원으로 만든다.

**Architecture:** `TechnicalNoteCard`에 `cardSummary`(card 표시용 텍스트) + `isStub` 필드를 추가한다. `ProjectDetail.troubleshooting[]`을 `troubleshootingNoteSlugs: string[]`으로 교체하고, ProjectDetailPage에서 slug를 조회해 computed 배열로 ProjectClosingCardsSection에 전달한다. note 파일이 없는 카드는 `src/data/projectNoteStubs.ts`에 최소 스텁으로 생성한다.

**Tech Stack:** TypeScript, React, Vitest

---

## 파일 변경 지도

| 파일 | 작업 |
|------|------|
| `src/types/note.ts` | `TechnicalNoteCard`에 `cardSummary`, `isStub` 추가 |
| `src/types/project.ts` | `troubleshooting[]` → `troubleshootingNoteSlugs`, `relatedNoteSlugs` 제거 |
| `src/data/projectNoteStubs.ts` | 신규 생성 — note 없는 카드용 최소 스텁 |
| `src/pages/ProjectDetailPage.tsx` | technicalNotes + stubs 조합해 troubleshootingCards 계산 |
| `src/components/project/ProjectClosingCardsSection.tsx` | props 타입 변경, 렌더링 로직 업데이트 |
| `src/data/notes/*.ts` (24개) | `cardSummary` 필드 추가 |
| `src/data/project-details/*.ts` (7개) | `troubleshooting[]` → `troubleshootingNoteSlugs`, `relatedNoteSlugs` 제거 |
| `src/tests/content-integrity.test.ts` | 테스트 교체 |

---

## Task 1: 타입 변경

**Files:**
- Modify: `src/types/note.ts`
- Modify: `src/types/project.ts`

- [ ] **Step 1: `TechnicalNoteCard`에 cardSummary, isStub 추가**

`src/types/note.ts`의 `TechnicalNoteCard` 타입을 아래와 같이 수정한다.

```ts
export type TechnicalNoteCard = {
  slug: string;
  title: string;
  summary: string;
  category: NoteCategory;
  thumbnail: string;
  date: string;
  readingTime: string;
  tags: TechTag[];
  featured?: boolean;
  relatedProjectSlugs?: string[];
  cardSummary?: {
    title: string;
    problem: string;
    solution: string;
    result?: string;
  };
  isStub?: true;
};
```

- [ ] **Step 2: `ProjectDetail`에서 `troubleshooting[]`, `relatedNoteSlugs` 제거 후 `troubleshootingNoteSlugs` 추가**

`src/types/project.ts`의 `ProjectDetail` 타입에서 아래를 제거:

```ts
// 제거
troubleshooting: {
  title: string;
  problem: string;
  solution: string;
  result?: string;
  noteSlug?: string;
}[];
relatedNoteSlugs: string[];
```

아래로 교체 (`improvements?: ProjectImprovement[];` 바로 위에 삽입):

```ts
troubleshootingNoteSlugs: string[];
```

- [ ] **Step 3: 타입 에러 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx tsc --noEmit 2>&1 | head -50
```

타입 에러가 대거 발생하는 것은 정상 (이후 태스크에서 순차적으로 수정).

---

## Task 2: projectNoteStubs.ts 생성

**Files:**
- Create: `src/data/projectNoteStubs.ts`

스텁 파일은 `TechnicalNoteCard` 형태이며, `isStub: true`와 `cardSummary`만 있으면 된다. `technicalNotes` 배열에는 추가하지 않는다.

스텁 목록 (총 12개):

| slug | 프로젝트 |
|------|---------|
| `eks-worker-node-subnet-placement` | eks |
| `eks-fluentd-rbac-permission` | eks |
| `eks-lambda-kms-decrypt` | eks |
| `goorm-bank-eks-application-log-troubleshooting` | goorm-bank |
| `goorm-bank-cloudwatch-container-insights-troubleshooting` | goorm-bank |
| `goorm-bank-jenkins-argocd-cicd-troubleshooting` | goorm-bank |
| `ai-devops-backgroundtasks-durability` | ai-devops |
| `ai-devops-threadpool-saturation` | ai-devops |
| `arm-letterbox-computation-reduction` | arm |
| `arm-gemm-neighbor-pixel-failure` | arm |
| `arm-int8-image-value-loss` | arm |
| `arm-bias-quantization-failure` | arm |

- [ ] **Step 1: projectNoteStubs.ts 생성**

```ts
import type { TechnicalNoteCard } from "@/types/note";

export const projectNoteStubs: TechnicalNoteCard[] = [
  {
    slug: "eks-worker-node-subnet-placement",
    title: "EKS 워커 노드 서브넷 배치 문제",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2024.01",
    readingTime: "3분 읽기",
    tags: [{ name: "AWS", category: "infra" }, { name: "EKS", category: "infra" }],
    relatedProjectSlugs: ["eks-efk-monitoring-practice"],
    isStub: true,
    cardSummary: {
      title: "EKS 워커 노드 서브넷 배치 문제",
      problem: "eksctl로 클러스터를 생성할 때 워커 노드가 의도한 프라이빗 서브넷이 아닌 퍼블릭 서브넷에 생성되는 문제가 있었다.",
      solution: "--vpc-private-subnets, --ssh-access, --ssh-public-key, --managed 옵션을 명시해 관리형 노드 그룹과 프라이빗 서브넷 배치를 구성했다.",
      result: "EKS 워커 노드가 프라이빗 서브넷에서 동작하도록 구성하고, Bastion Host를 통해 접근하는 구조를 이해했다.",
    },
  },
  {
    slug: "eks-fluentd-rbac-permission",
    title: "Fluentd 로그 수집 권한 문제",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2024.01",
    readingTime: "3분 읽기",
    tags: [{ name: "AWS", category: "infra" }, { name: "EKS", category: "infra" }, { name: "Fluentd", category: "observability" }],
    relatedProjectSlugs: ["eks-efk-monitoring-practice"],
    isStub: true,
    cardSummary: {
      title: "Fluentd 로그 수집 권한 문제",
      problem: "Fluentd DaemonSet이 로그를 수집해야 했지만 Kubernetes 리소스 조회와 로그 경로 접근 권한 구성이 부족해 로그가 정상 수집되지 않았다.",
      solution: "hostPath로 로그 디렉터리를 마운트하고, ServiceAccount, ClusterRole, ClusterRoleBinding을 구성해 필요한 권한을 부여했다.",
      result: "각 워커 노드에서 Fluentd가 로그를 수집하고 ElasticSearch로 전달하는 흐름을 구성했다.",
    },
  },
  {
    slug: "eks-lambda-kms-decrypt",
    title: "Lambda의 KMS 복호화 실패",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2024.01",
    readingTime: "3분 읽기",
    tags: [{ name: "AWS", category: "infra" }, { name: "Lambda", category: "infra" }, { name: "KMS", category: "infra" }],
    relatedProjectSlugs: ["eks-efk-monitoring-practice"],
    isStub: true,
    cardSummary: {
      title: "Lambda의 KMS 복호화 실패",
      problem: "Slack Webhook URL을 KMS로 암호화했지만 Lambda가 복호화하지 못해 Slack 알림 전송이 실패했다.",
      solution: "Lambda 실행 역할에 kms:Decrypt 권한을 추가하고, Lambda 함수 이름을 Encryption Context로 포함해 암호화·복호화 흐름을 맞췄다.",
      result: "CPU 임계치 초과 시 CloudWatch 경보가 Slack 메시지로 전달되는 것을 확인했다.",
    },
  },
  {
    slug: "goorm-bank-eks-application-log-troubleshooting",
    title: "EKS 애플리케이션 로그 수집 실패",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2024.01",
    readingTime: "3분 읽기",
    tags: [{ name: "AWS", category: "infra" }, { name: "EKS", category: "infra" }],
    relatedProjectSlugs: ["goorm-bank-problem-bank"],
    isStub: true,
    cardSummary: {
      title: "EKS 애플리케이션 로그 수집 실패",
      problem: "",
      solution: "",
    },
  },
  {
    slug: "goorm-bank-cloudwatch-container-insights-troubleshooting",
    title: "EKS 리소스 모니터링 대시보드 혼동",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2024.01",
    readingTime: "3분 읽기",
    tags: [{ name: "AWS", category: "infra" }, { name: "CloudWatch", category: "observability" }],
    relatedProjectSlugs: ["goorm-bank-problem-bank"],
    isStub: true,
    cardSummary: {
      title: "EKS 리소스 모니터링 대시보드 혼동",
      problem: "",
      solution: "",
    },
  },
  {
    slug: "goorm-bank-jenkins-argocd-cicd-troubleshooting",
    title: "Jenkins와 Argo CD 연동 인증 문제",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2024.01",
    readingTime: "3분 읽기",
    tags: [{ name: "Jenkins", category: "tool" }, { name: "ArgoCD", category: "tool" }],
    relatedProjectSlugs: ["goorm-bank-problem-bank"],
    isStub: true,
    cardSummary: {
      title: "Jenkins와 Argo CD 연동 인증 문제",
      problem: "",
      solution: "",
    },
  },
  {
    slug: "ai-devops-backgroundtasks-durability",
    title: "FastAPI BackgroundTasks 내구성 부재",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2024.01",
    readingTime: "3분 읽기",
    tags: [{ name: "FastAPI", category: "backend" }, { name: "Python", category: "language" }],
    relatedProjectSlugs: ["ai-devops-orchestration-platform"],
    isStub: true,
    cardSummary: {
      title: "FastAPI BackgroundTasks 내구성 부재",
      problem: "서버 재시작 시 실행 중이거나 대기 중인 태스크가 모두 인메모리에서 유실되고 retry 경로가 없었습니다.",
      solution: "Celery + Redis로 전환한 뒤 최종적으로 RabbitMQ 기반 MSA로 대체했습니다.",
      result: "실패 결정 기록으로 보존해 같은 접근을 반복하지 않도록 했습니다.",
    },
  },
  {
    slug: "ai-devops-threadpool-saturation",
    title: "ThreadPoolExecutor 포화",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2024.01",
    readingTime: "3분 읽기",
    tags: [{ name: "FastAPI", category: "backend" }, { name: "Python", category: "language" }],
    relatedProjectSlugs: ["ai-devops-orchestration-platform"],
    isStub: true,
    cardSummary: {
      title: "ThreadPoolExecutor 포화",
      problem: "pipeline-execution-svc의 asyncio.run_in_executor 기본 max_workers=2 설정으로 동시 실행 2건 초과 시 태스크 대기가 발생했습니다.",
      solution: "max_workers를 명시적으로 확장하고 실행 흐름을 재검토했습니다.",
      result: "100 VU 부하 테스트에서 실패율 12.9%를 해소했습니다.",
    },
  },
  {
    slug: "arm-letterbox-computation-reduction",
    title: "Letterbox 영역 제거 기반 계산량 감소 실험",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2023.01",
    readingTime: "3분 읽기",
    tags: [{ name: "C++", category: "language" }, { name: "ARM", category: "infra" }],
    relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
    isStub: true,
    cardSummary: {
      title: "Letterbox 영역 제거 기반 계산량 감소 실험",
      problem: "YOLOv3-tiny는 입력 이미지를 416x416 정사각형으로 맞추기 위해 letterbox 영역을 추가하고, im2col/GEMM은 이 영역까지 계산했다.",
      solution: "이미지 비율에 맞게 network width/height를 조정하거나 letterbox 영역의 계산을 줄이는 방안을 실험했다.",
      result: "실행시간은 줄었지만 detection 수와 정확도 저하가 발생해 단순 입력 크기 축소의 한계를 확인했다.",
    },
  },
  {
    slug: "arm-gemm-neighbor-pixel-failure",
    title: "인접 픽셀 평균화 기반 GEMM 계산 축소 실패",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2023.01",
    readingTime: "3분 읽기",
    tags: [{ name: "C++", category: "language" }, { name: "ARM", category: "infra" }],
    relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
    isStub: true,
    cardSummary: {
      title: "인접 픽셀 평균화 기반 GEMM 계산 축소 실패",
      problem: "인접 픽셀 평균을 GEMM 과정에 직접 적용했지만 평균 계산 비용이 증가하고 No Detection이 발생했다.",
      solution: "GEMM 내부가 아니라 im2col 단계에서 유사 픽셀을 통일하고 이후 계산을 생략하는 방향으로 전환했다.",
      result: "정확도 손실을 일으키는 전처리성 최적화보다 구조적 정밀도 제어가 필요하다는 결론을 얻었다.",
    },
  },
  {
    slug: "arm-int8-image-value-loss",
    title: "INT8 image casting으로 인한 정보 손실",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2023.01",
    readingTime: "3분 읽기",
    tags: [{ name: "C++", category: "language" }, { name: "ARM", category: "infra" }],
    relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
    isStub: true,
    cardSummary: {
      title: "INT8 image casting으로 인한 정보 손실",
      problem: "0~1 float image 값을 int8로 단순 casting하면서 대부분 0으로 손실되었다.",
      solution: "image value range를 분석하고 scale factor 기반 quantization 필요성을 도출했다.",
      result: "단순 type casting 대신 quantize/dequantize 인터페이스를 설계했다.",
    },
  },
  {
    slug: "arm-bias-quantization-failure",
    title: "Bias Quantization 실패",
    summary: "",
    category: "troubleshooting",
    thumbnail: "",
    date: "2023.01",
    readingTime: "3분 읽기",
    tags: [{ name: "C++", category: "language" }, { name: "ARM", category: "infra" }],
    relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
    isStub: true,
    cardSummary: {
      title: "Bias Quantization 실패",
      problem: "bias를 quantize하면 dequantize 이후 원본 bias 복원이 어려워 detection이 실패했다.",
      solution: "bias float 유지와 Conv-Maxpool 통합 실행을 통한 변환 횟수 감소 방향으로 전환했다.",
      result: "bias quantization보다 변환 비용 절감이 현실적인 개선 방향임을 확인했다.",
    },
  },
];
```

> **주의:** goorm-bank 스텁 3개는 원본 project-detail에서 problem/solution 텍스트를 읽어 채워야 한다. Task 9에서 처리한다.

- [ ] **Step 2: 빌드 확인 (타입만)**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx tsc --noEmit 2>&1 | grep "projectNoteStubs" | head -10
```

오류 없으면 계속.

---

## Task 3: 렌더링 로직 변경

**Files:**
- Modify: `src/pages/ProjectDetailPage.tsx`
- Modify: `src/components/project/ProjectClosingCardsSection.tsx`

- [ ] **Step 1: ProjectDetailPage에서 troubleshootingCards 계산**

`src/pages/ProjectDetailPage.tsx` 상단 import에 추가:

```ts
import { technicalNotes } from "@/data/technicalNotes";
import { projectNoteStubs } from "@/data/projectNoteStubs";
import type { TechnicalNoteCard } from "@/types/note";
```

`ProjectDetailPage` 컴포넌트 내부에서 `project`를 조회한 직후, 렌더 전에 추가:

```ts
const allNotes = [...technicalNotes, ...projectNoteStubs];
const troubleshootingCards: TechnicalNoteCard[] = project.troubleshootingNoteSlugs
  .map((slug) => allNotes.find((n) => n.slug === slug))
  .filter((n): n is TechnicalNoteCard => n !== undefined && n.cardSummary !== undefined);
```

`ProjectClosingCardsSection`에 prop 추가:

```tsx
<ProjectClosingCardsSection
  project={project}
  troubleshootingCards={troubleshootingCards}
/>
```

- [ ] **Step 2: ProjectClosingCardsSection props 타입 변경**

`src/components/project/ProjectClosingCardsSection.tsx`에서:

```ts
// 기존
type ProjectClosingCardsSectionProps = {
  project: ProjectDetail;
};

// 변경 후
import type { TechnicalNoteCard } from "@/types/note";

type ProjectClosingCardsSectionProps = {
  project: ProjectDetail;
  troubleshootingCards: TechnicalNoteCard[];
};
```

함수 시그니처 변경:

```ts
export function ProjectClosingCardsSection({
  project,
  troubleshootingCards,
}: ProjectClosingCardsSectionProps) {
```

내부 `troubleshooting` 변수 교체:

```ts
// 기존
const troubleshooting = project.troubleshooting.filter(
  (item) => hasText(item.title) && hasText(item.solution),
);

// 변경 후 (hasText 함수는 그대로 유지)
const troubleshooting = troubleshootingCards;
```

- [ ] **Step 3: TroubleshootingSlide 타입 + 렌더 변경**

`TroubleshootingSlideProps` 타입 변경:

```ts
// 기존
type TroubleshootingSlideProps = {
  item: ProjectDetail["troubleshooting"][number];
};

// 변경 후
type TroubleshootingSlideProps = {
  item: TechnicalNoteCard;
};
```

`TroubleshootingSlide` 함수 내부 렌더 변경:

```tsx
function TroubleshootingSlide({ item }: TroubleshootingSlideProps) {
  const summary = item.cardSummary!;
  const content = (
    <div className="h-[400px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5 transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-bold text-[var(--color-page-text)]">{summary.title}</h3>
        {!item.isStub ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--color-accent)]">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.openNote}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <dl className="mt-5 space-y-4 text-sm leading-6">
        <div>
          <dt className="font-bold text-[var(--color-page-text)]">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.problem}
          </dt>
          <dd className="mt-1 text-[var(--color-muted-text)]">{summary.problem}</dd>
        </div>
        <div>
          <dt className="font-bold text-[var(--color-page-text)]">
            {PROJECT_DETAIL_LABELS.sections.troubleshooting.solution}
          </dt>
          <dd className="mt-1 text-[var(--color-muted-text)]">{summary.solution}</dd>
        </div>
        {summary.result ? (
          <div>
            <dt className="font-bold text-[var(--color-page-text)]">
              {PROJECT_DETAIL_LABELS.sections.troubleshooting.result}
            </dt>
            <dd className="mt-1 text-[var(--color-muted-text)]">{summary.result}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );

  if (item.isStub) {
    return content;
  }

  return (
    <Link
      to={PATHS.technicalNoteDetail(item.slug)}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}
```

dot indicator의 `key`와 `aria-label`도 업데이트:

```tsx
// 기존
{troubleshooting.map((item, index) => (
  <button key={item.title} ... aria-label={`${item.title} ...`} />
))}

// 변경 후
{troubleshooting.map((item, index) => (
  <button key={item.slug} ... aria-label={`${item.cardSummary!.title} ...`} />
))}
```

- [ ] **Step 4: 빌드 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx tsc --noEmit 2>&1 | head -30
```

project-detail 파일들에서 타입 에러 발생 예상 (다음 태스크에서 수정).

---

## Task 4: halo 마이그레이션

**Files:**
- Modify: `src/data/notes/statistic-concurrency-optimistic-lock.ts`
- Modify: `src/data/notes/reissue-infinite-request.ts`
- Modify: `src/data/notes/n-plus-one-prevention-querydsl-projection.ts`
- Modify: `src/data/notes/multi-module-shared-domain-port-pattern.ts`
- Modify: `src/data/notes/weekly-settlement-scheduler-idempotency.ts`
- Modify: `src/data/notes/multi-environment-login-token-overwrite.ts`
- Modify: `src/data/notes/alb-cors-troubleshooting.ts`
- Modify: `src/data/notes/file-upload-delete-api-separation.ts`
- Modify: `src/data/notes/querydsl-info-layer-data-flow.ts`
- Modify: `src/data/notes/domain-module-boundary-from-monolith.ts`
- Modify: `src/data/project-details/halo.ts`

- [ ] **Step 1: 10개 note에 cardSummary 추가**

각 note 파일의 마지막 `};` 직전에 `cardSummary` 필드를 추가한다. 현재 파일 구조 예시:

```ts
// 파일 끝 부분 (변경 전)
  relatedProjectSlugs: ["halo"],
};
```

```ts
// 파일 끝 부분 (변경 후)
  relatedProjectSlugs: ["halo"],
  cardSummary: {
    title: "...",
    problem: "...",
    solution: "...",
    result: "...",  // result 있는 경우만
  },
};
```

각 note의 cardSummary 내용 (project-detail에서 이전):

**`statistic-concurrency-optimistic-lock.ts`:**
```ts
cardSummary: {
  title: "통계 업데이트 동시성 충돌",
  problem: "예약 완료·리뷰 등록 시 같은 통계 row를 동시에 수정해 일관성 보장 어려움. 벌크 업데이트와 엔티티 변경이 혼재",
  solution: "@Version 낙관적 락 + 통계 갱신 서비스 분리 + @Retryable(5회, 50ms) + @Recover",
  result: "동시성 충돌 자동 복구, 재시도 초과 시 409 계열 오류 응답, 통계 책임 분리",
},
```

**`reissue-infinite-request.ts`:**
```ts
cardSummary: {
  title: "토큰 재발급 무한 요청",
  problem: "/api/reissue가 JWT 필터에서 만료 Access Token을 검사해 401 반환 → 클라이언트 재발급 반복",
  solution: "/api/reissue를 PUBLIC_URLS + JWT_FILTER_EXCLUDE_URLS 양쪽에 추가, 역할별 필터 체인에서 제거",
  result: "재발급 API가 JWT 검사 없이 ReissueService에 도달, 무한 루프 해소",
},
```

**`n-plus-one-prevention-querydsl-projection.ts`:**
```ts
cardSummary: {
  title: "N+1 쿼리 방지 역추적",
  problem: "예약·회원 목록 조회에서 N+1 우려. 연관 엔티티 5개 이상을 한 화면에 표시",
  solution: "Projections.fields() — 영속성 컨텍스트가 엔티티를 관리하지 않아 지연 로딩 트리거 자체 없음",
  result: "목록 크기와 관계없이 쿼리 수 고정, 전 모듈 동일 패턴 유지",
},
```

**`multi-module-shared-domain-port-pattern.ts`:**
```ts
cardSummary: {
  title: "멀티모듈 공유 엔티티 순환 참조",
  problem: "evaluation·payment가 Reservation 접근을 위해 reservation을 직접 의존 → 순환 참조 위험",
  solution: "shared-domain에 Reservation 엔티티 + ReservationQueryPort 분리, 구현은 reservation 모듈 제공",
  result: "모듈 간 순환 참조 제거, 구현 의존 없이 Port 인터페이스로 협력",
},
```

**`weekly-settlement-scheduler-idempotency.ts`:**
```ts
cardSummary: {
  title: "주간 정산 멱등성",
  problem: "스케줄러 재실행 또는 관리자 수동 실행 시 동일 예약이 두 번 정산될 위험",
  solution: "조회 단계에서 기존 Settlement 연결 예약 제외, 스케줄러·수동 실행이 동일 서비스 메서드 호출",
  result: "동일 날짜 범위 재실행 시 신규 생성 건수 0, 이중 지급 방지",
},
```

**`multi-environment-login-token-overwrite.ts`:**
```ts
cardSummary: {
  title: "다중 환경 토큰 충돌 (미해결)",
  problem: "고객·매니저 동시 로그인 시 단일 refresh cookie 이름이 덮여 기존 세션이 예고 없이 풀림",
  solution: "권한별 secure cookie 이름 분리 방향 결정 (마감으로 미적용)",
  result: "미해결 — 개선 방향과 cookie 이름 설계안을 문서로 보존",
},
```

**`alb-cors-troubleshooting.ts`:**
```ts
cardSummary: {
  title: "ALB 직접 연결 구조에서 CORS Preflight 실패 분석",
  problem: "nginx 없이 ALB → Spring Boot 직접 연결 구조에서 OPTIONS Preflight 요청이 Spring Security 필터체인과 상호작용하는 방식 미검증. ALB 또는 Cloudflare가 CORS 헤더를 중복 추가하면 브라우저가 헤더 두 개를 받아 오류 처리",
  solution: "Spring Security가 CORS 단일 처리 지점임을 확인. corsConfigurationSource()로 5개 origin 명시, allowedMethods 와일드카드로 OPTIONS 포함. JwtFilter는 Authorization 헤더 없는 OPTIONS를 filterChain.doFilter()로 통과시켜 CorsFilter가 먼저 단락 처리",
  result: "Preflight가 인증 체인 진입 없이 CorsFilter에서 200 반환되는 구조 검증. 역할별 FilterChain exceptionHandling 누락과 allowedOrigins 하드코딩 두 가지 구조적 개선 포인트 식별",
},
```

**`file-upload-delete-api-separation.ts`:**
```ts
cardSummary: {
  title: "파일 업로드 API 분리 — Presigned URL로 S3 트랜잭션 경계 해소",
  problem: "본문 수정 API에 파일 처리를 함께 넣으면 S3 업로드(외부 호출)가 DB 트랜잭션 범위에 포함 불가. S3 성공 후 DB 실패 시 오브젝트가 남고, 서버가 MultipartFile을 직접 수신하면 메모리 부담 발생. 4개 도메인(inquiry, admin, member, reservation)에 S3 로직 중복",
  solution: "global 모듈에 FileUploadController 단일화. POST /api/files/presigned-urls → 클라이언트가 S3 직접 PUT → POST /api/files(fileId 반환) → 도메인 API는 fileId만 참조",
  result: "서버가 파일 데이터를 수신하지 않아 메모리 부담 제거. 도메인 API에 S3 의존성 0. 파일 변경과 본문 변경 독립적으로 분리. S3 연동 코드 한 곳 집중",
},
```

**`querydsl-info-layer-data-flow.ts`:**
```ts
cardSummary: {
  title: "QueryDSL Info 중간 계층 — Repository가 RspDTO를 알지 못하게",
  problem: "QueryDSL Projections.fields() 매핑 대상을 어디에 둘지 결정 필요. Repository가 RspDTO를 직접 반환하면 HTTP 응답 형식이 영속성 계층에 스며들고, 엔티티를 반환하면 연관 필드 접근 시 N+1이 트리거됨",
  solution: "Repository → Info(service/info/ 패키지) → Service → RspDTO.fromInfo() 3계층 분리. Info는 Projections.fields() 매핑 전용 컨테이너(Jackson 어노테이션 없음). 변환 책임은 RspDTO 정적 팩토리 fromInfo()에 고정",
  result: "Repository가 RspDTO를 import하지 않아 계층 경계 유지. RspDTO 변경 시 Service와 RspDTO만 수정. 전 모듈 목록 조회 API에 동일 패턴 적용",
},
```

**`domain-module-boundary-from-monolith.ts`:**
```ts
cardSummary: {
  title: "Monolith → 8 도메인 모듈 전환 경계 설정",
  problem: "common 모듈 257개 파일이 9개 패키지로만 나뉜 사실상 Monolith 구조. 예약 Repository가 manager·serviceCategory·review를 한 쿼리에 join해 도메인 경계 없이 결합도가 계속 높아짐",
  solution: "도메인 소유권 기준으로 8개 모듈(admin, evaluation, global, inquiry, member, payment, reservation, shared-domain) 분리. build.gradle 의존성으로 경계 강제. 여러 모듈이 공유하는 Reservation 타입과 ReservationQueryPort를 shared-domain(8파일)으로 분리",
  result: "패키지 경계(런타임 발견) → 빌드 의존성 경계(컴파일 발견)로 전환. evaluation·payment → reservation 순환 참조 2건 구조적 차단. reservation 5개 의존 / inquiry 1개 의존으로 모듈별 책임 범위 가시화",
},
```

- [ ] **Step 2: halo project-detail 교체**

`src/data/project-details/halo.ts`에서:

1. `troubleshooting: [...]` 블록 전체를 아래로 교체:

```ts
troubleshootingNoteSlugs: [
  "statistic-concurrency-optimistic-lock",
  "reissue-infinite-request",
  "n-plus-one-prevention-querydsl-projection",
  "multi-module-shared-domain-port-pattern",
  "weekly-settlement-scheduler-idempotency",
  "multi-environment-login-token-overwrite",
  "alb-cors-troubleshooting",
  "file-upload-delete-api-separation",
  "querydsl-info-layer-data-flow",
  "domain-module-boundary-from-monolith",
],
```

2. `relatedNoteSlugs: [...]` 블록 전체 제거.

- [ ] **Step 3: 타입 체크**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx tsc --noEmit 2>&1 | grep "halo" | head -10
```

halo 관련 타입 에러 없으면 계속.

- [ ] **Step 4: 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add src/data/notes/statistic-concurrency-optimistic-lock.ts src/data/notes/reissue-infinite-request.ts src/data/notes/n-plus-one-prevention-querydsl-projection.ts src/data/notes/multi-module-shared-domain-port-pattern.ts src/data/notes/weekly-settlement-scheduler-idempotency.ts src/data/notes/multi-environment-login-token-overwrite.ts src/data/notes/alb-cors-troubleshooting.ts src/data/notes/file-upload-delete-api-separation.ts src/data/notes/querydsl-info-layer-data-flow.ts src/data/notes/domain-module-boundary-from-monolith.ts src/data/project-details/halo.ts && git commit -m "refactor: halo troubleshooting 카드 데이터를 note 파일로 이전"
```

---

## Task 5: ai-devops 마이그레이션

**Files:**
- Modify: `src/data/notes/async-pipeline-transition.ts`
- Modify: `src/data/notes/async-sqlalchemy-eager-loading.ts`
- Modify: `src/data/notes/rabbitmq-event-topology.ts`
- Modify: `src/data/notes/async-session-join-optimization.ts`
- Modify: `src/data/notes/celery-prefork-asyncio-nullpool.ts`
- Modify: `src/data/notes/async-test-db-isolation.ts`
- Modify: `src/data/projectNoteStubs.ts` (goorm-bank 스텁 content 완성, ai-devops 스텁은 Task 2에서 작성 완료)
- Modify: `src/data/project-details/ai-devops-orchestration-platform.ts`

ai-devops 카드 목록:
1. "DB 커넥션 풀 점유" → `async-pipeline-transition`
2. "N+1 쿼리 및 MissingGreenlet" → `async-sqlalchemy-eager-loading`
3. "FastAPI BackgroundTasks 내구성 부재" → stub `ai-devops-backgroundtasks-durability`
4. "RabbitMQ FieldTable 타입 불일치" → `rabbitmq-event-topology`
5. "ThreadPoolExecutor 포화" → stub `ai-devops-threadpool-saturation`
6. "asyncio.gather + AsyncSession 충돌" → `async-session-join-optimization`
7. "Celery prefork event loop mismatch" → `celery-prefork-asyncio-nullpool`
8. "통합 테스트 DB 상태 오염" → `async-test-db-isolation`

- [ ] **Step 1: 6개 note에 cardSummary 추가**

**`async-pipeline-transition.ts`** (카드: "DB 커넥션 풀 점유"):
```ts
cardSummary: {
  title: "DB 커넥션 풀 점유",
  problem: "POST /run이 Git clone + Job 실행 전 구간 동안 커넥션을 점유해 SELECT 쿼리 응답 시간이 수백 ms로 상승했습니다.",
  solution: "비동기화(POST /run -> 202 Accepted)로 실행 함수를 응답 경로에서 분리해 커넥션 점유 구간을 제거했습니다.",
  result: "일반 CRUD 쿼리의 대기 시간을 해소하고 비동기화 전략 선택의 계기를 만들었습니다.",
},
```

**`async-sqlalchemy-eager-loading.ts`:**
```ts
cardSummary: {
  title: "N+1 쿼리 및 MissingGreenlet",
  problem: "async SQLAlchemy에서 ORM 관계 속성에 접근하면 MissingGreenlet 에러가 발생하거나, Job 목록 조회 시 소유권 검증을 Pipeline → Project 순서로 별도 SELECT해 요청당 3회 쿼리가 실행됐습니다.",
  solution: "contains_eager로 목록 조회 JOIN을 재활용하고, find_by_id_and_owner처럼 소유권 확인과 데이터 조회를 단일 JOIN으로 통합했습니다.",
  result: "소유권 확인 + 데이터 조회 SELECT 3회를 1회로 줄이고 MissingGreenlet 에러를 제거했습니다.",
},
```

**`rabbitmq-event-topology.ts`:**
```ts
cardSummary: {
  title: "RabbitMQ FieldTable 타입 불일치",
  problem: "aio-pika queue 선언 시 arguments 딕셔너리의 값 타입이 FieldTable 명세와 불일치해 런타임 오류가 발생했습니다.",
  solution: "x-dead-letter-exchange 등 DLQ 관련 arguments를 명시적 타입으로 캐스팅했습니다.",
  result: "consumer/publisher 정상 선언 및 DLQ 연동을 완료했습니다.",
},
```

**`async-session-join-optimization.ts`:**
```ts
cardSummary: {
  title: "asyncio.gather + AsyncSession 충돌",
  problem: "GET /projects 등 여러 엔드포인트에서 독립적인 두 쿼리를 asyncio.gather로 동시 실행하자 'Method close() can't be called here' 에러가 발생하며 500이 반환됐습니다.",
  solution: "AsyncSession은 단일 커넥션을 사용해 동시 접근이 불가합니다. 병렬화 대신 COUNT를 스칼라 서브쿼리로 내장하고 소유권 검증을 JOIN으로 통합해 round-trip 자체를 줄였습니다.",
  result: "GET /projects 923ms → 642ms, POST /pipelines/{id}/jobs 1901ms → 1386ms.",
},
```

**`celery-prefork-asyncio-nullpool.ts`:**
```ts
cardSummary: {
  title: "Celery prefork event loop mismatch",
  problem: "Celery prefork worker에서 asyncio.run()을 반복 호출하자 이전 태스크가 QueuePool에 캐시한 커넥션이 닫힌 event loop에 묶여 'attached to a different loop' RuntimeError가 간헐적으로 발생하며 태스크 약 50%가 실패했습니다.",
  solution: "Celery worker 환경에서는 DB_NULL_POOL=true로 NullPool을 선택해 커넥션을 캐시하지 않도록 했습니다. API 서버는 QueuePool을 그대로 유지했습니다.",
  result: "태스크 실패율 ~50% → 0%.",
},
```

**`async-test-db-isolation.ts`:**
```ts
cardSummary: {
  title: "통합 테스트 DB 상태 오염",
  problem: "통합 테스트를 여러 개 실행하면 이전 테스트의 잔여 데이터가 다음 테스트에 영향을 줘 UNIQUE 제약 오류나 비결정적 실패가 발생했습니다.",
  solution: "test_engine fixture(session scope)에서 UUID 기반 PostgreSQL 스키마를 생성하고 search_path를 고정해 세션을 격리했습니다. db_session fixture(function scope)에서 트랜잭션을 시작하고 종료 시 롤백해 케이스를 격리했습니다.",
  result: "테스트 간 데이터 간섭 제거, CI 비결정적 실패 안정화.",
},
```

- [ ] **Step 2: ai-devops project-detail 교체**

`src/data/project-details/ai-devops-orchestration-platform.ts`에서 `troubleshooting: [...]` 블록 교체:

```ts
troubleshootingNoteSlugs: [
  "async-pipeline-transition",
  "async-sqlalchemy-eager-loading",
  "ai-devops-backgroundtasks-durability",
  "rabbitmq-event-topology",
  "ai-devops-threadpool-saturation",
  "async-session-join-optimization",
  "celery-prefork-asyncio-nullpool",
  "async-test-db-isolation",
],
```

`relatedNoteSlugs: [...]` 블록 제거.

- [ ] **Step 3: 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add src/data/notes/async-pipeline-transition.ts src/data/notes/async-sqlalchemy-eager-loading.ts src/data/notes/rabbitmq-event-topology.ts src/data/notes/async-session-join-optimization.ts src/data/notes/celery-prefork-asyncio-nullpool.ts src/data/notes/async-test-db-isolation.ts src/data/project-details/ai-devops-orchestration-platform.ts && git commit -m "refactor: ai-devops troubleshooting 카드 데이터를 note 파일로 이전"
```

---

## Task 6: the-listening-tree 마이그레이션

**Files:**
- Modify: `src/data/notes/001-google-oauth-exception-masking.ts`
- Modify: `src/data/notes/002-openai-response-direct-access.ts`
- Modify: `src/data/notes/005-social-id-unique-constraint-mismatch.ts`
- Modify: `src/data/notes/003-multirepo-ci-duplication-and-drift.ts`
- Modify: `src/data/project-details/the-listening-tree.ts`

the-listening-tree project-detail의 troubleshooting 블록을 읽어 각 note의 cardSummary를 채운다.

- [ ] **Step 1: 4개 note에 cardSummary 추가**

패턴은 Task 4와 동일. 각 note 파일의 `relatedProjectSlugs` 다음에 추가.

**`001-google-oauth-exception-masking.ts`:**
```ts
cardSummary: {
  title: "Google OAuth 예외 재래핑",
  problem: "except Exception이 내부에서 raise한 HTTPException까지 잡아 원래 오류 메시지가 변형됨. 네트워크 오류·인증 오류·내부 오류가 모두 400으로 묶임.",
  solution: "except HTTPException: raise를 가장 먼저 배치해 재래핑 차단. httpx 예외를 HTTPStatusError·TimeoutException·RequestError로 분리.",
  result: "오류 유형별 상태 코드(400/502/503/504) 분리. 클라이언트가 재시도 여부를 판단할 수 있는 명확한 응답 반환.",
},
```

**`002-openai-response-direct-access.ts`:**
```ts
cardSummary: {
  title: "OpenAI 응답 구조 직접 접근 취약성",
  problem: "response.output[0].content[0].text 직접 접근 시 빈 응답에서 IndexError 발생. 개발 중 추가한 print(user_message)가 사용자 상담 내용을 표준 출력에 노출.",
  solution: "응답 텍스트 추출 함수 분리 및 빈 응답 방어 로직 추가. print() 2개 제거. 오류 원인별 상태 코드 분기.",
  result: "빈 응답 → 503 반환으로 명확화. 사용자 메시지 표준 출력 노출 제거. API 오류·파싱 오류 구분 가능.",
},
```

**`005-social-id-unique-constraint-mismatch.ts`:**
```ts
cardSummary: {
  title: "social_id 단독 unique 제약 불일치",
  problem: "DB는 social_id 단독 unique, 핸들러는 social_id + social_provider 복합 조건으로 조회. ADR 설계 의도가 모델과 마이그레이션에 반영되지 않음.",
  solution: "UniqueConstraint('social_id', 'social_provider')로 교체. Alembic 마이그레이션 순서(인덱스 제거 → 복합 제약 생성)대로 수정.",
  result: "DB 제약과 애플리케이션 조회 로직 정합성 확보. 다중 OAuth 제공자 추가 시 같은 social_id 값 충돌 방지.",
},
```

**`003-multirepo-ci-duplication-and-drift.ts`:**
```ts
cardSummary: {
  title: "멀티레포 CI 이름 불일치",
  problem: "auth_service CI를 복붙하면서 name 필드 수정 누락. memory_service·user_service가 GitHub Actions에서 'The Tree Auth Service CI'로 표시.",
  solution: "memory_service, user_service 워크플로우 name 필드를 각 서비스명으로 수정.",
  result: "CI 대시보드에서 서비스별 워크플로우 구분 가능.",
},
```

- [ ] **Step 2: project-detail 교체**

`troubleshooting: [...]` → `troubleshootingNoteSlugs: [...]`, `relatedNoteSlugs` 제거.

```ts
troubleshootingNoteSlugs: [
  "001-google-oauth-exception-masking",
  "002-openai-response-direct-access",
  "005-social-id-unique-constraint-mismatch",
  "003-multirepo-ci-duplication-and-drift",
],
```

- [ ] **Step 3: 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add src/data/notes/001-google-oauth-exception-masking.ts src/data/notes/002-openai-response-direct-access.ts src/data/notes/005-social-id-unique-constraint-mismatch.ts src/data/notes/003-multirepo-ci-duplication-and-drift.ts src/data/project-details/the-listening-tree.ts && git commit -m "refactor: the-listening-tree troubleshooting 카드 데이터를 note 파일로 이전"
```

---

## Task 7: smart-farm 마이그레이션

**Files:**
- Modify: `src/data/notes/smart-farm-data-collector-recovery.ts`
- Modify: `src/data/notes/smart-farm-db-replication.ts`
- Modify: `src/data/notes/smart-farm-remote-device-control.ts`
- Modify: `src/data/project-details/smart-farm.ts`

- [ ] **Step 1: 3개 note에 cardSummary 추가**

**`smart-farm-data-collector-recovery.ts`:**
```ts
cardSummary: {
  title: "원격 센서 데이터 수집 안정화",
  problem: "원격지 DAS에서 수집되는 센서 값이 비정상적이거나 수집 실패가 발생할 수 있었다.",
  solution: "Data Collector를 Azure VM에서 실행하고, 비정상 데이터 수집 또는 수집 실패 시 정상화 기능을 개발했다.",
  result: "무정지 실시간 데이터 수집 환경을 목표로 안정적인 수집 구조를 구성했다.",
},
```

**`smart-farm-db-replication.ts`:**
```ts
cardSummary: {
  title: "DB 저장 및 데이터 손실 방지",
  problem: "센서 데이터가 실시간으로 누적되기 때문에 데이터 손실이 발생하면 모니터링 신뢰성이 낮아질 수 있었다.",
  solution: "Azure MySQL DB 저장 구조와 DB 이중화 전략을 적용했다.",
  result: "데이터 손실 방지를 고려한 클라우드 DB 구조를 설계했다.",
},
```

**`smart-farm-remote-device-control.ts`:**
```ts
cardSummary: {
  title: "원격 디바이스 제어 연동",
  problem: "사용자의 앱 제어 요청을 실제 원격지 디바이스 동작으로 연결해야 했다.",
  solution: "API Server가 Device Controller를 호출하고, Device Controller가 DAS와 ModbusTCP로 통신해 제어를 수행하도록 구성했다.",
  result: "사용자가 현장에 가지 않고도 디바이스를 제어할 수 있는 흐름을 구현했다.",
},
```

- [ ] **Step 2: project-detail 교체**

```ts
troubleshootingNoteSlugs: [
  "smart-farm-data-collector-recovery",
  "smart-farm-db-replication",
  "smart-farm-remote-device-control",
],
```

`relatedNoteSlugs` 제거.

- [ ] **Step 3: 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add src/data/notes/smart-farm-data-collector-recovery.ts src/data/notes/smart-farm-db-replication.ts src/data/notes/smart-farm-remote-device-control.ts src/data/project-details/smart-farm.ts && git commit -m "refactor: smart-farm troubleshooting 카드 데이터를 note 파일로 이전"
```

---

## Task 8: eks 마이그레이션

**Files:**
- Modify: `src/data/project-details/eks-efk-monitoring-practice.ts`

eks 3개 카드 모두 Task 2에서 스텁으로 생성됨.

- [ ] **Step 1: project-detail 교체**

`src/data/project-details/eks-efk-monitoring-practice.ts`에서 `troubleshooting: [...]` 블록 교체:

```ts
troubleshootingNoteSlugs: [
  "eks-worker-node-subnet-placement",
  "eks-fluentd-rbac-permission",
  "eks-lambda-kms-decrypt",
],
```

`relatedNoteSlugs: []` 제거.

- [ ] **Step 2: 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add src/data/project-details/eks-efk-monitoring-practice.ts && git commit -m "refactor: eks troubleshooting 카드 데이터를 스텁으로 이전"
```

---

## Task 9: goorm-bank 마이그레이션

**Files:**
- Modify: `src/data/projectNoteStubs.ts` (goorm-bank 스텁 3개의 problem/solution/result 내용 보완)
- Modify: `src/data/project-details/goorm-bank-problem-bank.ts`

- [ ] **Step 1: projectNoteStubs.ts의 goorm-bank 스텁 3개에 실제 content 채우기**

Task 2에서 빈 문자열로 남긴 `goorm-bank-*` 스텁 3개의 `cardSummary`를 아래 내용으로 교체:

```ts
// goorm-bank-eks-application-log-troubleshooting
cardSummary: {
  title: "EKS 애플리케이션 로그 수집 실패",
  problem: "서비스 접속 및 사용 테스트를 수행해도 기대한 애플리케이션 로그가 수집되지 않았습니다.",
  solution: "VPC Flow Logs를 활성화하고 수집된 로그 유형을 분석하면서 애플리케이션 로그와 네트워크 로그를 구분했습니다.",
  result: "로그 수집 파이프라인의 목적과 수집 대상 구분의 중요성을 학습했습니다.",
},

// goorm-bank-cloudwatch-container-insights-troubleshooting
cardSummary: {
  title: "EKS 리소스 모니터링 대시보드 혼동",
  problem: "CloudWatch Container Insights가 아닌 OpenSearch 클러스터 리소스 대시보드를 EKS 모니터링 화면으로 착각했습니다.",
  solution: "EKS 리소스 모니터링은 CloudWatch Container Insights에서 확인해야 함을 정리했습니다.",
  result: "노드 오토스케일링까지 완성하지는 못했지만 Metric Server와 HPA로 Pod 오토스케일링을 구현했습니다.",
},

// goorm-bank-jenkins-argocd-cicd-troubleshooting
cardSummary: {
  title: "Jenkins와 Argo CD 연동 인증 문제",
  problem: "Jenkins에서 ECR로 이미지를 Push하고 Manifest Repo를 업데이트하는 과정에서 인증 문제가 발생했습니다.",
  solution: "이미지 빌드, ECR Push, Manifest 업데이트, Argo CD 배포 흐름을 분리해 점검했습니다.",
  result: "최종적으로 Jenkins와 Argo CD 기반 CI/CD 파이프라인을 구축했습니다.",
},
```

- [ ] **Step 3: project-detail 교체**

```ts
troubleshootingNoteSlugs: [
  "goorm-bank-eks-application-log-troubleshooting",
  "goorm-bank-cloudwatch-container-insights-troubleshooting",
  "goorm-bank-jenkins-argocd-cicd-troubleshooting",
],
```

`relatedNoteSlugs` 제거.

- [ ] **Step 4: 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add src/data/projectNoteStubs.ts src/data/project-details/goorm-bank-problem-bank.ts && git commit -m "refactor: goorm-bank troubleshooting 카드 데이터를 스텁으로 이전"
```

---

## Task 10: arm 마이그레이션

**Files:**
- Modify: `src/data/notes/note-yolov3-tiny-layer-architecture.ts`
- Modify: `src/data/notes/note-im2col-gemm-bottleneck.ts`
- Modify: `src/data/notes/note-mixed-precision-cnn.ts`
- Modify: `src/data/notes/note-tensorflow-c-binding-arm.ts`
- Modify: `src/data/notes/note-int8-quantization-overflow.ts`
- Modify: `src/data/notes/note-conv-maxpool-integration.ts`
- Modify: `src/data/notes/note-cnn-model-extension-resnet-mobilenet.ts`
- Modify: `src/data/notes/note-cnn-lightweight-optimization.ts`
- Modify: `src/data/project-details/arm-embedded-cnn-mixed-precision.ts`

arm 카드 → note 매핑:

| 카드 제목 | note 파일 |
|---------|---------|
| NVDLA 환경에서 YOLOv3 실행 제약 | `note-yolov3-tiny-layer-architecture` |
| im2col/GEMM 파라미터 감소 시 segmentation fault | `note-im2col-gemm-bottleneck` |
| Letterbox 영역 제거 기반 계산량 감소 실험 | stub `arm-letterbox-computation-reduction` |
| 인접 픽셀 평균화 기반 GEMM 계산 축소 실패 | stub `arm-gemm-neighbor-pixel-failure` |
| Multi Weight Loading 중 segmentation fault | `note-mixed-precision-cnn` |
| TensorFlow C Binding ARM 빌드 문제 | `note-tensorflow-c-binding-arm` |
| INT8 image casting으로 인한 정보 손실 | stub `arm-int8-image-value-loss` |
| INT8 convolution overflow | `note-int8-quantization-overflow` |
| Bias Quantization 실패 | stub `arm-bias-quantization-failure` |
| Conv-Maxpool 통합 후 검출 실패 | `note-conv-maxpool-integration` |
| ResNet/MobileNet 구조 확장 문제 | `note-cnn-model-extension-resnet-mobilenet` |
| Jetson Nano 실험 시간 문제 | `note-cnn-lightweight-optimization` |

- [ ] **Step 1: 8개 note에 cardSummary 추가**

각 note 파일에 아래 패턴으로 추가 (arm project-detail의 troubleshooting 블록에서 content 복사):

**`note-yolov3-tiny-layer-architecture.ts`:**
```ts
cardSummary: {
  title: "NVDLA 환경에서 YOLOv3 실행 제약",
  problem: "NVDLA compiler는 prototxt와 caffemodel을 사용하지만 기존 YOLOv3는 cfg와 weights 파일을 사용해 바로 실행할 수 없었다.",
  solution: "AlexNet 예제를 먼저 실행하고 YOLOv3-tiny를 caffemodel/prototxt로 변환하는 방법을 조사했다.",
  result: "NVDLA 환경의 제약을 확인하고 이후 Darknet 기반 YOLOv3-tiny 코드 분석으로 방향을 전환했다.",
},
```

**`note-im2col-gemm-bottleneck.ts`:**
```ts
cardSummary: {
  title: "im2col/GEMM 파라미터 감소 시 segmentation fault",
  problem: "stride, channel, kernel size를 임의로 조정하면 layer output 크기와 memory allocation이 맞지 않아 segmentation fault가 발생했다.",
  solution: "임의 조정보다 letterbox 영역과 network input size를 기준으로 계산량을 줄이는 방향을 검토했다.",
  result: "convolution 연산 최적화는 network 구조와 memory allocation을 함께 고려해야 한다는 결론을 얻었다.",
},
```

**`note-mixed-precision-cnn.ts`:**
```ts
cardSummary: {
  title: "Multi Weight Loading 중 segmentation fault",
  problem: "FP32, FP16, INT8 weight 파일의 file pointer 위치가 서로 달라져 잘못된 weight가 로드되었다.",
  solution: "ftell과 fseek로 모든 weight 파일의 pointer를 동일한 위치로 동기화했다.",
  result: "nboxes가 계산되고 object detection 결과가 출력되었다.",
},
```

**`note-tensorflow-c-binding-arm.ts`:**
```ts
cardSummary: {
  title: "TensorFlow C Binding ARM 빌드 문제",
  problem: "TensorFlow 공식 C library가 x86 중심으로 제공되어 Jetson Nano ARM 환경에서 -ltensorflow를 찾지 못하거나 incompatible library 문제가 발생했다.",
  solution: "ARM Ubuntu 18.04 환경에서 TensorFlow C binding을 직접 빌드하고 링커 환경을 구성했다.",
  result: "C/C++에서 TensorFlow library 호출 가능성을 검증했고 quantization 모듈을 사용할 기반을 확보했다.",
},
```

**`note-int8-quantization-overflow.ts`:**
```ts
cardSummary: {
  title: "INT8 convolution overflow",
  problem: "weight와 input의 곱 및 convolution 누적 결과가 int8 범위를 초과했다.",
  solution: "int8, int16, int24 범위별 overflow 비율을 측정하고 output 저장 타입을 재검토했다.",
  result: "int16 result 저장이 int8보다 overflow를 크게 줄일 수 있음을 확인했다.",
},
```

**`note-conv-maxpool-integration.ts`:**
```ts
cardSummary: {
  title: "Conv-Maxpool 통합 후 검출 실패",
  problem: "Conv와 Maxpool을 통합 실행하면 수행시간은 감소했지만 detection이 되지 않는 문제가 남았다.",
  solution: "Conv layer의 output 크기 조정, maxpool layer skip, dequantize/activation 순서 조정 등을 검토했다.",
  result: "평균 5% 수행시간 감소는 확인했지만, 정확도 보존을 위해 후속 검증이 필요하다는 결론을 얻었다.",
},
```

**`note-cnn-model-extension-resnet-mobilenet.ts`:**
```ts
cardSummary: {
  title: "ResNet/MobileNet 구조 확장 문제",
  problem: "YOLOv3-tiny 중심 초기 프레임워크는 residual block과 inverted residual block을 지원하지 못했다.",
  solution: "ResNet residual block과 MobileNetV2 bottleneck 구조를 분석하고 framework ver.0.2 확장 방향을 설계했다.",
  result: "VGG16, VGG19, ResNet50 동작 확인 및 MobileNet 지원 수정 작업으로 확장되었다.",
},
```

**`note-cnn-lightweight-optimization.ts`:**
```ts
cardSummary: {
  title: "Jetson Nano 실험 시간 문제",
  problem: "Mini ImageNet 4만 장 실험도 Jetson Nano에서 1회 수행에 1~2일이 걸릴 정도로 오래 걸렸다.",
  solution: "전체 ImageNet 대신 Mini ImageNet을 사용하고, 데이터셋 축소 후 실험을 지속하는 방향을 선택했다.",
  result: "실험 가능성을 유지하면서 정확도, 실행시간, 메모리 사용량 비교 계획을 수립했다.",
},
```

- [ ] **Step 2: arm project-detail 교체**

`troubleshooting: [...]` → `troubleshootingNoteSlugs: [...]`, `relatedNoteSlugs` 제거.

```ts
troubleshootingNoteSlugs: [
  "note-yolov3-tiny-layer-architecture",
  "note-im2col-gemm-bottleneck",
  "arm-letterbox-computation-reduction",
  "arm-gemm-neighbor-pixel-failure",
  "note-mixed-precision-cnn",
  "note-tensorflow-c-binding-arm",
  "arm-int8-image-value-loss",
  "note-int8-quantization-overflow",
  "arm-bias-quantization-failure",
  "note-conv-maxpool-integration",
  "note-cnn-model-extension-resnet-mobilenet",
  "note-cnn-lightweight-optimization",
],
```

- [ ] **Step 3: 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add src/data/notes/note-yolov3-tiny-layer-architecture.ts src/data/notes/note-im2col-gemm-bottleneck.ts src/data/notes/note-mixed-precision-cnn.ts src/data/notes/note-tensorflow-c-binding-arm.ts src/data/notes/note-int8-quantization-overflow.ts src/data/notes/note-conv-maxpool-integration.ts src/data/notes/note-cnn-model-extension-resnet-mobilenet.ts src/data/notes/note-cnn-lightweight-optimization.ts src/data/project-details/arm-embedded-cnn-mixed-precision.ts && git commit -m "refactor: arm troubleshooting 카드 데이터를 note 파일로 이전"
```

---

## Task 11: 테스트 업데이트

**Files:**
- Modify: `src/tests/content-integrity.test.ts`

- [ ] **Step 1: 기존 relatedNoteSlugs 테스트 제거**

`content-integrity.test.ts`에서 아래 테스트 블록 삭제:

```ts
it("프로젝트 상세의 relatedNoteSlugs는 실제 기술 노트에 존재해야 한다", () => {
  ...
});
```

- [ ] **Step 2: 새 테스트 추가**

`content-integrity.test.ts` 파일 상단 import에 추가:

```ts
import { projectNoteStubs } from "@/data/projectNoteStubs";
```

기존 테스트 마지막 `});` 위에 다음 테스트 2개 추가:

```ts
it("프로젝트 상세의 troubleshootingNoteSlugs는 technicalNotes 또는 projectNoteStubs에 존재해야 한다", () => {
  const allNoteSlugs = new Set([
    ...technicalNotes.map((n) => n.slug),
    ...projectNoteStubs.map((n) => n.slug),
  ]);
  const missing = projectDetails.flatMap((project) =>
    project.troubleshootingNoteSlugs.filter((slug) => !allNoteSlugs.has(slug)),
  );
  expect(
    missing,
    `troubleshootingNoteSlugs 중 존재하지 않는 slug가 있습니다: ${missing.join(", ")}`,
  ).toEqual([]);
});

it("troubleshootingNoteSlugs에 참조된 note는 모두 cardSummary를 가져야 한다", () => {
  const allNotes = [...technicalNotes, ...projectNoteStubs];
  const missing = projectDetails.flatMap((project) =>
    project.troubleshootingNoteSlugs.filter((slug) => {
      const note = allNotes.find((n) => n.slug === slug);
      return !note?.cardSummary;
    }),
  );
  expect(
    missing,
    `troubleshootingNoteSlugs 중 cardSummary 없는 slug: ${missing.join(", ")}`,
  ).toEqual([]);
});
```

- [ ] **Step 3: 타입 체크 + 테스트 실행**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx tsc --noEmit 2>&1 | head -20
```

타입 에러 없으면:

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx vitest run src/tests/content-integrity.test.ts 2>&1
```

Expected: 전체 PASS.

- [ ] **Step 4: 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add src/tests/content-integrity.test.ts src/data/projectNoteStubs.ts src/types/note.ts src/types/project.ts src/pages/ProjectDetailPage.tsx src/components/project/ProjectClosingCardsSection.tsx && git commit -m "refactor: troubleshooting 카드 데이터 단일화 — 타입·렌더링·테스트 변경"
```

---

## Task 12: 최종 검증

- [ ] **Step 1: 전체 타입 체크**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx tsc --noEmit 2>&1
```

Expected: 오류 없음.

- [ ] **Step 2: 전체 테스트**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx vitest run 2>&1
```

Expected: 전체 PASS.

- [ ] **Step 3: ESLint**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx eslint src/data/projectNoteStubs.ts src/types/note.ts src/types/project.ts src/pages/ProjectDetailPage.tsx src/components/project/ProjectClosingCardsSection.tsx --max-warnings 0 2>&1
```

- [ ] **Step 4: 개발 서버 실행 후 halo·ai-devops·arm 상세 페이지 카드 렌더링 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npm run dev
```

브라우저에서 각 프로젝트 상세 페이지 방문:
- halo: 10개 카드 렌더링, 슬라이드 동작, note 링크 작동
- ai-devops: 8개 카드 렌더링, stub 카드 링크 없음 확인
- arm: 12개 카드 렌더링, stub 카드 링크 없음 확인
- eks: 3개 카드 렌더링, 링크 없음 확인

- [ ] **Step 5: 최종 커밋**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && git add -A && git commit -m "refactor: troubleshooting 카드 데이터 단일화 완료"
```
