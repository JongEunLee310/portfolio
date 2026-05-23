# 라이트 모드 전체 골드 테마 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 라이트 모드의 모든 파란색 포인트를 CSS 변수 기반 골드(#C9972B)로 교체한다. 다크 모드는 기존 파랑 유지.

**Architecture:** `src/styles/globals.css`에 `--color-accent` 계열 변수를 추가하고 라이트=골드, 다크=파랑으로 설정한다. 각 컴포넌트에서 하드코딩된 `text-blue-600` 등을 `text-[var(--color-accent)]`로 교체한다.

**Tech Stack:** React, TypeScript, Tailwind CSS v3, CSS Custom Properties

---

### Task 1: Foundation — globals.css + classNames.ts + ButtonLink.tsx

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/styles/classNames.ts`
- Modify: `src/components/common/ButtonLink.tsx`

- [ ] **Step 1: globals.css — accent 변수 추가 및 badge 색상 업데이트**

`:root` 블록에 다음 5개 변수를 추가한다:

```css
:root {
  color-scheme: light;
  font-family: "Pretendard", system-ui, sans-serif;
  --color-page-bg: #f8fafc;
  --color-page-text: #0f172a;
  --color-surface: #ffffff;
  --color-surface-muted: #f1f5f9;
  --color-border: #e2e8f0;
  --color-muted-text: #475569;
  --color-accent: #C9972B;
  --color-accent-hover: #B8851E;
  --color-accent-dark: #966B15;
  --color-accent-bg: rgba(201, 151, 43, 0.10);
  --color-accent-border: rgba(201, 151, 43, 0.25);
}
```

`:root[data-theme="dark"]` 블록에 다음 5개 변수를 추가한다:

```css
:root[data-theme="dark"] {
  color-scheme: dark;
  --color-page-bg: #020712;
  --color-page-text: #f8fafc;
  --color-surface: #06101f;
  --color-surface-muted: #0d1b2f;
  --color-border: rgba(255, 255, 255, 0.12);
  --color-muted-text: #cbd5e1;
  --color-accent: #3b82f6;
  --color-accent-hover: #60a5fa;
  --color-accent-dark: #93c5fd;
  --color-accent-bg: rgba(37, 99, 235, 0.14);
  --color-accent-border: rgba(96, 165, 250, 0.28);
}
```

`.badge-primary`, `.badge-light`, `.badge-dark` 라이트 모드 값을 골드로 교체한다:

```css
.badge-primary {
  background: var(--color-accent);
  color: #ffffff;
}

.badge-light,
.badge-dark {
  border-color: rgba(201, 151, 43, 0.35);
  background: rgba(201, 151, 43, 0.08);
  color: var(--color-accent-dark);
}
```

- [ ] **Step 2: classNames.ts — button.primary hover, button.outline hover 교체**

```ts
export const button = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-[var(--color-accent-hover)]",
  outline:
    "inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
  darkOutline:
    "inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10",
};
```

- [ ] **Step 3: ButtonLink.tsx — primary variant 교체, goldPrimary 제거, outline hover 교체**

```tsx
type ButtonLinkVariant = "primary" | "outline" | "darkOutline";

const variants: Record<ButtonLinkVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white shadow-card transition hover:bg-[var(--color-accent-hover)]",
  outline:
    "border border-slate-300 bg-white text-slate-900 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
  darkOutline:
    "border border-white/20 bg-white/5 text-white transition hover:border-blue-400 hover:bg-blue-500/10",
};
```

- [ ] **Step 4: PageHero.tsx — goldPrimary 참조 제거 (ButtonLink goldPrimary 삭제 전 필수)**

`primaryAction` 렌더 부분에서 `variant` 조건을 제거한다. `primary`가 기본값이므로 props 자체를 생략한다:

```tsx
{primaryAction ? (
  <ButtonLink href={primaryAction.href}>
    {primaryAction.label}
  </ButtonLink>
) : null}
```

eyebrow 색상을 CSS 변수로 교체:
```tsx
isLight ? "text-[var(--color-accent-dark)]" : "text-blue-400",
```

highlight 텍스트를 CSS 변수로 교체:
```tsx
<span className={isLight ? "text-[var(--color-accent)]" : "text-blue-500"}>{highlightedText}</span>
```

- [ ] **Step 5: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 6: 커밋**

```bash
git add src/styles/globals.css src/styles/classNames.ts src/components/common/ButtonLink.tsx src/components/hero/PageHero.tsx
git commit -m "feat: CSS accent 변수 추가 및 badge/button/hero 골드 테마 적용"
```

---

### Task 2: Layout — Header.tsx + SectionHeader.tsx + ThemeModeControl.tsx

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/common/SectionHeader.tsx`
- Modify: `src/components/layout/ThemeModeControl.tsx`

- [ ] **Step 1: Header.tsx — 활성 링크 및 호버 색상 교체**

```tsx
className={({ isActive }) =>
  [
    "relative text-sm font-medium transition hover:text-[var(--color-accent)]",
    isActive
      ? "text-[var(--color-accent)] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--color-accent)] after:content-[''] after:rounded-full"
      : "text-[var(--color-muted-text)]",
  ].join(" ")
}
```

- [ ] **Step 2: SectionHeader.tsx — eyebrow 색상 교체**

```tsx
<p className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]">
  {eyebrow}
</p>
```

- [ ] **Step 3: ThemeModeControl.tsx — 트리거 버튼 hover, 선택 상태 교체**

트리거 버튼 className:
```tsx
className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-page-text)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
```

드롭다운 메뉴 항목 선택 상태:
```tsx
isSelected
  ? "bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
  : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-page-text)]",
```

- [ ] **Step 4: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 5: 커밋**

```bash
git add src/components/layout/Header.tsx src/components/common/SectionHeader.tsx src/components/layout/ThemeModeControl.tsx
git commit -m "feat: 레이아웃 컴포넌트 라이트 모드 골드 테마 적용"
```

---

### Task 3: Contact 컴포넌트

**Files:**
- Modify: `src/components/contact/ContactChannelCard.tsx`
- Modify: `src/components/contact/ContactEmailCTA.tsx`
- Modify: `src/components/contact/ContactFAQList.tsx`
- Modify: `src/components/contact/ContactValueCard.tsx`

- [ ] **Step 1: ContactChannelCard.tsx — 아이콘·라벨 색상 교체**

```tsx
<Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
```

```tsx
<p className="text-sm font-semibold text-[var(--color-accent)]">{channel.label}</p>
```

- [ ] **Step 2: ContactEmailCTA.tsx — 아이콘 배경·텍스트 교체**

```tsx
<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
```

```tsx
<p className="text-sm font-semibold text-[var(--color-accent)]">{channel.label}</p>
```

- [ ] **Step 3: ContactFAQList.tsx — chevron 아이콘 색상 교체**

```tsx
<ChevronDown
  className={[
    "h-5 w-5 shrink-0 text-[var(--color-accent)] transition-transform",
    openQuestion === item.question ? "rotate-180" : "",
  ].join(" ")}
  aria-hidden="true"
/>
```

- [ ] **Step 4: ContactValueCard.tsx — 아이콘 색상 교체**

```tsx
<Icon className="h-8 w-8 text-[var(--color-accent)]" aria-hidden="true" />
```

- [ ] **Step 5: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 6: 커밋**

```bash
git add src/components/contact/ContactChannelCard.tsx src/components/contact/ContactEmailCTA.tsx src/components/contact/ContactFAQList.tsx src/components/contact/ContactValueCard.tsx
git commit -m "feat: Contact 컴포넌트 라이트 모드 골드 테마 적용"
```

---

### Task 4: About 컴포넌트

**Files:**
- Modify: `src/components/about/AboutArchDiagram.tsx`
- Modify: `src/components/about/AboutRoleCard.tsx`
- Modify: `src/components/about/AboutProfile.tsx`
- Modify: `src/components/about/AboutTimeline.tsx`
- Modify: `src/components/about/AboutWorkStyle.tsx`

- [ ] **Step 1: AboutArchDiagram.tsx — NodeBox 및 ServiceGroup 색상 교체**

`NodeBox`:
```tsx
function NodeBox({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-3 py-1.5 text-center font-mono text-xs text-[var(--color-accent)]">
      {children}
    </span>
  );
}
```

`ServiceGroup` 내 타이틀 색상:
```tsx
<p className="font-mono text-xs font-semibold text-[var(--color-accent)]">
  {title} <span className="text-[var(--color-accent)]/70">({type})</span>
</p>
```

연결선 div 두 곳:
```tsx
<div className="col-start-5 h-4 w-px justify-self-center bg-[var(--color-accent-border)]" />
```
```tsx
<div className="mx-auto mt-1 h-px w-2/3 bg-[var(--color-accent-border)]" />
```

- [ ] **Step 2: AboutRoleCard.tsx — 아이콘 색상 교체**

```tsx
<Icon className="h-8 w-8 text-[var(--color-accent)]" aria-hidden="true" />
```

- [ ] **Step 3: AboutProfile.tsx — 이메일 링크 호버 교체**

```tsx
className="truncate text-sm font-medium text-[var(--color-page-text)] transition hover:text-[var(--color-accent)]"
```

- [ ] **Step 4: AboutTimeline.tsx — 타임라인 도트 색상 교체**

```tsx
<div className="absolute -left-[1.375rem] top-1.5 h-3 w-3 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-page-bg)]" />
```

- [ ] **Step 5: AboutWorkStyle.tsx — 따옴표 및 체크박스 색상 교체**

```tsx
<span className="text-6xl font-bold leading-none text-[var(--color-accent)]">"</span>
```

```tsx
<span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
```

- [ ] **Step 6: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 7: 커밋**

```bash
git add src/components/about/AboutArchDiagram.tsx src/components/about/AboutRoleCard.tsx src/components/about/AboutProfile.tsx src/components/about/AboutTimeline.tsx src/components/about/AboutWorkStyle.tsx
git commit -m "feat: About 컴포넌트 라이트 모드 골드 테마 적용"
```

---

### Task 5: Note UI 컴포넌트

**Files:**
- Modify: `src/components/note/NoteCard.tsx`
- Modify: `src/components/note/NoteListToolbar.tsx`
- Modify: `src/components/note/NoteListSidebar.tsx`
- Modify: `src/components/note/NotePagination.tsx`
- Modify: `src/components/note/HomeNoteCard.tsx`

- [ ] **Step 1: NoteCard.tsx — CTA 버튼 색상 교체**

```tsx
className="mt-4 inline-flex h-10 w-full max-w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
```

- [ ] **Step 2: NoteListToolbar.tsx — 활성 뷰 버튼, select 호버 교체**

select 호버:
```tsx
className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-semibold text-[var(--color-page-text)] outline-none transition hover:border-[var(--color-accent)]"
```

뷰 모드 활성 버튼:
```tsx
viewMode === option.value
  ? "bg-[var(--color-accent)] text-white"
  : "text-[var(--color-muted-text)] hover:text-[var(--color-page-text)]"
```

- [ ] **Step 3: NoteListSidebar.tsx — 카테고리 활성, 태그 체크박스, 피처 활성, more 버튼 교체**

카테고리 활성 (line 78):
```tsx
isSelected
  ? "bg-[var(--color-accent)] text-white"
  : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-page-text)]"
```

태그 체크박스 accent (line 111):
```tsx
className="h-3.5 w-3.5 rounded border-[var(--color-border)] bg-transparent accent-[#C9972B]"
```

more 버튼 (line 123):
```tsx
className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)]"
```

피처 활성 (line 144-147):
```tsx
isSelected
  ? "bg-[var(--color-accent)] text-white"
  : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-page-text)]"
```

- [ ] **Step 4: NotePagination.tsx — 활성 페이지, 호버 border 교체**

이전/다음 버튼 hover:
```tsx
className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-page-text)] disabled:cursor-not-allowed disabled:opacity-40"
```

페이지 번호 활성/비활성:
```tsx
currentPage === page
  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-page-text)]"
```

- [ ] **Step 5: HomeNoteCard.tsx — 링크 호버 교체**

```tsx
className="text-base font-bold leading-6 text-[var(--color-page-text)] transition hover:text-[var(--color-accent)]"
```

- [ ] **Step 6: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 7: 커밋**

```bash
git add src/components/note/NoteCard.tsx src/components/note/NoteListToolbar.tsx src/components/note/NoteListSidebar.tsx src/components/note/NotePagination.tsx src/components/note/HomeNoteCard.tsx
git commit -m "feat: Note UI 컴포넌트 라이트 모드 골드 테마 적용"
```

---

### Task 6: Note 콘텐츠 — ArticleSectionRenderer.tsx + ArticleToc.tsx

**Files:**
- Modify: `src/components/note/ArticleSectionRenderer.tsx`
- Modify: `src/components/note/ArticleToc.tsx`

- [ ] **Step 1: ArticleSectionRenderer.tsx — info callout, cards, comparison bullet 교체**

`calloutClassMap`의 `info` 항목:
```tsx
info: "border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-page-text)]",
```

`list` 타입 체크 아이콘:
```tsx
<CheckCircle2 className="mt-2 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
```

`cards` 타입 아이콘 컨테이너:
```tsx
<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
```

`cards` 타입 badge:
```tsx
<span className="mt-4 inline-flex rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-[var(--color-accent)]">
```

`comparison` 타입 bullet dot:
```tsx
<span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
```

**주의:** `metrics` 타입은 의도적으로 다크 스타일(`bg-slate-950`)이므로 변경하지 않는다.

- [ ] **Step 2: ArticleToc.tsx — 링크 호버 교체**

```tsx
"block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-muted-text)] transition hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]",
```

- [ ] **Step 3: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 4: 커밋**

```bash
git add src/components/note/ArticleSectionRenderer.tsx src/components/note/ArticleToc.tsx
git commit -m "feat: Note 콘텐츠 컴포넌트 라이트 모드 골드 테마 적용"
```

---

### Task 7: Project 컴포넌트 + TechnicalNoteDetailPage

**Files:**
- Modify: `src/components/project/ProjectListToolbar.tsx`
- Modify: `src/components/project/ProjectContributionTimelineSection.tsx`
- Modify: `src/pages/TechnicalNoteDetailPage.tsx`

- [ ] **Step 1: ProjectListToolbar.tsx — select 호버, 활성 뷰 버튼 교체**

select 호버:
```tsx
className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-semibold text-[var(--color-page-text)] outline-none transition hover:border-[var(--color-accent)]"
```

뷰 모드 활성 버튼:
```tsx
viewMode === option.value
  ? "bg-[var(--color-accent)] text-white"
  : "text-[var(--color-muted-text)] hover:text-[var(--color-page-text)]"
```

- [ ] **Step 2: ProjectContributionTimelineSection.tsx — 타임라인 도트, 날짜 텍스트 교체**

도트:
```tsx
<span className="absolute -top-3 left-5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-page-bg)]" />
```

날짜:
```tsx
<p className="mt-2 text-xs font-bold text-[var(--color-accent)]">
```

- [ ] **Step 3: TechnicalNoteDetailPage.tsx — 관련 노트/프로젝트, 요약 섹션, CTA 교체**

브레드크럼 호버 (line 76):
```tsx
className="transition hover:text-[var(--color-accent)]"
```

관련 노트 카드 호버 (line 186):
```tsx
className="block rounded-lg border border-[var(--color-border)] p-3 transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]"
```

관련 노트 날짜 (line 188):
```tsx
<p className="text-xs font-semibold text-[var(--color-accent)]">
```

요약 섹션 박스 (line 202):
```tsx
<section className="rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] px-5 py-4">
```

요약 라벨 (line 203):
```tsx
<p className="text-xs font-bold uppercase text-[var(--color-accent-dark)]">
```

관련 프로젝트 기간 (line 229):
```tsx
<p className="text-xs font-semibold text-[var(--color-accent)]">
```

관련 프로젝트 링크 (line 240):
```tsx
className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-dark)]"
```

하단 CTA 버튼 (line 267):
```tsx
className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-accent-hover)]"
```

- [ ] **Step 4: typecheck + lint**

```bash
pnpm typecheck && pnpm lint
```

Expected: 오류 없음

- [ ] **Step 5: 커밋**

```bash
git add src/components/project/ProjectListToolbar.tsx src/components/project/ProjectContributionTimelineSection.tsx src/pages/TechnicalNoteDetailPage.tsx
git commit -m "feat: Project/NoteDetail 라이트 모드 골드 테마 적용"
```

---

### Task 8: 최종 검증

- [ ] **Step 1: 전체 빌드**

```bash
pnpm build
```

Expected: 오류 없이 `dist/` 생성

- [ ] **Step 2: dev 서버로 확인**

```bash
pnpm dev
```

라이트 모드에서 확인:
- 홈: 히어로 골드 아이브로, 하이라이트 텍스트, 골드 버튼, 아이콘
- 프로젝트: 리스트 필터 활성 상태, 타임라인 도트
- About: 아키텍처 다이어그램 박스, 타임라인 도트, 체크리스트
- 노트: 카드 CTA, 사이드바 활성 필터, 페이지네이션
- 노트 상세: 요약 박스, 관련 노트, CTA
- Contact: 채널 카드 아이콘, FAQ chevron
- 내비게이션: 활성 링크 언더바, 호버
- 다크 모드 전환 시 파랑 그대로인지 확인
