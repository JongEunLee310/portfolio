# AboutTimeline 중앙 센터라인 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `AboutTimeline` 컴포넌트를 가운데 수직선 기준으로 왼쪽(경력·교육·부트캠프)과 오른쪽(프로젝트)에 항목을 교차 배치하는 레이아웃으로 재작성한다.

**Architecture:** 타임라인 데이터를 연도별로 그룹화한 뒤, 각 연도 그룹 내에서 타입별로 왼쪽/오른쪽 목록을 분리하고 zip 방식으로 행을 구성한다. 그룹화·행 구성 로직은 순수 함수로 분리해 테스트한다. 렌더링은 `lg` 이상에서 2컬럼, 미만에서 단일 컬럼으로 처리한다.

**Tech Stack:** React, TypeScript, Tailwind CSS v3, Vitest

---

## 파일 구조

| 파일 | 역할 |
|---|---|
| `src/components/about/AboutTimeline.tsx` | 컴포넌트 전면 재작성 |
| `src/tests/about-timeline.test.ts` | 그룹화 로직 단위 테스트 (신규) |

---

### Task 1: 그룹화 로직 단위 테스트 작성 (TDD)

**Files:**
- Create: `src/tests/about-timeline.test.ts`

- [ ] **Step 1: 테스트 파일 생성**

```typescript
// src/tests/about-timeline.test.ts
import { describe, expect, it } from "vitest";
import type { TimelineItem } from "@/types/about";

// 컴포넌트에서 export 될 함수들 (아직 없음 — 이 단계에서 실패해야 함)
import { getStartYear, buildYearGroups } from "@/components/about/AboutTimeline";

const makeItem = (
  type: TimelineItem["type"],
  period: string,
  title: string,
): TimelineItem => ({ type, period, title, organization: "org", description: "desc" });

describe("getStartYear", () => {
  it("period 앞 4자리를 연도로 반환한다", () => {
    expect(getStartYear("2026.04 ~ 진행 중")).toBe(2026);
    expect(getStartYear("2025.05 ~ 2025.07")).toBe(2025);
    expect(getStartYear("2017.02 ~ 2023.02")).toBe(2017);
  });
});

describe("buildYearGroups", () => {
  it("최신 연도가 먼저 오도록 내림차순 정렬한다", () => {
    const items = [
      makeItem("education", "2017.02 ~ 2023.02", "대학교"),
      makeItem("project", "2026.04 ~ 진행 중", "AI Pipeline"),
    ];
    const groups = buildYearGroups(items);
    expect(groups[0].year).toBe(2026);
    expect(groups[1].year).toBe(2017);
  });

  it("type === 'project' 항목은 right에, 나머지는 left에 배치한다", () => {
    const items = [
      makeItem("project", "2025.11 ~ 2025.01", "ChatGPT"),
      makeItem("bootcamp", "2025.04 ~ 2025.07", "Kernel360"),
      makeItem("career", "2025.05 ~ 2025.07", "가사도우미"),
    ];
    const groups = buildYearGroups(items);
    expect(groups[0].year).toBe(2025);
    const { rows } = groups[0];
    const rightItems = rows.map((r) => r.right).filter(Boolean);
    const leftItems = rows.map((r) => r.left).filter(Boolean);
    expect(rightItems).toHaveLength(1);
    expect(rightItems[0]?.title).toBe("ChatGPT");
    expect(leftItems).toHaveLength(2);
  });

  it("한쪽이 더 많으면 나머지 행은 null로 채운다", () => {
    const items = [
      makeItem("bootcamp", "2025.04 ~ 2025.07", "Kernel360"),
      makeItem("career", "2025.05 ~ 2025.07", "가사도우미"),
    ];
    const groups = buildYearGroups(items);
    expect(groups[0].rows).toHaveLength(2);
    expect(groups[0].rows[0].right).toBeNull();
    expect(groups[0].rows[1].right).toBeNull();
  });
});
```

- [ ] **Step 2: 테스트 실행 — 실패 확인**

```bash
npx vitest run src/tests/about-timeline.test.ts
```

예상: `Cannot find module '@/components/about/AboutTimeline'` 오류로 실패

---

### Task 2: 컴포넌트 재작성

**Files:**
- Modify: `src/components/about/AboutTimeline.tsx`

- [ ] **Step 3: 컴포넌트 전면 재작성**

```typescript
// src/components/about/AboutTimeline.tsx
import { themeSurface } from "@/styles/classNames";
import type { TimelineItem } from "@/types/about";

type AboutTimelineProps = {
  items: TimelineItem[];
};

type TimelineRow = {
  left: TimelineItem | null;
  right: TimelineItem | null;
};

type YearGroup = {
  year: number;
  rows: TimelineRow[];
};

export function getStartYear(period: string): number {
  return parseInt(period.slice(0, 4), 10);
}

export function buildYearGroups(items: TimelineItem[]): YearGroup[] {
  const yearMap = new Map<number, { left: TimelineItem[]; right: TimelineItem[] }>();

  for (const item of items) {
    const year = getStartYear(item.period);
    if (!yearMap.has(year)) {
      yearMap.set(year, { left: [], right: [] });
    }
    const group = yearMap.get(year)!;
    if (item.type === "project") {
      group.right.push(item);
    } else {
      group.left.push(item);
    }
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, { left, right }]) => {
      const len = Math.max(left.length, right.length);
      const rows: TimelineRow[] = Array.from({ length: len }, (_, i) => ({
        left: left[i] ?? null,
        right: right[i] ?? null,
      }));
      return { year, rows };
    });
}

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <article className={`${themeSurface.card} p-5`}>
      <div className="flex flex-wrap items-center gap-2">
        {item.badge ? (
          <span className="badge badge-light rounded-full px-2.5 py-0.5 text-xs font-medium">
            {item.badge}
          </span>
        ) : null}
        <span className="text-xs text-[var(--color-muted-text)]">{item.period}</span>
      </div>
      <h4 className="mt-1 text-sm font-semibold text-[var(--color-page-text)]">{item.title}</h4>
      <p className="text-xs text-[var(--color-muted-text)]">{item.organization}</p>
      <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted-text)]">{item.description}</p>
    </article>
  );
}

function MobileTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 h-full w-0.5 bg-[var(--color-border)]" />
      {items.map((item) => (
        <div key={`${item.type}-${item.title}`} className="relative mb-8 last:mb-0">
          <div className="absolute -left-[1.375rem] top-1.5 h-3 w-3 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-page-bg)]" />
          <TimelineCard item={item} />
        </div>
      ))}
    </div>
  );
}

function DesktopTimeline({ groups }: { groups: YearGroup[] }) {
  return (
    <div className="relative">
      {/* 중앙 수직선 */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-[var(--color-border)]" />
      {groups.map(({ year, rows }) => (
        <div key={year}>
          {/* 연도 마커 */}
          <div className="relative z-10 flex justify-center py-3">
            <span className="rounded-full bg-[var(--color-accent)] px-3 py-0.5 text-xs font-bold text-white">
              {year}
            </span>
          </div>
          {rows.map((row, i) => (
            <div key={i} className="relative mb-6 grid grid-cols-[1fr_2.5rem_1fr] items-start last:mb-0">
              {/* 왼쪽 */}
              <div className="pr-6">
                {row.left ? <TimelineCard item={row.left} /> : null}
              </div>
              {/* 가운데 dot */}
              <div className="flex justify-center pt-4">
                <div className="h-3 w-3 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-page-bg)]" />
              </div>
              {/* 오른쪽 */}
              <div className="pl-6">
                {row.right ? <TimelineCard item={row.right} /> : null}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function AboutTimeline({ items }: AboutTimelineProps) {
  const groups = buildYearGroups(items);
  return (
    <>
      {/* 모바일 */}
      <div className="lg:hidden">
        <MobileTimeline items={items} />
      </div>
      {/* 데스크탑 */}
      <div className="hidden lg:block">
        <DesktopTimeline groups={groups} />
      </div>
    </>
  );
}
```

- [ ] **Step 4: 테스트 실행 — 통과 확인**

```bash
npx vitest run src/tests/about-timeline.test.ts
```

예상: 5개 테스트 모두 PASS

- [ ] **Step 5: 전체 테스트 suite 실행**

```bash
npm test
```

예상: 기존 테스트 모두 PASS (타입, slug, 이미지 경로 등 영향 없음)

- [ ] **Step 6: 커밋**

```bash
git add src/components/about/AboutTimeline.tsx src/tests/about-timeline.test.ts
git commit -m "feat: 타임라인 중앙 센터라인 레이아웃으로 재설계"
```

---

### Task 3: 시각 검증

- [ ] **Step 7: 개발 서버 실행 후 About 페이지 확인**

```bash
npm run dev
```

`http://localhost:5173/about` 의 경력 및 교육 섹션에서 확인:

- [ ] 가운데 수직선이 표시된다
- [ ] 연도 마커(2026, 2025, 2022, 2021, 2017)가 중앙에 표시된다
- [ ] 왼쪽에 경력·교육·부트캠프 카드가 오른쪽 정렬로 배치된다
- [ ] 오른쪽에 프로젝트 카드가 왼쪽 정렬로 배치된다
- [ ] 한쪽에만 항목이 있는 행은 반대편이 비어있다
- [ ] 브라우저 폭을 `lg`(1024px) 미만으로 줄이면 단일 컬럼으로 전환된다
- [ ] 라이트/다크 모드 전환 시 색상이 올바르게 적용된다
