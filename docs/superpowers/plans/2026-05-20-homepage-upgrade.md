# HomePage 고도화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** HomePage에 Technical Highlights 섹션과 Contact CTA 섹션을 추가해 포트폴리오 랜딩 페이지로 완성한다.

**Architecture:** `src/data/highlights.ts`를 신규 생성해 하이라이트 데이터를 관리하고, `src/pages/HomePage.tsx`에 두 섹션을 인라인으로 렌더링한다. `ButtonLink`는 내부 링크 전용이므로 외부 링크(GitHub)는 `<a>` 태그를 직접 사용한다.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Vitest

---

## 파일 구조

| 파일 | 작업 |
|------|------|
| `src/data/highlights.ts` | 신규 생성 — Highlight 타입 + 데이터 배열 |
| `src/pages/HomePage.tsx` | 수정 — Highlights 섹션, Notes "전체 보기", Contact CTA 추가 |

---

### Task 1: `src/data/highlights.ts` 생성

**Files:**
- Create: `src/data/highlights.ts`

- [ ] **Step 1: 파일 작성**

`src/data/highlights.ts`를 아래 내용으로 작성한다.

```typescript
import type { IconName } from "@/types/common";

export type Highlight = {
  icon: IconName;
  title: string;
  description: string;
};

export const highlights: Highlight[] = [
  {
    icon: "Gauge",
    title: "성능 개선",
    description:
      "DB Round-trip 감소와 쿼리 최적화를 통해 API 응답 시간을 개선합니다.",
  },
  {
    icon: "Workflow",
    title: "비동기 아키텍처",
    description:
      "동기 파이프라인을 Celery 기반 비동기 구조로 전환해 응답 지연과 커넥션 점유를 해소합니다.",
  },
  {
    icon: "Cloud",
    title: "인프라 & DevOps",
    description:
      "AWS Blue-Green 배포와 GitHub Actions CI/CD로 무중단 배포 자동화를 구현합니다.",
  },
  {
    icon: "Layers",
    title: "문제 해결",
    description:
      "ALB+CORS 트러블슈팅 등 실환경 문제를 계층별로 추적하고 근본 원인을 해결합니다.",
  },
];
```

- [ ] **Step 2: TypeScript 컴파일 확인**

```bash
npm run typecheck
```

기대 결과: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/data/highlights.ts
git commit -m "feat: 기술적 강점 하이라이트 데이터 추가"
```

---

### Task 2: `src/pages/HomePage.tsx` — Technical Highlights 섹션 추가

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: import 목록 교체**

`src/pages/HomePage.tsx` 상단의 import 블록 전체를 아래로 교체한다.

```typescript
import { Cloud, Gauge, Layers, Workflow, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/common/ButtonLink";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { NoteGrid } from "@/components/note/NoteGrid";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { TechTag } from "@/components/common/TechTag";
import { highlights } from "@/data/highlights";
import { pageHeroes } from "@/data/hero";
import { projects } from "@/data/projects";
import { technicalNotes } from "@/data/technicalNotes";
import { techStackGroups } from "@/data/techStack";
import { externalLinks } from "@/constants/externalLinks";
import { PATHS } from "@/constants/paths";
import { pageChrome } from "@/utils/pageChrome";
```

- [ ] **Step 2: 컴포넌트 바깥에 아이콘 맵 추가**

`export function HomePage()` 바로 위에 아래 코드를 추가한다.

```typescript
const highlightIcons: Record<string, LucideIcon> = {
  Gauge,
  Workflow,
  Cloud,
  Layers,
};
```

- [ ] **Step 3: Featured Projects 섹션 바로 뒤에 Technical Highlights 섹션 추가**

`</section>` (Featured Projects 섹션 닫는 태그) 바로 뒤에 아래 블록을 삽입한다.

```tsx
<section className="bg-white py-16 lg:py-20">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <SectionHeader
      eyebrow="TECHNICAL HIGHLIGHTS"
      title="기술적 강점"
      description="성능, 구조, 인프라, 문제 해결 영역에서 쌓아온 기술적 경험입니다."
    />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {highlights.map((item) => {
        const Icon = highlightIcons[item.icon];
        return (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
          >
            {Icon ? <Icon className="h-8 w-8 text-blue-600" /> : null}
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        );
      })}
    </div>
  </div>
</section>
```

- [ ] **Step 4: TypeScript 컴파일 확인**

```bash
npm run typecheck
```

기대 결과: 오류 없음

- [ ] **Step 5: 커밋**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: HomePage에 Technical Highlights 섹션 추가"
```

---

### Task 3: `src/pages/HomePage.tsx` — Notes "전체 보기" 버튼 + Contact CTA 섹션 추가

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Notes 섹션 `SectionHeader`에 action prop 추가**

현재 Notes 섹션의 `SectionHeader`는 아래와 같다.

```tsx
<SectionHeader
  eyebrow="TECHNICAL NOTES"
  title="기술 문제 해결 기록"
  description="성능, 구조, 인프라 문제를 어떻게 관찰하고 개선했는지 기록합니다."
  dark
/>
```

이를 아래로 교체한다.

```tsx
<SectionHeader
  eyebrow="TECHNICAL NOTES"
  title="기술 문제 해결 기록"
  description="성능, 구조, 인프라 문제를 어떻게 관찰하고 개선했는지 기록합니다."
  dark
  action={
    <ButtonLink href={PATHS.technicalNotes} variant="darkOutline">
      전체 보기
    </ButtonLink>
  }
/>
```

- [ ] **Step 2: Tech Stack 섹션 닫는 `</section>` 바로 뒤에 Contact CTA 섹션 추가**

```tsx
<section className="bg-hero-radial py-20 text-white lg:py-24">
  <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
      함께 만들고 싶은 프로젝트가 있으신가요?
    </h2>
    <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-300">
      새로운 아이디어부터 기술적 도전까지 빠르게 이해하고 함께 고민합니다.
    </p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <ButtonLink href={PATHS.contact}>연락하기</ButtonLink>
      <a
        href={externalLinks.github}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10"
      >
        GitHub
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: TypeScript + lint + 테스트 모두 통과 확인**

```bash
npm run typecheck && npm run lint && npm run test
```

기대 결과: 모두 통과

- [ ] **Step 4: 커밋**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: HomePage Notes 전체 보기 버튼 및 Contact CTA 섹션 추가"
```
