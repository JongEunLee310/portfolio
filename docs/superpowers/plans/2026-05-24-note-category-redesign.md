# 기술 노트 문서 유형 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** NoteCategory를 5개 문서 유형(troubleshooting, architecture, performance, concept, retrospective)으로 통일하고, 48개 노트를 재분류한다.

**Architecture:** NoteCategory = 5개 문서 유형, NoteFilterValue = "all" | NoteCategory로 통일. matchesNoteFilter는 키워드 기반 매칭에서 note.category 직접 비교로 단순화. 실제 category 값이 바뀌는 노트는 48개 중 14개.

**Tech Stack:** TypeScript, Vite, Vitest

---

## 파일 변경 범위

| 파일 | 변경 내용 |
|---|---|
| `src/types/note.ts` | NoteCategory, NoteFilterValue 타입 교체 |
| `src/utils/noteFilters.ts` | 키워드 매칭 → note.category 직접 비교 |
| `src/data/filters.ts` | noteCategoryFilters 5개로 교체 |
| `src/data/notes/ai-devops-retrospective.ts` | architecture → retrospective |
| `src/data/notes/004-stateless-prompt-context-loss.ts` | architecture → concept |
| `src/data/notes/swagger-api-documentation.ts` | architecture → concept |
| `src/data/notes/celery-prefork-asyncio-nullpool.ts` | architecture → troubleshooting |
| `src/data/notes/005-social-id-unique-constraint-mismatch.ts` | database → troubleshooting |
| `src/data/notes/async-sqlalchemy-eager-loading.ts` | database → troubleshooting |
| `src/data/notes/smart-farm-db-replication.ts` | database → architecture |
| `src/data/notes/querydsl-projection-optimization.ts` | database → performance |
| `src/data/notes/rabbitmq-event-topology.ts` | messaging → architecture |
| `src/data/notes/metric-cardinality-troubleshooting.ts` | observability → troubleshooting |
| `src/data/notes/eks-observability-cloudwatch-opensearch.ts` | observability → architecture |
| `src/data/notes/fluentbit-cloudwatch-log-pipeline.ts` | observability → architecture |
| `src/data/notes/note-arm-fp16-compiler.ts` | performance → troubleshooting |
| `src/data/notes/springboot-jwt-social-login.ts` | security → concept |

---

## Task 1: 타입 시스템 변경

**Files:**
- Modify: `src/types/note.ts`

- [ ] **Step 1: NoteCategory와 NoteFilterValue 타입 교체**

`src/types/note.ts`의 기존 타입을 아래로 교체한다.

```ts
// Before
export type NoteCategory =
  | "performance"
  | "architecture"
  | "async"
  | "database"
  | "aws"
  | "observability"
  | "messaging"
  | "troubleshooting"
  | "security";

export type NoteFilterValue =
  | "all"
  | "performance"
  | "database"
  | "async"
  | "devops"
  | "architecture"
  | "troubleshooting";

// After
export type NoteCategory =
  | "troubleshooting"
  | "architecture"
  | "performance"
  | "concept"
  | "retrospective";

export type NoteFilterValue = "all" | NoteCategory;
```

- [ ] **Step 2: 타입 오류 확인 (이 시점에서 오류 다수 예상 — 정상)**

```bash
npm run typecheck 2>&1 | head -30
```

타입 오류가 나오면 정상. Task 4까지 완료한 뒤 오류가 사라진다.

- [ ] **Step 3: 커밋**

```bash
git add src/types/note.ts
git commit -m "refactor: NoteCategory를 5개 문서 유형으로 교체, NoteFilterValue 통합"
```

---

## Task 2: 필터 함수 단순화

**Files:**
- Modify: `src/utils/noteFilters.ts`

- [ ] **Step 1: noteFilters.ts 전체 교체**

기존 키워드 기반 매칭을 note.category 직접 비교로 교체한다. NoteCategory와 NoteFilterValue가 통일됐으므로 별도 매핑이 필요 없다.

```ts
import type { NoteFilterValue, TechnicalNoteCard } from "@/types/note";

export function matchesNoteFilter(
  note: TechnicalNoteCard,
  selectedFilter: NoteFilterValue,
) {
  if (selectedFilter === "all") return true;
  return note.category === selectedFilter;
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/utils/noteFilters.ts
git commit -m "refactor: noteFilters 키워드 매칭을 category 직접 비교로 교체"
```

---

## Task 3: 필터 데이터 변경

**Files:**
- Modify: `src/data/filters.ts`

- [ ] **Step 1: noteCategoryFilters를 5개 유형으로 교체**

`src/data/filters.ts`에서 `noteCategoryFilters` 배열을 아래로 교체한다.

```ts
export const noteCategoryFilters = [
  { label: "All", value: "all" },
  { label: "트러블슈팅", value: "troubleshooting" },
  { label: "아키텍처 분석", value: "architecture" },
  { label: "성능 분석", value: "performance" },
  { label: "개념 정리", value: "concept" },
  { label: "회고", value: "retrospective" },
] as const satisfies readonly {
  label: string;
  value: NoteFilterValue;
}[];
```

- [ ] **Step 2: 커밋**

```bash
git add src/data/filters.ts
git commit -m "feat: 기술 노트 필터를 5개 문서 유형으로 교체"
```

---

## Task 4: 노트 파일 category 변경

**Files:**
- Modify: `src/data/notes/` 아래 14개 파일

각 파일에서 최상위 `category:` 필드만 변경한다. tags 배열 안의 category는 TechTag 전용이므로 건드리지 않는다.

- [ ] **Step 1: architecture → retrospective**

`src/data/notes/ai-devops-retrospective.ts`
```
category: "architecture"  →  category: "retrospective"
```

- [ ] **Step 2: architecture → concept (2개)**

`src/data/notes/004-stateless-prompt-context-loss.ts`
```
category: "architecture"  →  category: "concept"
```

`src/data/notes/swagger-api-documentation.ts`
```
category: "architecture"  →  category: "concept"
```

- [ ] **Step 3: architecture → troubleshooting**

`src/data/notes/celery-prefork-asyncio-nullpool.ts`
```
category: "architecture"  →  category: "troubleshooting"
```

- [ ] **Step 4: database → troubleshooting (2개)**

`src/data/notes/005-social-id-unique-constraint-mismatch.ts`
```
category: "database"  →  category: "troubleshooting"
```

`src/data/notes/async-sqlalchemy-eager-loading.ts`
```
category: "database"  →  category: "troubleshooting"
```

- [ ] **Step 5: database → architecture**

`src/data/notes/smart-farm-db-replication.ts`
```
category: "database"  →  category: "architecture"
```

- [ ] **Step 6: database → performance**

`src/data/notes/querydsl-projection-optimization.ts`
```
category: "database"  →  category: "performance"
```

- [ ] **Step 7: messaging → architecture**

`src/data/notes/rabbitmq-event-topology.ts`
```
category: "messaging"  →  category: "architecture"
```

- [ ] **Step 8: observability → troubleshooting**

`src/data/notes/metric-cardinality-troubleshooting.ts`
```
category: "observability"  →  category: "troubleshooting"
```

- [ ] **Step 9: observability → architecture (2개)**

`src/data/notes/eks-observability-cloudwatch-opensearch.ts`
```
category: "observability"  →  category: "architecture"
```

`src/data/notes/fluentbit-cloudwatch-log-pipeline.ts`
```
category: "observability"  →  category: "architecture"
```

- [ ] **Step 10: performance → troubleshooting**

`src/data/notes/note-arm-fp16-compiler.ts`
```
category: "performance"  →  category: "troubleshooting"
```

- [ ] **Step 11: security → concept**

`src/data/notes/springboot-jwt-social-login.ts`
```
category: "security"  →  category: "concept"
```

- [ ] **Step 12: 커밋**

```bash
git add src/data/notes/
git commit -m "feat: 기술 노트 14개 category를 새 문서 유형으로 재분류"
```

---

## Task 5: 검증

- [ ] **Step 1: 타입체크**

```bash
npm run typecheck
```

Expected: 오류 없음

- [ ] **Step 2: 린트**

```bash
npm run lint
```

Expected: 오류 없음

- [ ] **Step 3: 테스트**

```bash
npx vitest run
```

Expected: 전체 통과

- [ ] **Step 4: 커밋 (변경 없음이면 생략)**

타입체크, 린트, 테스트 모두 통과한 경우 별도 커밋 불필요.
