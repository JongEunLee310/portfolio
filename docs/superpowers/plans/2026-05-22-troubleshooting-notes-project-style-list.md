# Troubleshooting Notes Project Style List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 트러블슈팅 문서 목록을 프로젝트 목록과 동일한 탐색 스타일로 개편한다. 다크 배경, 좌측 필터 사이드바, 정렬/보기 전환 툴바, 카드 그리드, 페이지네이션을 기술 노트 데이터에 맞게 구현한다.

**Architecture:** 타입/필터 데이터 확장 → 기술 노트 목록 전용 컴포넌트 추가 → `NoteCard`/`NoteGrid` 스타일 조정 → `TechnicalNotesPage` 재구성 → 검증 순서로 진행한다. 스펙: `docs/superpowers/specs/2026-05-22-troubleshooting-notes-project-style-list.md`

**Tech Stack:** React 18, TypeScript, Tailwind CSS, lucide-react

---

## File Structure

**Create:**
- NoteListSidebar component — 기술 노트 좌측 필터 패널
- NoteListToolbar component — 문서 수, 정렬, 보기 전환 툴바
- NotePagination component — 페이지 번호 및 더 보기 CTA

**Modify:**
- `src/types/note.ts` — 필터 상태, 정렬, 보기 모드 타입 추가
- `src/data/filters.ts` — 기술 노트 사이드바/목록 표시 문구와 보기 모드 옵션 추가
- `src/components/note/NoteCard.tsx` — 프로젝트 카드와 같은 목록 카드 스타일로 수정
- `src/components/note/NoteGrid.tsx` — `viewMode`, `labels` prop 추가
- `src/pages/TechnicalNotesPage.tsx` — 프로젝트 목록과 같은 레이아웃/필터/정렬 상태로 재구성
- `src/utils/noteFilters.ts` — 필요 시 필터 helper 확장

---

## Task 1: 타입 및 필터 데이터 확장

**Files:**
- Modify: `src/types/note.ts`
- Modify: `src/data/filters.ts`

- [x] `src/types/note.ts` — `NoteSortValue = "latest" | "featured" | "readingTime"` 추가
- [x] `src/types/note.ts` — `NoteViewMode = "grid" | "list"` 추가
- [x] `src/types/note.ts` — `NoteFilterState` 타입 추가 (`category`, `tags`, `featured`)
- [x] `src/data/filters.ts` — `noteSidebarContent` 추가
- [x] `src/data/filters.ts` — `noteFeaturedFilters` 추가 (`전체`, `추천 문서`)
- [x] `src/data/filters.ts` — `noteViewModeOptions` 추가 (`grid`, `list`)
- [x] `src/data/filters.ts` — `noteListContent` 추가 (`총`, `개의 문서`, 정렬 aria label, 페이지네이션 label, CTA label, 상세 CTA label)
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 2: NoteListSidebar 구현

**Files:**
- Create: NoteListSidebar component under the note components directory
- Modify: `src/pages/TechnicalNotesPage.tsx`

컴포넌트 책임:
- 카테고리 count 목록
- 기술 태그 체크박스 목록
- 추천 여부 필터
- 데이터 import 없이 props만 사용

- [x] `NoteListSidebarProps` 정의
- [x] `SlidersHorizontal`, `ChevronDown` 아이콘 import
- [x] 프로젝트 사이드바와 같은 다크 패널 스타일 적용
- [x] 카테고리 버튼 목록 구현
- [x] 태그 체크박스 목록 구현
- [x] 추천 여부 버튼 또는 라디오 목록 구현
- [x] `TechnicalNotesPage`에서 count 계산 후 props 전달
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 3: NoteListToolbar 구현

**Files:**
- Create: NoteListToolbar component under the note components directory
- Modify: `src/pages/TechnicalNotesPage.tsx`

컴포넌트 책임:
- `총 N개의 문서`
- 정렬 select
- grid/list 토글 버튼

- [x] `NoteListToolbarProps` 정의
- [x] `Grid2X2`, `List` 아이콘 import
- [x] `noteSortOptions`를 props로 받아 select 렌더링
- [x] grid/list 토글 버튼에 `aria-pressed` 제공
- [x] `TechnicalNotesPage`에 `sort`, `viewMode` state 추가
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 4: 기술 노트 필터/정렬 로직 재구성

**Files:**
- Modify: `src/pages/TechnicalNotesPage.tsx`
- Optional modify: `src/utils/noteFilters.ts`

구현 원칙:
- 페이지 컴포넌트만 `technicalNotes`, `filters` 데이터를 import한다.
- 필터 계산 결과를 컴포넌트에 props로 전달한다.
- 초기 카테고리 필터는 `"all"`로 두어 전체 기술 문서를 먼저 보여준다.

- [x] `filters` state를 `NoteFilterState`로 변경
- [x] 상단 `FilterPills`는 제거하거나 모바일 보조 UI로만 유지
- [x] 카테고리 필터 구현
- [x] 태그 다중 선택 필터 구현
- [x] 추천 여부 필터 구현
- [x] 정렬 함수 구현 (`latest`, `featured`, `readingTime`)
- [x] `useMemo`로 `filteredNotes`, `sortedNotes`, `visibleNotes` 계산
- [x] 빈 상태는 기존 `EmptyState` 유지하되 다크 배경에서 읽히는지 확인
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 5: NoteCard / NoteGrid 스타일 수정

**Files:**
- Modify: `src/components/note/NoteCard.tsx`
- Modify: `src/components/note/NoteGrid.tsx`

카드 목표:
- 프로젝트 카드처럼 어두운 페이지 위 흰색 카드
- 작은 카테고리 chip
- 썸네일 + 제목 + 2줄 요약 + 태그 + 날짜/읽는 시간 + 문서 보기 CTA

- [x] `NoteCardProps`에 `labels.detailLabel` 추가
- [x] 카드 radius를 `rounded-xl` 이하로 조정
- [x] 썸네일 비율을 `aspect-[16/10]` 기준으로 조정
- [x] 카테고리 배지를 이미지 아래 작은 chip으로 조정
- [x] 요약에 `line-clamp-2` 유지
- [x] 태그 표시 개수를 최대 6개로 조정
- [x] 날짜/읽는 시간 메타를 하단 고정 영역으로 정리
- [x] `"문서 보기"` CTA 버튼 추가
- [x] `NoteGrid`에 `viewMode?: NoteViewMode` prop 추가
- [x] grid 모드: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- [x] list 모드: 1열 가로 카드 또는 초기 버전에서는 grid와 동일한 카드 폭으로 구현
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 6: NotePagination 구현

**Files:**
- Create: NotePagination component under the note components directory
- Modify: `src/pages/TechnicalNotesPage.tsx`

초기 구현:
- 프로젝트 페이지네이션과 같은 UI를 사용하되 labels는 `noteListContent`에서 받는다.
- 현재 데이터가 `pageSize` 이하이면 렌더링하지 않는다.

- [x] `NotePaginationProps` 정의
- [x] 이전/다음/번호 버튼 렌더링
- [x] 숫자 페이지네이션만 남기고 하단 outline CTA 제거
- [x] `TechnicalNotesPage`에서 `currentPage` state 연결
- [x] 필터/정렬 변경 시 `currentPage`를 1로 초기화
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 7: TechnicalNotesPage 전체 레이아웃 조립

**Files:**
- Modify: `src/pages/TechnicalNotesPage.tsx`

최종 구조:

```tsx
<PageLayout {...pageChrome}>
  <PageHero {...pageHeroes.technicalNotes} />
  <section className="bg-brand-dark pb-16 text-white lg:pb-20">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="flex gap-6">
        <NoteListSidebar ... />
        <main className="min-w-0 flex-1">
          <NoteListToolbar ... />
          <NoteGrid ... />
          <NotePagination ... />
        </main>
      </div>
    </div>
  </section>
</PageLayout>
```

- [x] 라이트 배경 섹션을 다크 배경 섹션으로 변경
- [x] `SectionHeader`와 상단 `FilterPills` 제거 또는 모바일 전용으로 조정
- [x] 사이드바 + main 2열 레이아웃 적용
- [x] 기본 필터 `"all"` 적용
- [x] 전체 기술 노트를 볼 수 있도록 카테고리 `"All"` 필터 유지
- [x] 모바일에서 사이드바 숨김 및 toolbar/카드가 겹치지 않는지 확인
- [x] Footer와 목록 섹션 사이 여백/경계 확인
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 8: 검증 및 마무리

**Files:**
- No planned code changes

- [x] 린트 검증: `pnpm lint`
- [x] 타입 검증: `pnpm typecheck`
- [x] 테스트 실행: `pnpm test`
- [x] 콘텐츠 검증: `pnpm check:content`
- [x] 이미지 경로 검증: `pnpm check:image-paths`
- [x] 전체 검증: `pnpm check:all`
- [ ] 브라우저에서 `/technical-notes` 확인
- [ ] 데스크톱 확인: 1440px 이상에서 sidebar + 3열 카드
- [ ] 모바일 확인: 390px 기준에서 hero, toolbar, 1열 카드가 겹치지 않음

---

## Open Decisions

- [x] `/technical-notes` 기본 필터를 전체 목록으로 둘지 결정
- [x] 트러블슈팅 문서만 별도 라우트로 분리할지 여부 결정
- [x] `readingTime` 정렬을 짧은 순으로 할지 긴 순으로 할지 결정
- [x] list view를 실제 가로 카드로 구현할지, 초기에는 토글 자리만 제공할지 결정
