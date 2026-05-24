# Project Category Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ProjectCategory를 기술 도메인 혼합 분류에서 `"service" | "infra" | "research"` 대분류로 교체하고, `category` 필드를 배열에서 단일값으로 변경한다.

**Architecture:** 타입 변경 → 데이터 변경 → 컴포넌트/페이지 로직 변경 순으로 진행한다. TypeScript 컴파일 오류를 가이드로 삼아 변경 범위를 추적한다.

**Tech Stack:** TypeScript, React, Vite

---

## 수정 파일 목록

| 파일 | 변경 내용 |
|---|---|
| `src/types/project.ts` | ProjectCategory 값 교체, category 필드 배열 → 단일값 |
| `src/data/filters.ts` | projectCategoryFilters 라벨·값 교체 |
| `src/data/projects/ai-devops-orchestration-platform.ts` | category: "service" |
| `src/data/projects/halo.ts` | category: "service" |
| `src/data/projects/the-listening-tree.ts` | category: "service" |
| `src/data/projects/smart-farm.ts` | category: "service" |
| `src/data/projects/goorm-bank-problem-bank.ts` | category: "infra" |
| `src/data/projects/eks-efk-monitoring-practice.ts` | category: "infra" |
| `src/data/projects/arm-embedded-cnn-mixed-precision.ts` | category: "research" |
| `src/pages/ProjectsPage.tsx` | 필터 비교 로직 변경 |
| `src/components/project/ProjectCard.tsx` | category 렌더링 단일값으로 |
| `src/components/project/HomeFeaturedProjects.tsx` | category 렌더링 단일값으로 |
| `src/components/project/ProjectDetailHero.tsx` | category.map() → 단일 Badge |
| `src/components/project/ProjectDetailSections.tsx` | categories prop 타입 변경 |
| `src/pages/ProjectDetailPage.tsx` | categories 전달 방식 변경 |

---

### Task 1: 타입 정의 변경

**Files:**
- Modify: `src/types/project.ts`

- [ ] **Step 1: ProjectCategory와 category 필드 변경**

`src/types/project.ts` 3번 줄과 37번 줄을 수정한다.

```ts
// 3번 줄
export type ProjectCategory = "service" | "infra" | "research";

// 37번 줄 (ProjectCard 내)
category: ProjectCategory;
```

- [ ] **Step 2: TypeScript 타입 오류 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx tsc --noEmit 2>&1 | head -50
```

category 관련 오류가 여러 파일에서 나타나야 정상이다. 이후 Task들에서 순서대로 해소한다.

---

### Task 2: 필터 데이터 변경

**Files:**
- Modify: `src/data/filters.ts`

- [ ] **Step 1: projectCategoryFilters 교체**

`src/data/filters.ts`의 `projectCategoryFilters`를 아래로 교체한다.

```ts
export const projectCategoryFilters = [
  { label: "전체", value: "all" },
  { label: "서비스", value: "service" },
  { label: "인프라", value: "infra" },
  { label: "연구", value: "research" },
] as const satisfies readonly {
  label: string;
  value: ProjectFilterValue;
}[];
```

---

### Task 3: 프로젝트 데이터 7개 파일 업데이트

**Files:**
- Modify: `src/data/projects/` 하위 7개 파일

- [ ] **Step 1: ai-devops-orchestration-platform.ts**

```ts
category: "service",
```

- [ ] **Step 2: halo.ts**

```ts
category: "service",
```

- [ ] **Step 3: the-listening-tree.ts**

```ts
category: "service",
```

- [ ] **Step 4: smart-farm.ts**

```ts
category: "service",
```

- [ ] **Step 5: goorm-bank-problem-bank.ts**

```ts
category: "infra",
```

- [ ] **Step 6: eks-efk-monitoring-practice.ts**

```ts
category: "infra",
```

- [ ] **Step 7: arm-embedded-cnn-mixed-precision.ts**

```ts
category: "research",
```

- [ ] **Step 8: 커밋**

```bash
git add src/types/project.ts src/data/filters.ts src/data/projects/
git commit -m "refactor: ProjectCategory를 service/infra/research 대분류로 교체"
```

---

### Task 4: 페이지 필터 로직 변경

**Files:**
- Modify: `src/pages/ProjectsPage.tsx`

- [ ] **Step 1: matchesProjectFilter 함수 수정 (45~48번 줄)**

배열 `.includes()` 비교와 `project.type === filters.category` fallback 제거.

```ts
const matchesCategory =
  filters.category === "all" ||
  project.category === filters.category;
```

- [ ] **Step 2: countByCategory 함수 수정 (132~136번 줄)**

```ts
acc[option.value] =
  option.value === "all"
    ? projects.length
    : projects.filter(
        (project) => project.category === option.value,
      ).length;
```

---

### Task 5: 컴포넌트 렌더링 변경

**Files:**
- Modify: `src/components/project/ProjectCard.tsx`
- Modify: `src/components/project/HomeFeaturedProjects.tsx`
- Modify: `src/components/project/ProjectDetailHero.tsx`
- Modify: `src/components/project/ProjectDetailSections.tsx`
- Modify: `src/pages/ProjectDetailPage.tsx`

- [ ] **Step 1: ProjectCard.tsx — 32번 줄**

```tsx
{project.subtitle ?? project.category}
```

- [ ] **Step 2: HomeFeaturedProjects.tsx — 14번 줄**

```ts
function getProjectLabel(project: ProjectCard) {
  return project.subtitle ?? project.category;
}
```

- [ ] **Step 3: ProjectDetailHero.tsx — 71~77번 줄**

```tsx
<div className="mt-7 flex flex-wrap gap-2">
  <Badge variant={isLight ? "light" : "dark"}>
    {project.category}
  </Badge>
</div>
```

- [ ] **Step 4: ProjectDetailSections.tsx — categories prop 타입 변경**

```ts
type ProjectOverviewSectionProps = {
  overview: string;
  categories: ProjectCategory;
  techStack: TechTagType[];
};

export function ProjectOverviewSection({
  overview,
  categories,
  techStack,
}: ProjectOverviewSectionProps) {
  const pills = [
    categories,
    ...techStack.slice(0, 4).map((tag) => tag.name),
  ].slice(0, 6);
```

- [ ] **Step 5: ProjectDetailPage.tsx — 131번 줄**

```tsx
categories={project.category}
```

(타입이 이미 단일값으로 바뀌었으므로 코드 변경 없이 타입 오류만 해소됨)

- [ ] **Step 6: TypeScript 최종 확인**

```bash
cd /Users/sleepyowl/Projects/portpolio_site && npx tsc --noEmit 2>&1
```

오류 없이 통과해야 한다.

- [ ] **Step 7: 커밋**

```bash
git add src/pages/ProjectsPage.tsx src/components/project/
git commit -m "refactor: category 배열 → 단일값으로 변경, 렌더링·필터 로직 업데이트"
```
