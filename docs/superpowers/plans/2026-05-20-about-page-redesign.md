# About Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AboutPage를 6개 섹션(Hero / Profile / 역할 카드 / 타임라인 / 기술 스택 / 일하는 방식+지표 2열)으로 구조화해 포트폴리오 자기소개 페이지를 완성한다.

**Architecture:** 데이터 모델 정비(`src/types/about.ts` → `src/data/about.ts`) 후 신규 컴포넌트 5개를 순서대로 만들고, 마지막에 `src/pages/AboutPage.tsx`에서 조립한다. 기술 스택은 기존 `HomeTechStack` 컴포넌트를 재사용하며, 페이지에서 `techStackGroups`를 import해 props로 주입한다. 모든 import 방향은 허용 경계 안에 있다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, lucide-react, `src/styles/classNames.ts`

---

## 파일 맵

| 상태 | 파일 | 역할 |
|------|------|------|
| Modify | `src/types/about.ts` | `ProfileLink`, `Role` 추가; `Strength → Role` rename; `skills` 제거; `experience`·`timeline` 유지 |
| Modify | `src/data/about.ts` | roles × 4, links × 4, timeline 항목, experience 추가 |
| Create | `src/components/about/AboutArchDiagram.tsx` | Hero visualSlot — HTML/CSS CloudFront/API Gateway 서비스 분기 다이어그램 |
| Create | `src/components/about/AboutProfile.tsx` | Profile 섹션 — 좌: 사진, 우: 소개 + info row |
| Create | `src/components/about/AboutRoleCard.tsx` | What I Build 그리드 단위 카드 |
| Create | `src/components/about/AboutTimeline.tsx` | Career & Education 수직 타임라인 |
| Create | `src/components/about/AboutWorkStyle.tsx` | 여는따옴표+quote 아래 수직 체크리스트 (제목 없음, 페이지 SectionHeader 사용) |
| Create | `src/components/about/AboutGrowthMetrics.tsx` | metrics 2×2 그리드 (제목 없음, 페이지 SectionHeader 사용) |
| Modify | `src/pages/AboutPage.tsx` | 6개 섹션 조립 |

---

## Task 1: 데이터 모델 정비 및 콘텐츠 채우기

**Files:**
- Modify: `src/types/about.ts`
- Modify: `src/data/about.ts`

- [ ] **Step 1: `src/types/about.ts` 수정**

  추가할 타입:
  ```typescript
  export type ProfileLink = {
    label: string;
    href: string;
    icon: "Mail" | "Github" | "ExternalLink";
  };

  export type Role = {
    title: string;
    description: string;
    icon: IconName;
    tags?: string[];
  };
  ```

  `ProfileInfo` 변경:
  - `links: ProfileLink[]` 추가
  - `experience: string` 유지 (info row 표시용)

  `AboutData` 변경:
  - `strengths: Strength[]` → `roles: Role[]`
  - `skills` 필드 제거

  `Strength` 타입 제거. `TimelineItem`, `timeline` 필드는 유지.

- [ ] **Step 2: 타입 오류 확인**

  Run: `pnpm tsc --noEmit`

  Expected: `src/data/about.ts`가 구 필드(`skills`, `strengths`)를 참조하는 오류 출력

- [ ] **Step 3: `src/data/about.ts` 업데이트**

  `profile.links` (4개, `@/constants/externalLinks` 참조):
  ```typescript
  import { externalLinks } from "@/constants/externalLinks";

  links: [
    { label: "Email",    href: externalLinks.email,    icon: "Mail" },
    { label: "GitHub",   href: externalLinks.github,   icon: "Github" },
    { label: "LinkedIn", href: externalLinks.linkedin, icon: "ExternalLink" },
    { label: "GitLab",   href: externalLinks.gitlab,   icon: "ExternalLink" },
  ]
  ```

  `profile.experience`: `"백엔드 개발 1년+"`

  `roles` (4개):
  ```typescript
  roles: [
    {
      title: "백엔드 API 설계",
      description: "REST API 설계부터 성능 최적화, 도메인 기반 멀티모듈 구조까지 구현합니다.",
      icon: "Server",
      tags: ["Spring Boot", "FastAPI", "Python"],
    },
    {
      title: "인프라 / DevOps",
      description: "AWS 기반 인프라 구성, Blue-Green 배포, GitHub Actions CI/CD를 운영합니다.",
      icon: "Cloud",
      tags: ["AWS", "Docker", "GitHub Actions"],
    },
    {
      title: "AI 서비스 통합",
      description: "LLM 기반 리뷰·분석 기능을 비동기 파이프라인과 연결해 서비스에 통합합니다.",
      icon: "Code2",
      tags: ["FastAPI", "Celery", "Python"],
    },
    {
      title: "데이터 모델링",
      description: "쿼리 최적화와 인덱스 설계로 데이터 접근 비용을 줄이는 구조를 만듭니다.",
      icon: "Database",
      tags: ["MySQL", "PostgreSQL", "QueryDSL"],
    },
  ]
  ```

  `growthMetrics` (4개):
  ```typescript
  growthMetrics: [
    { label: "대표 프로젝트",  value: "4+",   description: "백엔드/인프라 중심 프로젝트" },
    { label: "기여 기간",     value: "1년+",  description: "팀 및 개인 프로젝트" },
    { label: "핵심 기술",     value: "15+",  description: "실무 적용 기술 수" },
    { label: "커밋 / PR",    value: "200+", description: "GitHub 기준" },
  ]
  ```

  `timeline` (실제 이력에 맞게 채움):
  ```typescript
  timeline: [
    {
      type: "project",
      badge: "진행 중",
      title: "AI DevOps Orchestration Platform",
      organization: "개인 프로젝트",
      period: "2026.01 - 현재",
      description: "FastAPI 기반 DevOps 자동화 플랫폼 설계 및 비동기 실행 구조 구현.",
    },
    // 부트캠프, 교육 항목 실제 이력에 맞게 추가
  ]
  ```

  `strengths`, `skills` 필드 제거.

- [ ] **Step 4: 전체 검증**

  Run: `pnpm tsc --noEmit && pnpm lint && pnpm test`

  Expected: 모든 검사 통과

- [ ] **Step 5: 커밋**

  ```bash
  git add src/types/about.ts src/data/about.ts
  git commit -m "refactor: about 데이터 모델 정비 — Role/ProfileLink 타입, timeline 복원, 콘텐츠 추가"
  ```

---

## Task 2: AboutArchDiagram 컴포넌트

**Files:**
- Create: `src/components/about/AboutArchDiagram.tsx`

Props 시그니처: 없음 (정적 UI)

렌더링 구조 (`<div>` — `surface.darkCard hidden lg:block p-6`):

다이어그램 레이아웃:
```
[Client/Web] → [Amazon CloudFront] → [Amazon API Gateway]
                                                     ↓
                +--------------------+--------------------+
                ↓                    ↓                    ↓
[서비스 A (서버리스)]    [서비스 B (컨테이너)]    [서비스 C (비동기 이벤트)]
- AWS Lambda            - Amazon ECS (Fargate)    - Amazon SQS / EventBridge
- Amazon DynamoDB       - Amazon Aurora (DB)      - AWS Lambda (배경 작업)
```

구현 방식:
- 상단 flow는 `grid w-fit grid-cols-[auto_auto_auto_auto_auto] items-center gap-2`
  - `[Client/Web]`, `→`, `[Amazon CloudFront]`, `→`, `[Amazon API Gateway]`
- API Gateway 아래에만 `↓` 화살표와 세로 연결선을 둔다.
  - `col-start-5 justify-self-center`로 API Gateway 컬럼에 고정
  - CloudFront 아래에는 아래 방향 화살표를 두지 않는다.
- API Gateway 아래 연결선에서 3개 서비스 영역으로 수평 분기한다.
- 서비스 영역은 `mt-3 grid gap-3 lg:grid-cols-3`
  - 서비스 A: `AWS Lambda`, `Amazon DynamoDB`
  - 서비스 B: `Amazon ECS (Fargate)`, `Amazon Aurora (DB)`
  - 서비스 C: `Amazon SQS / EventBridge`, `AWS Lambda (배경 작업)`

노드 박스 공통 스타일: `rounded border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-mono text-blue-300`
서비스 박스 공통 스타일: `rounded-lg border border-blue-300/30 p-3`
화살표: `→`, `↓` 문자 — `text-slate-500 text-xs`

- [ ] **Step 1: 파일 생성**

- [ ] **Step 2: 검증**

  Run: `pnpm tsc --noEmit`

  Expected: 오류 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/components/about/AboutArchDiagram.tsx
  git commit -m "feat: AboutArchDiagram 컴포넌트 추가 — 히어로 AWS 아키텍처 다이어그램"
  ```

---

## Task 3: AboutProfile 컴포넌트

**Files:**
- Create: `src/components/about/AboutProfile.tsx`

Props 시그니처:
```typescript
import type { ProfileInfo } from "@/types/about";

type AboutProfileProps = {
  profile: ProfileInfo;
};
```

렌더링 구조 (`grid lg:grid-cols-[240px_1fr] gap-8 items-stretch`):

**좌측** — 사진만 (`<img>` — `h-full w-full rounded-2xl object-cover`)
- `aspect-square` 사용 안 함 — 우측 콘텐츠 높이에 맞춰 `h-full`로 늘어남

**우측** — `flex flex-col justify-between`

위쪽 — intro 단락들 (강조 크기):
```
{profile.introduction.map(p => <p className="text-lg leading-8 text-slate-700">{p}</p>)}
```

아래쪽 — info row (`grid grid-cols-5 border-t border-slate-200 pt-5`):

5개 항목이 가로 영역 전체를 균등 분할. lucide-react 아이콘 적용:
- 이름 — `User`
- 직무 — `Briefcase`
- 경력 — `Clock`
- 위치 — `MapPin`
- 이메일 — `Mail`

각 항목 (`<div className="flex flex-col gap-1 min-w-0">`):
- 아이콘+라벨 row: `<div className="flex items-center gap-1.5">`
  - icon — `h-3.5 w-3.5 text-slate-400`
  - label — `text-xs text-slate-400`
- value: `<span>` — `text-sm font-medium text-slate-900 truncate`
- 이메일 value는 `<a href="mailto:...">` 링크

- [ ] **Step 1: 파일 생성**

- [ ] **Step 2: 검증**

  Run: `pnpm tsc --noEmit`

  Expected: 오류 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/components/about/AboutProfile.tsx
  git commit -m "feat: AboutProfile 컴포넌트 추가 — 사진 + 소개 + info row"
  ```

---

## Task 4: AboutRoleCard 컴포넌트

**Files:**
- Create: `src/components/about/AboutRoleCard.tsx`

Props 시그니처:
```typescript
import type { Role } from "@/types/about";

type AboutRoleCardProps = {
  role: Role;
};
```

렌더링 구조 (`<article>` — `surface.card p-6`):
- `<Icon>` — `h-8 w-8 text-blue-600` (lucide-react 동적 매핑)
  - `"Server" → Server`, `"Cloud" → Cloud`, `"Code2" → Code2`, `"Database" → Database`
- `<h3>` title — `mt-4 text-base font-bold text-slate-900`
- `<p>` description — `mt-2 text-sm leading-6 text-slate-600`
- `role.tags` 존재 시 tags row — `mt-4 flex flex-wrap gap-1.5`
  - 각 tag: `<span>` — `rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600`

- [ ] **Step 1: 파일 생성**

- [ ] **Step 2: 검증**

  Run: `pnpm tsc --noEmit`

  Expected: 오류 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/components/about/AboutRoleCard.tsx
  git commit -m "feat: AboutRoleCard 컴포넌트 추가 — 역할 카드 (아이콘, 설명, 태그)"
  ```

---

## Task 5: AboutTimeline 컴포넌트

**Files:**
- Create: `src/components/about/AboutTimeline.tsx`

Props 시그니처:
```typescript
import type { TimelineItem } from "@/types/about";

type AboutTimelineProps = {
  items: TimelineItem[];
};
```

렌더링 구조 — 수직 타임라인 (`<div>` — `relative pl-8`):

수직 연결선 (CSS `before` 또는 `<div>`):
```
<div className="absolute left-3 top-0 h-full w-0.5 bg-slate-200" />
```

각 항목 (`<div>` — `relative mb-8 last:mb-0`):

원형 마커:
```
<div className="absolute -left-[1.375rem] top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />
```

컨텐츠:
- 상단 row (`flex items-center gap-2 flex-wrap`):
  - badge 존재 시: `<span>` — `rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700`
  - period: `<span>` — `text-xs text-slate-400`
- `<h4>` title — `mt-1 text-sm font-semibold text-slate-900`
- `<p>` organization — `text-xs text-slate-500`
- `<p>` description — `mt-1.5 text-sm leading-6 text-slate-600`

항목 분류 없이 `items` 순서 그대로 단일 수직 흐름으로 렌더링.

- [ ] **Step 1: 파일 생성**

- [ ] **Step 2: 검증**

  Run: `pnpm tsc --noEmit`

  Expected: 오류 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/components/about/AboutTimeline.tsx
  git commit -m "feat: AboutTimeline 컴포넌트 추가 — 수직 타임라인"
  ```

---

## Task 6: AboutWorkStyle 컴포넌트

**Files:**
- Create: `src/components/about/AboutWorkStyle.tsx`

Props 시그니처:
```typescript
import type { WorkStyle } from "@/types/about";

type AboutWorkStyleProps = {
  workStyle: WorkStyle;
};
```

렌더링 구조:
- 여는 따옴표만: `<span className="text-6xl font-bold leading-none text-blue-600">"</span>` (닫는 따옴표 없음)
- `<blockquote className="mt-2 text-2xl font-semibold leading-snug text-slate-900">{workStyle.quote}</blockquote>`
- 수직 체크리스트: `<ul className="mt-8 flex flex-col gap-3">`
  - 각 항목: `<li className="flex items-start gap-3">`
    - `<Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />`
    - `<span className="text-sm text-slate-700">{p}</span>`

lucide-react `Check` import 필요.

- [ ] **Step 1: 파일 생성**

- [ ] **Step 2: 검증**

  Run: `pnpm tsc --noEmit`

  Expected: 오류 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/components/about/AboutWorkStyle.tsx
  git commit -m "feat: AboutWorkStyle 컴포넌트 추가 — 여는 따옴표 강조 + 수직 체크리스트"
  ```

---

## Task 7: AboutGrowthMetrics 컴포넌트

**Files:**
- Create: `src/components/about/AboutGrowthMetrics.tsx`

Props 시그니처:
```typescript
import type { Metric } from "@/types/common";

type AboutGrowthMetricsProps = {
  metrics: Metric[];
};
```

렌더링 구조:
- metrics 2×2 그리드: `<div className="grid grid-cols-2 gap-4">`
  - 각 metric: `<article className={surface.card + " p-5"}>`
    - `<p className="text-3xl font-bold text-blue-600">{m.value}</p>`
    - `<p className="mt-1 text-sm font-semibold text-slate-700">{m.label}</p>`
    - `{m.description && <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>}`

- [ ] **Step 1: 파일 생성**

- [ ] **Step 2: 검증**

  Run: `pnpm tsc --noEmit`

  Expected: 오류 없음

- [ ] **Step 3: 커밋**

  ```bash
  git add src/components/about/AboutGrowthMetrics.tsx
  git commit -m "feat: AboutGrowthMetrics 컴포넌트 추가 — 지표로 보는 성장 2×2 그리드"
  ```

---

## Task 8: AboutPage 6개 섹션 조립

**Files:**
- Modify: `src/pages/AboutPage.tsx`

Import 목록:
```typescript
import { surface } from "@/styles/classNames";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AboutArchDiagram } from "@/components/about/AboutArchDiagram";
import { AboutGrowthMetrics } from "@/components/about/AboutGrowthMetrics";
import { AboutProfile } from "@/components/about/AboutProfile";
import { AboutRoleCard } from "@/components/about/AboutRoleCard";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutWorkStyle } from "@/components/about/AboutWorkStyle";
import { PageHero } from "@/components/hero/PageHero";
import { HomeTechStack } from "@/components/project/HomeTechStack";
import { PageLayout } from "@/components/layout/PageLayout";
import { aboutData } from "@/data/about";
import { pageHeroes } from "@/data/hero";
import { techStackGroups } from "@/data/techStack";
import { pageChrome } from "@/utils/pageChrome";
```

섹션 구성:

**Section 0 — Hero**

```
<PageHero {...pageHeroes.about} visualSlot={<AboutArchDiagram />} />
```

**Section 1 — Profile (`bg-slate-50 py-16 lg:py-20`)**

```
<SectionHeader eyebrow="PROFILE" title={aboutData.profile.name} description={aboutData.profile.role} />
<div className="mt-10">
  <AboutProfile profile={aboutData.profile} />
</div>
```

**Section 2 — What I Build (`bg-white py-16 lg:py-20`)**

```
<SectionHeader eyebrow="WHAT I BUILD" title="역할과 책임"
  description="백엔드 설계부터 인프라 운영, AI 서비스 통합까지 책임지고 구현합니다." />
<div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
  {aboutData.roles.map(role => <AboutRoleCard key={role.title} role={role} />)}
</div>
```

**Section 3 — Career & Education (`bg-slate-50 py-16 lg:py-20`)**

```
<SectionHeader eyebrow="CAREER & EDUCATION" title="경력 및 교육" />
<div className="mt-10">
  <AboutTimeline items={aboutData.timeline} />
</div>
```

**Section 4 — Tech Stack (`bg-white py-16 lg:py-20`)**

```
<SectionHeader eyebrow="TECH STACK" title="기술 스택"
  description="백엔드, 데이터베이스, 인프라와 운영 관측 도구를 중심으로 학습하고 적용합니다." />
<HomeTechStack groups={techStackGroups} />
```

**Section 5 — Working Style + Growth Metrics (`bg-slate-50 py-16 lg:py-20`)**

하나의 배경 밴드 안에서 가로 반반 배치한다. 각 컬럼이 자체 `SectionHeader`를 가진다:

```
<div className="mx-auto max-w-7xl px-6 lg:px-8">
  <div className="grid gap-12 lg:grid-cols-2">
    <div>
      <SectionHeader eyebrow="WORKING STYLE" title="일하는 방식" />
      <div className="mt-10">
        <AboutWorkStyle workStyle={aboutData.workStyle} />
      </div>
    </div>
    <div>
      <SectionHeader eyebrow="GROWTH METRICS" title="지표로 보는 성장" />
      <div className="mt-10">
        <AboutGrowthMetrics metrics={aboutData.growthMetrics} />
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 1: `src/pages/AboutPage.tsx` 전체 재작성**

- [ ] **Step 2: 전체 검증**

  Run: `pnpm tsc --noEmit && pnpm lint && pnpm test`

  Expected: TypeScript 오류 없음 / ESLint 경고 없음 / 테스트 15개 통과

- [ ] **Step 3: 커밋**

  ```bash
  git add src/pages/AboutPage.tsx
  git commit -m "feat: AboutPage 6개 섹션 조립 — 자기소개 페이지 완성"
  ```

---

## 검증 파이프라인

전체 작업 완료 후 실행:

```bash
pnpm tsc --noEmit && pnpm lint && pnpm test
```

Expected: TypeScript 오류 없음 / ESLint 경고 없음 / 테스트 15개 통과
