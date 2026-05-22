# Troubleshooting Notes Project Style List

**Goal:** 트러블슈팅 문서 목록을 프로젝트 목록 페이지와 동일한 탐색 경험으로 정리한다. 다크 히어로, 좌측 필터 사이드바, 우측 카드 그리드, 정렬/보기 전환 툴바, 페이지네이션을 기술 노트 목록에 맞게 재사용 가능한 패턴으로 적용한다. 표시 텍스트와 필터 옵션은 데이터 파일에서 관리하고, 컴포넌트는 props 기반 렌더링만 담당한다.

---

## 현재 차이점

| 영역 | 현재 구현 | 목표 |
|---|---|---|
| 페이지 배경 | Hero 이후 라이트 배경 | 프로젝트 목록처럼 Hero부터 목록까지 다크 네이비 배경 |
| 필터 | 상단 `FilterPills` 단일 카테고리 필터 | 좌측 sticky 필터 사이드바 중심 |
| 목록 헤더 | `SectionHeader` + 필터 pill | 총 문서 수, 정렬 select, 그리드/리스트 토글 툴바 |
| 카드 | 단순 라이트 카드 3열 | 프로젝트 카드와 동일한 밀도, 썸네일, 배지, 태그, 날짜/읽는 시간, 상세 CTA |
| 페이지네이션 | 없음 | 프로젝트 목록과 같은 숫자 페이지네이션 또는 더 보기 CTA |
| 트러블슈팅 집중도 | 전체 기술 노트와 동일한 목록 | 기본 진입은 트러블슈팅 문서를 강조하되 전체 기술 노트 탐색 가능 |

---

## 섹션 구성

| # | 영역 | 배경 | 핵심 컴포넌트 |
|---|---|---|---|
| 0 | Header | `bg-brand-dark` | 기존 `Header` |
| 1 | Technical Notes Hero | `bg-brand-dark` | `PageHero` |
| 2 | Troubleshooting Note Index | `bg-brand-dark` | `NoteListSidebar` + `NoteListToolbar` + `NoteGrid` |
| 3 | Footer | `bg-brand-dark` | 기존 `Footer` |

프로젝트 목록과 동일한 화면 리듬을 우선한다. 트러블슈팅 문서 목록이라는 맥락은 사이드바 라벨과 카드 CTA에서 드러내고, 컴포넌트 이름은 기술 노트 전체에 재사용 가능하도록 `Note*`를 사용한다.

---

## 데이터 모델

### `src/types/note.ts`

**추가 타입:**

```typescript
export type NoteSortValue = "latest" | "featured" | "readingTime";

export type NoteViewMode = "grid" | "list";

export type NoteFilterState = {
  category: NoteFilterValue;
  tags: string[];
  featured: "all" | "featured";
};
```

현재 `NoteFilterValue`에는 `troubleshooting`이 포함되어 있으므로, 사이드바에서 트러블슈팅 문서만 따로 탐색할 수 있다. 기본 필터값은 `"all"`로 두어 `/technical-notes` 진입 시 전체 기술 문서를 먼저 노출한다.

### `src/data/filters.ts`

**유지:**
- `noteCategoryFilters`
- `noteFilterContent`
- `noteSortOptions`

**추가:**
- `noteSidebarContent`
- `noteFeaturedFilters`
- `noteViewModeOptions`
- `noteListContent`

예시:

```typescript
export const noteSidebarContent = {
  title: "필터",
  categoryTitle: "문서 유형",
  tagTitle: "기술 태그",
  featuredTitle: "추천 여부",
  moreLabel: "더 보기",
} as const;

export const noteListContent = {
  countPrefix: "총",
  countSuffix: "개의 문서",
  sortAriaLabel: "기술 노트 정렬",
  previousPageLabel: "이전 페이지",
  nextPageLabel: "다음 페이지",
  detailLabel: "문서 보기",
} as const;
```

표시 텍스트는 컴포넌트에 직접 쓰지 않는다.

---

## 컴포넌트

### NoteListSidebar (신규)

Props:

```typescript
type NoteListSidebarProps = {
  content: {
    title: string;
    categoryTitle: string;
    tagTitle: string;
    featuredTitle: string;
    moreLabel: string;
  };
  filters: NoteFilterState;
  categoryOptions: readonly FilterOption<NoteFilterValue>[];
  tagOptions: { label: string; value: string; count: number }[];
  featuredOptions: readonly FilterOption<NoteFilterState["featured"]>[];
  counts: {
    byCategory: Record<string, number>;
    byFeatured: Record<string, number>;
  };
  onChange: (filters: NoteFilterState) => void;
};
```

렌더링:
- 프로젝트 `ProjectListSidebar`와 같은 다크 패널 스타일을 사용한다.
- 카테고리 목록은 count를 오른쪽에 표시한다.
- 태그는 체크박스 목록으로 표시하고 기본 6개만 노출한다.
- 추천 여부는 `"전체"`, `"추천 문서"` 라디오 또는 버튼 목록으로 제공한다.
- 컴포넌트는 `src/data`를 import하지 않는다.

### NoteListToolbar (신규)

Props:

```typescript
type NoteListToolbarProps = {
  content: {
    countPrefix: string;
    countSuffix: string;
    sortAriaLabel: string;
  };
  totalCount: number;
  sort: NoteSortValue;
  sortOptions: readonly { label: string; value: NoteSortValue }[];
  viewMode: NoteViewMode;
  viewModeOptions: readonly { label: string; value: NoteViewMode }[];
  onSortChange: (sort: NoteSortValue) => void;
  onViewModeChange: (mode: NoteViewMode) => void;
};
```

렌더링:
- 좌측: `총 {totalCount}개의 문서`
- 우측: 정렬 select + 그리드/리스트 토글
- 아이콘은 프로젝트 툴바와 동일하게 `Grid2X2`, `List`를 사용한다.

### `src/components/note/NoteCard.tsx` (수정)

프로젝트 카드와 같은 정보 밀도로 조정한다.

- 카드 radius: `rounded-xl` 이하
- 썸네일: `aspect-[16/10] rounded-md`
- 배지: 카테고리 blue chip
- 제목: `text-xl font-bold text-slate-950`
- 요약: 2줄 높이 유지
- 태그: 최대 6개까지 표시
- 메타: 날짜와 읽는 시간은 하단에 고정
- CTA: `noteListContent.detailLabel`을 받아 `"문서 보기"` 버튼 렌더링

### `src/components/note/NoteGrid.tsx` (수정)

Props에 `viewMode`, `labels`를 추가한다.

```typescript
type NoteGridProps = {
  notes: TechnicalNoteCard[];
  labels: {
    detailLabel: string;
  };
  viewMode?: NoteViewMode;
};
```

- `grid`: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- `list`: 1열 가로 카드. 초기 구현에서는 프로젝트 목록과 동일하게 토글 동작만 먼저 연결해도 된다.

### NotePagination (신규)

프로젝트 `ProjectPagination`과 동일한 구조를 기술 노트용 labels로 분리한다.

- 이전/다음/번호 버튼
- 숫자 페이지네이션만 사용하고 별도 더 보기 CTA는 렌더링하지 않는다.
- 총 문서 수가 `pageSize` 이하이면 렌더링하지 않는다.

---

## `src/pages/TechnicalNotesPage.tsx` 구조

```
PageLayout
  PageHero

  section bg-brand-dark
    div layout.container
      div flex gap-6
        NoteListSidebar
        main flex-1
          NoteListToolbar
          NoteGrid notes={visibleNotes} viewMode={viewMode}
          NotePagination
```

필터와 정렬 계산은 페이지에서 수행한다. 공통 컴포넌트는 `src/data`를 import하지 않는다.

---

## 필터/정렬 동작

### 기본 필터

- `/technical-notes` 진입 시 전체 기술 문서를 먼저 볼 수 있도록 초기 `filters.category`는 `"all"`로 둔다.
- 카테고리 사이드바에서 `"All"`을 선택하면 전체 기술 노트를 볼 수 있다.
- 기존 `/technical-notes` 라우트만 유지하고 별도 `/troubleshooting` 라우트는 만들지 않는다.

### 필터

- 카테고리: `matchesNoteFilter(note, filters.category)`를 사용하거나 동일한 규칙을 페이지 내부에서 적용한다.
- 태그: `note.tags.some((tag) => filters.tags.includes(tag.name))`
- 추천 여부: `filters.featured === "featured"`이면 `note.featured === true`

### 정렬

- `latest`: `date` 문자열을 날짜로 파싱해 최신순 정렬한다. 파싱이 불안정하면 `sortOrder` 또는 ISO 날짜 필드 추가를 별도 결정한다.
- `featured`: `featured === true` 우선, 그 다음 최신순
- `readingTime`: 읽는 시간 숫자를 추출해 짧은 순 또는 긴 순 중 하나로 정한다. 초기 구현은 짧은 순을 기본으로 한다.

---

## 반응형

- `lg` 미만: 사이드바 숨김, toolbar와 카드 1열/2열
- `lg` 이상: 좌측 필터 패널 고정, 우측 3열 카드
- 카드 텍스트는 모바일에서 줄바꿈되며 버튼 내부 텍스트가 넘치지 않아야 한다.
- 다크 배경 위 빈 상태도 충분한 대비를 가져야 한다.

---

## import 경계

| import | 방향 | 허용 |
|---|---|---|
| `TechnicalNotesPage` → `technicalNotes`, `filters`, `hero` | pages → data | ✅ |
| `TechnicalNotesPage` → `Note*`, `PageHero` | pages → components | ✅ |
| `Note*` → `TechnicalNoteCard`, `NoteFilterState` | components → types | ✅ |
| `Note*` → `PATHS` | components → constants | ✅ |
| `Note*` → `technicalNotes` | components → data | ❌ |

---

## 구현 노트

- 프로젝트 목록 컴포넌트를 그대로 import해 기술 노트에 쓰기보다, 스타일과 상호작용 패턴을 맞춘 `Note*` 컴포넌트를 둔다.
- 표시 문구는 `src/data/filters.ts`에서 관리한다.
- 썸네일 경로는 기존 `src/data/technicalNotes.ts` 값을 사용한다.
- 신규 데이터가 필요하지 않으면 `technicalNotes` 항목 수는 유지한다.
- `FilterPills`와 `SectionHeader`는 기술 노트 목록 화면에서는 제거하거나 모바일 전용 보조 UI로만 사용한다.
