# Projects Page Reference Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 제공된 레퍼런스 이미지와 동일한 프로젝트 목록 경험을 만든다. 다크 히어로와 프로젝트 탐색 영역을 연결하고, 좌측 필터 사이드바, 정렬/보기 전환 툴바, 흰색 프로젝트 카드 3열, 페이지네이션/더 보기 CTA, 하단 기술 스택 밴드를 구현한다. 카테고리 필터는 사이드바 안에서만 제공하고, 같은 역할의 상단 pill 버튼은 사용하지 않는다.

**Architecture:** 타입/필터 데이터 확장 → 프로젝트 목록 전용 컴포넌트 추가 → 카드/그리드 수정 → `ProjectsPage` 재구성 → 데이터 수량/이미지 보강 → 검증 순서로 진행한다. 스펙: `docs/superpowers/specs/2026-05-21-projects-page-reference-redesign.md`

**Tech Stack:** React 18, TypeScript, Tailwind CSS, lucide-react, react-icons

---

## File Structure

**Create:**
- `src/components/hero/ProjectsHeroVisual.tsx` — 프로젝트 페이지 히어로 우측 비주얼
- `src/components/project/ProjectListSidebar.tsx` — 좌측 필터 패널
- `src/components/project/ProjectListToolbar.tsx` — 프로젝트 수, 정렬, 보기 전환 툴바
- `src/components/project/ProjectPagination.tsx` — 페이지 번호 및 더 보기 CTA
- `src/components/project/ProjectTechStackBand.tsx` — 다크 배경 기술 스택 미니 카드 그리드

**Modify:**
- `src/types/project.ts` — 필터 상태, 정렬, 보기 모드 타입 추가
- `src/data/filters.ts` — 사이드바 표시 문구, 기간 필터, 보기 모드 옵션 추가
- `src/data/projects.ts` — 레퍼런스와 동일한 6개 카드가 필요하면 프로젝트 2개 추가
- `src/data/hero.ts` — projects hero 비주얼 경로 또는 설명 유지
- `src/components/project/ProjectCard.tsx` — 레퍼런스 카드 스타일로 수정
- `src/components/project/ProjectGrid.tsx` — `viewMode` prop 추가
- `src/pages/ProjectsPage.tsx` — 레이아웃/필터/정렬 상태 재구성

**Optional assets:**
- `public/images/projects/{new-project}/thumbnail.svg`
- `public/images/hero/project-hero.svg` 교체 또는 유지

---

## Task 1: 타입 및 필터 데이터 확장

**Files:**
- Modify: `src/types/project.ts`
- Modify: `src/data/filters.ts`

- [x] `src/types/project.ts` — `ProjectSortValue = "latest" | "featured" | "name"` 추가
- [x] `src/types/project.ts` — `ProjectViewMode = "grid" | "list"` 추가
- [x] `src/types/project.ts` — `ProjectFilterState` 타입 추가 (`category`, `techStacks`, `period`, `type`)
- [x] `src/data/filters.ts` — `projectPeriodFilters` 추가 (`전체`, `최근 6개월`, `최근 1년`, `1년 이상`)
- [x] `src/data/filters.ts` — `projectSidebarContent` 추가 (`필터`, `카테고리`, `사용 기술`, `기간`, `협업 방식`, `더 보기`)
- [x] `src/data/filters.ts` — `projectViewModeOptions` 추가 (`grid`, `list`)
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 2: ProjectsHeroVisual 컴포넌트 추가

**Files:**
- Create: `src/components/hero/ProjectsHeroVisual.tsx`
- Modify: `src/pages/ProjectsPage.tsx`

렌더링 목표:
- 레퍼런스 우측 3D 아키텍처 비주얼 영역
- `hidden lg:block`
- 외부 텍스트 없음
- 다크 배경 위에서 보이는 blue glow와 subtle grid

- [x] `ProjectsHeroVisual` 컴포넌트 생성
- [x] 우선 `pageHeroes.projects.visual` 이미지를 받거나 내부 장식 UI를 렌더링하도록 구현 방향 결정
- [x] `ProjectsPage`의 `PageHero`에 `visualSlot={<ProjectsHeroVisual />}` 주입
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 3: ProjectListSidebar 구현

**Files:**
- Create: `src/components/project/ProjectListSidebar.tsx`
- Modify: `src/pages/ProjectsPage.tsx`

컴포넌트 책임:
- 카테고리 count 목록
- 사용 기술 체크박스 목록
- 기간 라디오 목록
- 협업 방식 목록
- 데이터 import 없이 props만 사용

- [x] `ProjectListSidebarProps` 정의
- [x] `SlidersHorizontal`, `ChevronDown` 아이콘 import
- [x] 최상위 패널 스타일 적용: `sticky top-24 hidden rounded-xl border border-white/10 bg-white/[0.04] lg:block`
- [x] 카테고리 버튼 목록 구현
- [x] 사용 기술 체크박스 목록 구현
- [x] 기간 라디오 목록 구현
- [x] 협업 방식 버튼 목록 구현
- [x] `ProjectsPage`에서 count 계산 후 props 전달
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 4: ProjectListToolbar 구현

**Files:**
- Create: `src/components/project/ProjectListToolbar.tsx`
- Modify: `src/pages/ProjectsPage.tsx`

컴포넌트 책임:
- `총 N개의 프로젝트`
- 정렬 select
- grid/list 토글 버튼

- [x] `ProjectListToolbarProps` 정의
- [x] `Grid2X2`, `List`, `ChevronDown` 아이콘 import
- [x] select 또는 button menu로 `projectSortOptions` 렌더링
- [x] grid/list 토글 버튼에 `aria-pressed` 제공
- [x] `ProjectsPage`에 `sort`, `viewMode` state 추가
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 5: 프로젝트 필터/정렬 로직 재구성

**Files:**
- Modify: `src/pages/ProjectsPage.tsx`

구현 원칙:
- 페이지 컴포넌트만 `projects`, `filters` 데이터를 import한다.
- 필터 계산 결과를 컴포넌트에 props로 전달한다.
- 기간 필터는 정확한 날짜 필드가 추가되기 전까지 `"all"`만 실제 필터로 적용한다.

- [x] `filters` state를 `ProjectFilterState`로 변경
- [x] 카테고리 필터는 사이드바 카테고리 목록만 사용하고 상단 `ProjectFilter`는 렌더링하지 않음
- [x] 기술 스택 다중 선택 필터 구현
- [x] 협업 방식 필터 구현
- [x] 정렬 함수 구현 (`featured`, `name`, `latest`)
- [x] `latest`는 `period` 문자열 기반 임시 정렬 대신 기존 배열 순서를 유지하거나 `sortOrder` 추가 여부 결정
- [x] `useMemo`로 `filteredProjects`, `sortedProjects`, `visibleProjects` 계산
- [x] 빈 상태는 기존 `EmptyState` 유지
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 6: ProjectCard / ProjectGrid 스타일 수정

**Files:**
- Modify: `src/components/project/ProjectCard.tsx`
- Modify: `src/components/project/ProjectGrid.tsx`

카드 목표:
- 레퍼런스처럼 어두운 페이지 위 흰색 카드
- 작은 카테고리 chip
- 썸네일 + 제목 + 2줄 요약 + 기술 태그 + 버튼 2개

- [x] `ProjectCard` radius를 `rounded-xl` 이하로 조정
- [x] 썸네일에 내부 여백/둥근 모서리 적용 (`p-4` wrapper 또는 image `rounded-md`)
- [x] 배지를 이미지 아래 작은 blue chip으로 조정
- [x] 요약에 `line-clamp-2` 적용 가능 여부 확인. Tailwind plugin이 없으면 `min-h`와 overflow 방식 사용
- [x] 기술 태그 표시 개수를 최대 8개로 조정
- [x] `"상세 보기"` 버튼에 `ArrowRight` 아이콘 추가
- [x] `"GitHub"` 버튼에 `ExternalLink` 아이콘 유지
- [x] `ProjectGrid`에 `viewMode?: ProjectViewMode` prop 추가
- [x] grid 모드: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- [x] list 모드: 1열 가로 카드 또는 초기 버전에서는 grid와 동일한 카드 폭으로 구현
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 7: ProjectPagination / 더 보기 CTA 구현

**Files:**
- Create: `src/components/project/ProjectPagination.tsx`
- Modify: `src/pages/ProjectsPage.tsx`

초기 구현:
- 현재 데이터가 6개 이하이면 페이지 번호는 레퍼런스와 같은 자리만 제공하고 실제 페이지 이동은 선택 구현
- `더 많은 프로젝트 보기`는 `visibleCount`를 늘리는 CTA로 구현할 수 있다.

- [x] `ProjectPaginationProps` 정의
- [x] 이전/다음/번호 버튼 렌더링
- [x] 하단 outline CTA 렌더링 (`더 많은 프로젝트 보기`, `ArrowDown`)
- [x] `ProjectsPage`에서 `visibleCount` 또는 `page` state 연결
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 8: 하단 Tech Stack Band 추가

**Files:**
- Create: `src/components/project/ProjectTechStackBand.tsx`
- Modify: `src/pages/ProjectsPage.tsx`

렌더링 목표:
- 다크 배경 위 6열 미니 카드
- `TECH STACK` eyebrow와 `"기술 스택"` title
- 각 카드: 아이콘, 그룹명, 주요 기술 2~4개

- [x] `ProjectTechStackBandProps` 정의 (`groups: TechStackGroup[]`)
- [x] `IconName` 기반 lucide-react 아이콘 매핑 구현
- [x] 다크 미니 카드 스타일 구현
- [x] `ProjectsPage`에서 `techStackGroups` import 후 전달
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 9: 프로젝트 데이터 6개 기준 보강

**Files:**
- Modify: `src/data/projects.ts`
- Create: `public/images/projects/{project-slug}/thumbnail.svg`

레퍼런스와 동일하게 2행 × 3열을 채우려면 프로젝트 2개를 추가한다. 추가 프로젝트가 실제 포트폴리오에 부적합하면 이 Task는 건너뛰고 현재 4개 카드 기준으로 레이아웃만 적용한다.

- [x] 추가할 프로젝트 2개 선정
- [x] `ProjectCard` 타입에 맞는 데이터 추가
- [x] `slug`는 kebab-case 사용
- [x] `links.detail`은 `PATHS.projectDetail(slug)` 사용
- [x] 상세 데이터가 없으면 content integrity 실패 가능성이 있으므로 `src/data/projectDetails.ts`도 함께 추가할지 확인
- [x] 썸네일 경로 추가 및 이미지 파일 생성
- [x] 이미지 경로 검증: `pnpm check:image-paths`
- [x] 콘텐츠 검증: `pnpm check:content`

---

## Task 10: ProjectsPage 전체 레이아웃 조립

**Files:**
- Modify: `src/pages/ProjectsPage.tsx`

최종 구조:

```tsx
<PageLayout {...pageChrome}>
  <PageHero {...pageHeroes.projects} visualSlot={<ProjectsHeroVisual />} />
  <section className="bg-brand-dark py-16 lg:py-20">
    <div className="mx-auto flex max-w-7xl gap-6 px-6 lg:px-8">
      <ProjectListSidebar ... />
      <main className="min-w-0 flex-1">
        <ProjectListToolbar ... />
        <ProjectGrid ... />
        <ProjectPagination ... />
      </main>
    </div>
  </section>
  <ProjectTechStackBand groups={techStackGroups} />
</PageLayout>
```

- [x] 상단 pill 필터를 제거하고 사이드바 카테고리 필터만 유지
- [x] 목록 섹션 배경을 `bg-brand-dark`로 변경
- [x] 사이드바 + main 2열 레이아웃 적용
- [x] 모바일에서 사이드바 숨김 및 상단 pill만 유지
- [x] 빈 상태가 다크 배경에서도 읽히도록 스타일 확인
- [x] Footer와 Tech Stack 사이 여백/경계선 조정
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 11: 검증 및 마무리

**Files:**
- No planned code changes

- [x] 린트 검증: `pnpm lint`
- [x] 타입 검증: `pnpm typecheck`
- [x] 테스트 실행: `pnpm test`
- [x] 콘텐츠 검증: `pnpm check:content`
- [x] 이미지 경로 검증: `pnpm check:image-paths`
- [x] 전체 검증: `pnpm check:all`
- [x] 브라우저에서 `/projects` 확인
- [x] 데스크톱 확인: 1440px 이상에서 sidebar + 3열 카드 + tech stack 6열
- [x] 모바일 확인: 390px 기준에서 hero, pill, toolbar, 1열 카드가 겹치지 않음

---

## Open Decisions

- [x] 레퍼런스와 동일한 6개 카드 구성을 위해 실제 프로젝트 2개를 추가할지 결정
- [x] 기간 필터를 정확히 구현하기 위해 `ProjectCard`에 `startedAt`, `endedAt`, `sortOrder`를 추가할지 결정
- [x] list view를 실제 가로 카드로 구현할지, 초기에는 토글 자리만 제공할지 결정
- [x] 히어로 우측 비주얼을 기존 SVG로 유지할지, 새 비트맵/HTML CSS 비주얼로 교체할지 결정
