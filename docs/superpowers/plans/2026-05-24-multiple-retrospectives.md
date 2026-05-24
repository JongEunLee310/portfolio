# 다중 회고 표시 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI DevOps 프로젝트에 전체 프로젝트 회고와 MSA 전환 회고 두 개를 프로젝트 상세 페이지에 케로셀로 표시한다.

**Architecture:** `ProjectDetail` 타입의 `retrospective` 단일 객체를 `retrospectives` 배열로 교체한다. 기존 6개 프로젝트는 단순 배열 감싸기로 대응하고, AI DevOps 프로젝트는 전체 회고를 신규 노트와 함께 첫 항목으로 추가한다. 회고 카드는 기존 Troubleshooting/Improvements 카드와 동일한 케로셀 UX 패턴을 따른다.

**Tech Stack:** TypeScript, React, Vitest, Tailwind CSS

---

## 파일 목록

| 파일 | 유형 |
|------|------|
| `src/types/project.ts` | 타입 변경 (`retrospective` → `retrospectives`) |
| `src/constants/projectDetail.ts` | `retrospective` 섹션에 `previous`, `next`, `status` 추가 |
| `src/data/project-details/halo.ts` | 배열 감싸기 |
| `src/data/project-details/arm-embedded-cnn-mixed-precision.ts` | 배열 감싸기 |
| `src/data/project-details/eks-efk-monitoring-practice.ts` | 배열 감싸기 |
| `src/data/project-details/goorm-bank-problem-bank.ts` | 배열 감싸기 |
| `src/data/project-details/smart-farm.ts` | 배열 감싸기 |
| `src/data/project-details/the-listening-tree.ts` | 배열 감싸기 |
| `src/data/project-details/ai-devops-orchestration-platform.ts` | `retrospectives` 2개 항목으로 재작성 |
| `src/data/notes/ai-devops-project-retrospective.ts` | 신규 생성 |
| `src/data/note-details/ai-devops-project-retrospective.ts` | 신규 생성 |
| `src/data/technicalNotes.ts` | import + 배열 추가 |
| `src/data/noteDetails.ts` | import + 배열 추가 |
| `src/components/project/ProjectClosingCardsSection.tsx` | 회고 카드 케로셀로 교체 |

---

## Task 1: 타입 변경 + 상수 추가

**Files:**
- Modify: `src/types/project.ts:149-153`
- Modify: `src/constants/projectDetail.ts:92-98`

- [ ] **Step 1: `src/types/project.ts` — `retrospective` → `retrospectives` 배열로 교체**

`src/types/project.ts` 149-153번째 줄 아래 블록을 교체한다.

```typescript
// 변경 전
  retrospective: {
    learned: string[];
    improvement: string[];
    noteSlug?: string;
  };

// 변경 후
  retrospectives: Array<{
    title: string;
    learned: string[];
    improvement: string[];
    noteSlug?: string;
  }>;
```

- [ ] **Step 2: `src/constants/projectDetail.ts` — retrospective 섹션에 케로셀 라벨 추가**

```typescript
// 변경 전
    retrospective: {
      eyebrow: "RETROSPECTIVE",
      title: "회고",
      openNote: "회고 전문 읽기",
      learned: "배운 점",
      improvement: "개선 계획",
    },

// 변경 후
    retrospective: {
      eyebrow: "RETROSPECTIVE",
      title: "회고",
      openNote: "회고 전문 읽기",
      learned: "배운 점",
      improvement: "개선 계획",
      previous: "이전 회고",
      next: "다음 회고",
      status: "회고",
    },
```

- [ ] **Step 3: TypeScript 컴파일 — 타입 오류 목록 확인 (모든 project-details 파일에서 오류 발생 예상)**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm tsc --noEmit 2>&1 | grep "retrospective" | head -20
```

Expected: 7개 project-details 파일에서 `retrospective` 프로퍼티 오류 다수 출력

---

## Task 2: 기존 6개 프로젝트 파일 — 배열 감싸기

**Files:**
- Modify: `src/data/project-details/halo.ts`
- Modify: `src/data/project-details/arm-embedded-cnn-mixed-precision.ts`
- Modify: `src/data/project-details/eks-efk-monitoring-practice.ts`
- Modify: `src/data/project-details/goorm-bank-problem-bank.ts`
- Modify: `src/data/project-details/smart-farm.ts`
- Modify: `src/data/project-details/the-listening-tree.ts`

각 파일에서 `retrospective: { learned: [...], improvement: [...], noteSlug?: "..." }` 패턴을 아래와 같이 감싼다. `title`은 `"회고"`로 통일한다.

- [ ] **Step 1: `src/data/project-details/halo.ts` — 배열 감싸기**

```typescript
// 변경 전
  retrospective: {
    learned: [...],
    improvement: [...],
    noteSlug: "halo-retrospective",
  },

// 변경 후
  retrospectives: [
    {
      title: "회고",
      learned: [...],   // 기존 내용 그대로 유지
      improvement: [...],
      noteSlug: "halo-retrospective",
    },
  ],
```

- [ ] **Step 2: `src/data/project-details/arm-embedded-cnn-mixed-precision.ts` — 배열 감싸기**

```typescript
// 변경 전
  retrospective: {
    learned: [...],
    improvement: [...],
    noteSlug: "retrospective-arm-embedded-cnn-mixed-precision",
  },

// 변경 후
  retrospectives: [
    {
      title: "회고",
      learned: [...],
      improvement: [...],
      noteSlug: "retrospective-arm-embedded-cnn-mixed-precision",
    },
  ],
```

- [ ] **Step 3: `src/data/project-details/eks-efk-monitoring-practice.ts` — 배열 감싸기**

```typescript
// 변경 전
  retrospective: {
    learned: [...],
    improvement: [...],
    noteSlug: "",
  },

// 변경 후
  retrospectives: [
    {
      title: "회고",
      learned: [...],   // 기존 내용 그대로 유지
      improvement: [...],
      noteSlug: "",
    },
  ],
```

- [ ] **Step 4: `src/data/project-details/goorm-bank-problem-bank.ts` — 배열 감싸기**

```typescript
// 변경 전
  retrospective: {
    learned: [...],
    improvement: [...],
    noteSlug: "goorm-bank-retrospective",
  },

// 변경 후
  retrospectives: [
    {
      title: "회고",
      learned: [...],
      improvement: [...],
      noteSlug: "goorm-bank-retrospective",
    },
  ],
```

- [ ] **Step 5: `src/data/project-details/smart-farm.ts` — 배열 감싸기**

```typescript
// 변경 전
  retrospective: {
    learned: [...],
    improvement: [...],
    noteSlug: "smart-farm-retrospective",
  },

// 변경 후
  retrospectives: [
    {
      title: "회고",
      learned: [...],
      improvement: [...],
      noteSlug: "smart-farm-retrospective",
    },
  ],
```

- [ ] **Step 6: `src/data/project-details/the-listening-tree.ts` — 배열 감싸기**

```typescript
// 변경 전
  retrospective: {
    learned: [...],
    improvement: [...],
    noteSlug: "",
  },

// 변경 후
  retrospectives: [
    {
      title: "회고",
      learned: [...],
      improvement: [...],
      noteSlug: "",
    },
  ],
```

- [ ] **Step 7: TypeScript 컴파일 — 6개 파일 오류 해소 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm tsc --noEmit 2>&1 | grep "retrospective" | head -20
```

Expected: ai-devops 파일 오류만 남고 나머지 6개 파일 오류 해소

- [ ] **Step 8: 커밋**

```bash
git add src/types/project.ts src/constants/projectDetail.ts \
  src/data/project-details/halo.ts \
  src/data/project-details/arm-embedded-cnn-mixed-precision.ts \
  src/data/project-details/eks-efk-monitoring-practice.ts \
  src/data/project-details/goorm-bank-problem-bank.ts \
  src/data/project-details/smart-farm.ts \
  src/data/project-details/the-listening-tree.ts
git commit -m "refactor: retrospective 단일 객체를 retrospectives 배열로 교체"
```

---

## Task 3: 신규 노트 메타 파일 생성

**Files:**
- Create: `src/data/notes/ai-devops-project-retrospective.ts`

- [ ] **Step 1: 노트 메타 파일 생성**

`src/data/notes/ai-devops-retrospective.ts`를 참고해 아래와 같이 작성한다.

```typescript
import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const aiDevopsProjectRetrospective: TechnicalNoteCard = {
  slug: "ai-devops-project-retrospective",
  title: "AI DevOps 오케스트레이션 플랫폼 전체 회고 — 동기 모놀리스에서 RabbitMQ MSA까지",
  summary:
    "단순한 파이프라인 실행 API에서 출발해 세 가지 비동기 전략을 거쳐 RabbitMQ 이벤트 드리븐 MSA와 서비스별 DB 분리까지 완성한 여정의 전체 회고입니다. 각 단계의 결정 이유와 한계, 설계 문서와 실패 기록이 AI 보조 개발에서 맥락 복원 지점이 된 경험을 기록합니다.",
  category: "retrospective",
  thumbnail: publicPath("/images/notes/rabbitmq-topology.svg"),
  date: "2026.05.24",
  readingTime: "12분 읽기",
  tags: [
    { name: "MSA", category: "infra" },
    { name: "RabbitMQ", category: "infra" },
    { name: "FastAPI", category: "backend" },
    { name: "회고", category: "etc" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
```

---

## Task 4: 신규 노트 상세 파일 생성

**Files:**
- Create: `src/data/note-details/ai-devops-project-retrospective.ts`

소스: `/Users/sleepyowl/Projects/ai_devops/docs/project-retrospective.md`

- [ ] **Step 1: 소스 문서 읽기**

```bash
cat /Users/sleepyowl/Projects/ai_devops/docs/project-retrospective.md
```

- [ ] **Step 2: 노트 상세 파일 생성**

`src/data/note-details/ai-devops-retrospective.ts` 구조를 참고해 작성한다. `template: "retrospective"`.

```typescript
import type { TechnicalNoteDetail } from "@/types/note";
import { aiDevopsProjectRetrospective } from "../notes/ai-devops-project-retrospective";

export const aiDevopsProjectRetrospectiveDetail: TechnicalNoteDetail = {
  ...aiDevopsProjectRetrospective,
  template: "retrospective",
  toc: [
    { id: "overview", title: "개요", depth: 1 },
    { id: "monolith", title: "출발점 — 동기 모놀리스", depth: 1 },
    { id: "track1", title: "Track 1 · FastAPI BackgroundTasks", depth: 1 },
    { id: "track2", title: "Track 2 · Celery + Redis", depth: 1 },
    { id: "msa", title: "MSA 전환 — RabbitMQ 이벤트 드리븐", depth: 1 },
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
        "\"DevOps 역량을 보여주는 포트폴리오를 만들어보자\"는 단순한 동기에서 출발해, 세 개의 독립 서비스, RabbitMQ 이벤트 브로커, 서비스별 DB를 갖춘 MSA 구조까지 완성한 여정의 전체 회고입니다. 각 단계는 처음부터 계획된 것이 아니었습니다.",
    },
    {
      type: "heading",
      id: "monolith",
      title: "출발점 — 동기 모놀리스",
    },
    {
      type: "paragraph",
      content:
        "단일 FastAPI 애플리케이션이었습니다. 인증, Project/Pipeline/Job CRUD, Pipeline 실행, AI Review가 하나의 프로세스 안에 있었고 DB도 하나였습니다. POST /run이 Git clone + Job 실행 전 구간 동안 DB 커넥션을 점유해 SELECT 쿼리 응답 시간이 수백 ms로 상승하는 구조적 한계가 명확해졌습니다.",
    },
    {
      type: "heading",
      id: "track1",
      title: "Track 1 · FastAPI BackgroundTasks",
    },
    {
      type: "paragraph",
      content:
        "POST /run을 202 Accepted로 전환하고 실행 함수를 백그라운드로 처리했습니다. 응답 시간이 수십 초에서 수백 ms로 줄었지만, 태스크 내구성이 없어 서버 재시작 시 실행 중인 태스크가 유실됐습니다. 독립 컨테이너로 분리하는 경로도 없었습니다.",
    },
    {
      type: "heading",
      id: "track2",
      title: "Track 2 · Celery + Redis",
    },
    {
      type: "paragraph",
      content:
        "별도 worker 프로세스로 분리했습니다. Redis 기본 설정의 내구성 문제와 코드베이스 공유로 인한 진정한 서비스 경계 부재를 확인했습니다. Celery 프로토콜의 Python 전용성도 한계였습니다.",
    },
    {
      type: "heading",
      id: "msa",
      title: "MSA 전환 — RabbitMQ 이벤트 드리븐",
    },
    {
      type: "paragraph",
      content:
        "core-api / pipeline-execution-svc / ai-review-svc 세 서비스를 RabbitMQ topic exchange로 연결했습니다. durable queue, manual ack, DLQ로 메시지 내구성을 확보하고, 서비스별 PostgreSQL DB로 소유권을 물리 분리했습니다. MSA 전환 Phase 1~3 상세는 MSA 전환 회고를 참고하세요.",
    },
    {
      type: "heading",
      id: "reflection",
      title: "전체를 돌아보며",
    },
    {
      type: "list",
      items: [
        "각 단계는 다음 단계의 이유를 만들었습니다. 직접 구현하고 한계를 경험했기 때문에 다음 판계의 판단이 근거 있었습니다. 처음부터 MSA로 시작했다면 각 선택의 근거를 가질 수 없었습니다.",
        "실패한 접근이 문서화되지 않으면 반복됩니다. BackgroundTasks와 Celery를 채택하지 않은 이유가 실패 결정 005, 006으로 기록돼 있습니다. 문서가 AI 보조 개발에서 세션 간 맥락의 복원 지점이 됐습니다.",
        "설계 문서의 역할은 계획 확정이 아니라 결정 추적입니다. 구현 중에 더 나은 판단이 생기면 설계 문서도 바뀌어야 합니다.",
        "단위·통합 테스트가 통과해도 서비스 간 HTTP 계약 불일치 버그가 존재할 수 있습니다. 이벤트 스키마를 공유 패키지로 관리한 이유입니다.",
        "MSA는 서비스를 분리하는 것이 아니라 서비스 간 계약과 경계를 설계하는 것입니다. 소유권, 통신 방식, 테스트 격리 수준 모두 명시적으로 선택해야 합니다.",
      ],
    },
    {
      type: "heading",
      id: "status",
      title: "현재 상태",
    },
    {
      type: "paragraph",
      content:
        "MSA Phase 3(DB 소유권 물리 분리)까지 완료했습니다. 남은 과제: REST vs gRPC 조회 프록시 비교 실험(ADR-015), 클라우드 환경 부하 테스트 재측정, CI/CD 파이프라인 구축(ADR-017), Kubernetes 도입(ADR-016).",
    },
  ],
};
```

---

## Task 5: technicalNotes.ts + noteDetails.ts 업데이트

**Files:**
- Modify: `src/data/technicalNotes.ts`
- Modify: `src/data/noteDetails.ts`

- [ ] **Step 1: `src/data/technicalNotes.ts` — import 추가**

파일 상단 import 목록 중 `aiDevopsRetrospective` import 바로 다음 줄에 추가한다.

```typescript
import { aiDevopsProjectRetrospective } from "./notes/ai-devops-project-retrospective";
```

- [ ] **Step 2: `src/data/technicalNotes.ts` — 배열에 추가**

`technicalNotes` 배열에서 `aiDevopsRetrospective` 항목을 찾아 그 바로 앞에 추가한다 (전체 회고가 먼저 나오도록).

```typescript
export const technicalNotes: TechnicalNoteCard[] = [
  // ...
  aiDevopsProjectRetrospective,  // 전체 회고 (MSA 회고 앞에 추가)
  aiDevopsRetrospective,
  // ...
];
```

- [ ] **Step 3: `src/data/noteDetails.ts` — import 추가**

파일 상단 import 목록 중 `aiDevopsRetrospectiveDetail` import 바로 다음 줄에 추가한다.

```typescript
import { aiDevopsProjectRetrospectiveDetail } from "./note-details/ai-devops-project-retrospective";
```

- [ ] **Step 4: `src/data/noteDetails.ts` — 배열에 추가**

`noteDetails` 배열에서 `aiDevopsRetrospectiveDetail` 항목을 찾아 그 바로 앞에 추가한다.

```typescript
export const noteDetails: TechnicalNoteDetail[] = [
  // ...
  aiDevopsProjectRetrospectiveDetail,
  aiDevopsRetrospectiveDetail,
  // ...
];
```

- [ ] **Step 5: Vitest — content-integrity 테스트 실행**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm test -- content-integrity
```

Expected: 모든 slug 연결 검사 통과

- [ ] **Step 6: 커밋**

```bash
git add src/data/notes/ai-devops-project-retrospective.ts \
  src/data/note-details/ai-devops-project-retrospective.ts \
  src/data/technicalNotes.ts \
  src/data/noteDetails.ts
git commit -m "feat: AI DevOps 전체 프로젝트 회고 노트 추가"
```

---

## Task 6: AI DevOps 프로젝트 데이터 업데이트

**Files:**
- Modify: `src/data/project-details/ai-devops-orchestration-platform.ts`

- [ ] **Step 1: `retrospectives` 배열로 교체**

기존 `retrospective: { ... }` 블록을 아래로 교체한다.

```typescript
  retrospectives: [
    {
      title: "전체 프로젝트 회고",
      learned: [
        "각 단계는 다음 단계의 이유를 만들었습니다. 직접 구현하고 한계를 경험했기 때문에 다음 단계의 판단이 근거 있었습니다. 처음부터 MSA로 시작했다면 각 선택의 근거를 가질 수 없었습니다.",
        "실패한 접근이 문서화되지 않으면 반복됩니다. BackgroundTasks·Celery를 채택하지 않은 이유가 실패 결정으로 기록됐고, 이 문서가 AI 보조 개발에서 세션 간 맥락의 복원 지점이 됐습니다.",
        "설계 문서의 역할은 계획 확정이 아니라 결정 추적입니다. 구현 중에 더 나은 판단이 생기면 설계 문서도 바뀌어야 합니다.",
        "단위·통합 테스트가 통과해도 서비스 간 HTTP 계약 불일치 버그가 존재할 수 있습니다. 이벤트 스키마를 공유 패키지로 관리한 이유입니다.",
        "MSA는 서비스를 분리하는 것이 아니라 서비스 간 계약과 경계를 설계하는 것입니다.",
      ],
      improvement: [
        "REST vs gRPC 조회 프록시 비교 실험 (ADR-015 Track A/B)",
        "클라우드 환경 부하 테스트 재측정 (로컬 Docker Desktop VM 오버헤드 배제)",
        "CI/CD 파이프라인 구축 (GitLab CI, ADR-017 기준)",
        "Kubernetes 도입 (ADR-016)",
      ],
      noteSlug: "ai-devops-project-retrospective",
    },
    {
      title: "MSA 전환 회고",
      learned: [
        "MSA 전환의 목적은 단일 인스턴스 처리량 향상이 아니라 독립 배포, 독립 확장, 장애 격리입니다. 로컬 단일 인스턴스 기준에서 MSA는 모놀리스보다 느릴 수 있습니다.",
        "FastAPI BackgroundTasks는 내구성이 필요한 실행 작업에 부적합합니다. Celery + Redis는 프로세스를 분리하지만 코드베이스를 공유해 진정한 서비스 경계가 아닙니다.",
        "RabbitMQ topic exchange는 routing key 패턴 매칭으로 이벤트 타입 증가에 유연하게 대응할 수 있습니다.",
        "uv workspace 모노레포에서 공유 라이브러리로 이벤트 스키마를 관리하면 publisher/consumer 간 계약 드리프트를 컴파일 타임에 차단할 수 있습니다.",
      ],
      improvement: [
        "REST vs gRPC 조회 프록시 비교 실험 (ADR-015 Track A/B)",
        "클라우드 환경 부하 테스트 재측정 (로컬 Docker Desktop VM 오버헤드 배제)",
        "CI/CD 파이프라인 구축 (GitLab CI, ADR-017 기준)",
        "Kubernetes 도입 (ADR-016)",
      ],
      noteSlug: "ai-devops-retrospective",
    },
  ],
```

- [ ] **Step 2: `relatedNoteSlugs`에 신규 슬러그 추가**

기존 `relatedNoteSlugs` 배열 끝에 `"ai-devops-project-retrospective"`를 추가한다.

```typescript
  relatedNoteSlugs: [
    // ...기존 항목...
    "ai-devops-project-retrospective",
  ],
```

- [ ] **Step 3: TypeScript 컴파일 — 오류 없음 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm tsc --noEmit 2>&1 | head -20
```

Expected: 출력 없음 (오류 없음)

- [ ] **Step 4: Vitest — content-integrity 테스트 실행**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm test -- content-integrity
```

Expected: 모든 테스트 통과. `relatedNoteSlugs`에 추가한 `ai-devops-project-retrospective` slug가 `technicalNotes`에 존재하는지 검사 통과.

- [ ] **Step 5: 커밋**

```bash
git add src/data/project-details/ai-devops-orchestration-platform.ts
git commit -m "feat: AI DevOps 프로젝트에 전체 회고와 MSA 전환 회고 두 개 추가"
```

---

## Task 7: 컴포넌트 업데이트 — 회고 카드 케로셀

**Files:**
- Modify: `src/components/project/ProjectClosingCardsSection.tsx`

- [ ] **Step 1: `useState` 추가 — activeRetrospectiveIndex**

파일 상단 `useState` 훅 목록에 추가한다.

```typescript
const [activeRetrospectiveIndex, setActiveRetrospectiveIndex] = useState(0);
```

- [ ] **Step 2: retrospectives 변수 선언 추가**

기존 `learned`, `improvementPlans` 변수 선언 근처에 추가한다.

```typescript
const retrospectives = project.retrospectives;
const activeRetrospective = retrospectives[activeRetrospectiveIndex] ?? retrospectives[0];
```

- [ ] **Step 3: 기존 learned/improvementPlans 변수 제거**

아래 두 줄을 제거한다 (더 이상 사용하지 않음).

```typescript
// 제거 대상
const learned = project.retrospective.learned.filter(hasText);
const improvementPlans = project.retrospective.improvement.filter(hasText);
```

- [ ] **Step 4: 케로셀 네비게이션 함수 추가**

기존 `showPreviousTroubleshooting`, `showNextTroubleshooting` 함수 아래에 추가한다.

```typescript
function showPreviousRetrospective() {
  setActiveRetrospectiveIndex((current) =>
    current === 0 ? retrospectives.length - 1 : current - 1,
  );
}

function showNextRetrospective() {
  setActiveRetrospectiveIndex((current) =>
    current === retrospectives.length - 1 ? 0 : current + 1,
  );
}
```

- [ ] **Step 5: 회고 카드 JSX 교체**

기존 `{learned.length || improvementPlans.length ? ( ... ) : null}` 블록 전체를 아래로 교체한다.

```tsx
{retrospectives.length > 0 ? (
  <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card">
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]">
          {PROJECT_DETAIL_LABELS.sections.retrospective.eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-page-text)]">
          {PROJECT_DETAIL_LABELS.sections.retrospective.title}
        </h2>
      </div>
      {retrospectives.length > 1 ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={showPreviousRetrospective}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            aria-label={PROJECT_DETAIL_LABELS.sections.retrospective.previous}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNextRetrospective}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            aria-label={PROJECT_DETAIL_LABELS.sections.retrospective.next}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
    <RetrospectiveSlide item={activeRetrospective} />
    {retrospectives.length > 1 ? (
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold text-[var(--color-muted-text)]" aria-live="polite">
          {PROJECT_DETAIL_LABELS.sections.retrospective.status}{" "}
          {activeRetrospectiveIndex + 1} / {retrospectives.length}
        </p>
        <div className="flex gap-1.5">
          {retrospectives.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveRetrospectiveIndex(index)}
              className={[
                "h-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                index === activeRetrospectiveIndex
                  ? "w-6 bg-[var(--color-accent)]"
                  : "w-2.5 bg-[var(--color-border)] hover:bg-[var(--color-accent)]",
              ].join(" ")}
              aria-label={item.title}
              aria-current={index === activeRetrospectiveIndex}
            />
          ))}
        </div>
      </div>
    ) : null}
  </article>
) : null}
```

- [ ] **Step 6: `RetrospectiveSlide` 컴포넌트 추가**

파일 맨 아래 `TroubleshootingSlide` 함수 아래에 추가한다.

```tsx
type RetrospectiveSlideProps = {
  item: ProjectDetail["retrospectives"][number];
};

function RetrospectiveSlide({ item }: RetrospectiveSlideProps) {
  return (
    <div className="h-[400px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
      <h3 className="text-base font-bold text-[var(--color-page-text)]">{item.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[var(--color-muted-text)]">
        {item.learned[0]}
      </p>
      {item.noteSlug ? (
        <div className="mt-6 flex justify-end">
          <Link
            to={PATHS.technicalNoteDetail(item.noteSlug)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-4 py-2 text-sm font-bold text-[var(--color-accent)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {PROJECT_DETAIL_LABELS.sections.retrospective.openNote}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 7: TypeScript 컴파일 — 오류 없음 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm tsc --noEmit 2>&1 | head -20
```

Expected: 출력 없음

- [ ] **Step 8: 전체 테스트 실행**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm test
```

Expected: 모든 테스트 통과

- [ ] **Step 9: 커밋**

```bash
git add src/components/project/ProjectClosingCardsSection.tsx
git commit -m "feat: 회고 카드 케로셀 패턴으로 교체 — 다중 회고 지원"
```

---

## Task 8: 최종 검증

- [ ] **Step 1: 전체 테스트 통과 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm test
```

Expected: 모든 테스트 통과

- [ ] **Step 2: TypeScript 최종 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && pnpm tsc --noEmit
```

Expected: 출력 없음 (오류 없음)
