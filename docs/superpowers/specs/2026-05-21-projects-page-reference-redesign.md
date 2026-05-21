# Projects Page Reference Redesign

**Goal:** 프로젝트 목록 페이지를 제공된 레퍼런스 이미지와 동일한 정보 구조로 개선한다. 다크 히어로, 좌측 필터 사이드바, 우측 프로젝트 카드 그리드, 정렬/보기 전환 툴바, 페이지네이션/더 보기 CTA, 하단 기술 스택까지 하나의 프로젝트 탐색 화면으로 구성한다. 카테고리 필터는 사이드바 안에서만 제공하고, 사이드바 위의 중복 카테고리 pill 버튼은 사용하지 않는다.

---

## 현재 차이점

| 영역 | 현재 구현 | 레퍼런스 목표 |
|---|---|---|
| Hero | `PageHero` 기본 다크 히어로 | 좌측 큰 제목 + pill 필터, 우측 3D 아키텍처 비주얼 |
| 필터 | 상단 단일 pill 필터 | 좌측 sticky 필터 패널만 사용 |
| 목록 헤더 | `PROJECT INDEX` 섹션 헤더 | 프로젝트 수, 정렬 select, 그리드/리스트 토글 |
| 카드 | 라이트 카드 3열 | 어두운 페이지 위 흰색 카드, 작은 배지, 태그 2줄, 상세/GitHub 버튼 |
| 프로젝트 수 | 4개 데이터 | 레퍼런스는 6개 카드 기준. 동일 화면 재현 시 데이터 2개 추가 필요 |
| 하단 | 공통 Footer만 표시 | 목록 아래 `더 많은 프로젝트 보기`, 다크 `기술 스택` 섹션, Footer |

---

## 섹션 구성

| # | 영역 | 배경 | 핵심 컴포넌트 |
|---|---|---|---|
| 0 | Header | `bg-brand-dark` | 기존 `Header` 활성 메뉴 스타일 유지 |
| 1 | Projects Hero | `bg-brand-dark` | `PageHero` + `ProjectsHeroVisual` |
| 2 | Project Index | `bg-brand-dark` | `ProjectListSidebar` + `ProjectListToolbar` + `ProjectGrid` |
| 3 | Tech Stack | `bg-brand-dark` | `HomeTechStack` 또는 `ProjectTechStackBand` |
| 4 | Footer | `bg-brand-dark` | 기존 `Footer` |

전체 페이지는 레퍼런스처럼 Hero부터 Footer까지 다크 네이비 배경을 유지한다. 프로젝트 카드 자체는 흰색 배경을 사용해 목록 가독성을 확보한다.

---

## 데이터 모델

### `src/types/project.ts`

**추가 타입:**

```typescript
export type ProjectSortValue = "latest" | "featured" | "name";

export type ProjectViewMode = "grid" | "list";

export type ProjectSidebarFilterGroup = {
  title: string;
  options: {
    label: string;
    value: ProjectFilterValue | ProjectType | string;
    count?: number;
  }[];
};
```

`ProjectFilterValue`는 현재 `"all" | ProjectCategory`만 포함한다. 레퍼런스의 기간, 협업 방식, 기술 필터까지 확장하려면 화면 상태용 타입을 별도로 두는 것이 안전하다.

```typescript
export type ProjectFilterState = {
  category: ProjectFilterValue;
  techStacks: string[];
  period: "all" | "last6Months" | "last1Year" | "over1Year";
  type: "all" | ProjectType;
};
```

### `src/data/filters.ts`

**유지:**
- `projectCategoryFilters`
- `projectTypeFilters`
- `projectSortOptions`

**추가:**
- `projectPeriodFilters`
- `projectSidebarContent`
- `projectViewModeOptions`

`projectSidebarContent`에는 필터 패널의 표시 텍스트만 둔다.

```typescript
export const projectSidebarContent = {
  title: "필터",
  categoryTitle: "카테고리",
  techTitle: "사용 기술",
  periodTitle: "기간",
  typeTitle: "협업 방식",
  moreLabel: "더 보기",
} as const;
```

### `src/data/projects.ts`

현재 프로젝트는 4개다. 레퍼런스의 첫 화면 2행 × 3열을 동일하게 재현하려면 다음 중 하나를 선택한다.

1. 실제로 보여줄 프로젝트 2개를 추가한다.
2. 현재 4개 프로젝트만 유지하고, 그리드는 4개 카드까지만 렌더링한다.

레퍼런스와 동일한 밀도와 페이지네이션을 목표로 하면 2개 추가가 필요하다. 추가 데이터도 반드시 `ProjectCard` 타입을 만족하고, 썸네일은 `public/images/projects/...`에 둔다.

---

## 컴포넌트

### `src/components/hero/ProjectsHeroVisual.tsx` (신규)

- Props 없음 또는 `{ image?: string }`
- 데스크톱에서만 표시: `hidden lg:block`
- 레퍼런스 우측의 3D 서버/아키텍처 이미지를 렌더링한다.
- 실제 비트맵 이미지를 사용할 경우 경로는 `src/data/hero.ts`의 `pageHeroes.projects.visual`에서 관리한다.
- SVG/HTML CSS 다이어그램으로 구현할 경우에도 표시 문구는 넣지 않고, 장식 비주얼만 담당한다.

### `src/components/project/ProjectListSidebar.tsx` (신규)

Props:

```typescript
type ProjectListSidebarProps = {
  filters: ProjectFilterState;
  categoryOptions: readonly FilterOption<ProjectFilterValue>[];
  techOptions: { label: string; value: string; count: number }[];
  periodOptions: readonly FilterOption<ProjectFilterState["period"]>[];
  typeOptions: readonly FilterOption<ProjectFilterState["type"]>[];
  counts: {
    total: number;
    byCategory: Record<string, number>;
    byTech: Record<string, number>;
    byType: Record<string, number>;
  };
  onChange: (filters: ProjectFilterState) => void;
};
```

렌더링:
- 최상위: `sticky top-24 hidden w-56 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] lg:block`
- 상단: `"필터"` + `SlidersHorizontal` 아이콘 버튼
- 카테고리: 레퍼런스처럼 count가 오른쪽에 붙는 세로 버튼 목록
- 사용 기술: 체크박스 목록, 기본 6개 표시 후 `"더 보기"` 버튼
- 기간: 라디오 버튼
- 협업 방식: 세로 버튼 목록

### `src/components/project/ProjectListToolbar.tsx` (신규)

Props:

```typescript
type ProjectListToolbarProps = {
  totalCount: number;
  sort: ProjectSortValue;
  viewMode: ProjectViewMode;
  onSortChange: (sort: ProjectSortValue) => void;
  onViewModeChange: (mode: ProjectViewMode) => void;
};
```

렌더링:
- 좌측: `총 {totalCount}개의 프로젝트`
- 우측: 정렬 select + 그리드/리스트 아이콘 토글
- 아이콘: `Grid2X2`, `List`, `ChevronDown`
- 모바일에서는 toolbar가 카드 위 한 줄로 접히고, 사이드바 필터는 상단 pill 중심으로 대체한다.

### `src/components/project/ProjectCard.tsx` (수정)

레퍼런스 카드에 맞춰 다음을 조정한다.

- 카드 radius: `rounded-lg` 또는 `rounded-xl`
- 카드 padding: 이미지 아래 본문 `p-4`
- 썸네일: `aspect-[16/10] rounded-md`
- 배지: 이미지 아래 작은 blue chip
- 제목: `text-xl font-bold text-slate-950`
- 요약: 2줄 높이에 맞추는 `line-clamp-2`
- 기술 태그: 최대 8개까지 작은 아이콘/점 기반 태그
- 버튼: `"상세 보기"` primary, `"GitHub"` outline, 둘 다 같은 높이
- 외부 GitHub 링크가 없으면 버튼을 렌더링하지 않는다.

### `src/components/project/ProjectGrid.tsx` (수정)

Props에 `viewMode`를 추가한다.

```typescript
type ProjectGridProps = {
  projects: ProjectCardData[];
  viewMode?: ProjectViewMode;
};
```

- `grid`: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- `list`: 1열 가로 카드 레이아웃. 레퍼런스에서는 토글 자리만 우선 제공해도 된다.

### `src/components/project/ProjectPagination.tsx` (신규)

레퍼런스의 숫자 페이지네이션과 하단 CTA를 분리한다.

- 숫자 버튼: 이전 / 1 / 2 / 다음
- CTA: `"더 많은 프로젝트 보기"` + `ArrowDown`
- 실제 페이지네이션이 필요 없으면 현재 데이터에서는 장식적 컨트롤 대신 `visibleCount` 기반 더 보기로 구현한다.

### `src/components/project/ProjectTechStackBand.tsx` (선택 신규)

현재 `HomeTechStack`은 라이트 섹션용 플랫 리스트다. 레퍼런스의 다크 미니 카드 그리드를 정확히 맞추려면 별도 컴포넌트를 둔다.

Props:

```typescript
type ProjectTechStackBandProps = {
  groups: TechStackGroup[];
};
```

렌더링:
- `TECH STACK` eyebrow
- `"기술 스택"` title
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`
- 각 그룹은 `border border-white/10 bg-white/[0.04] rounded-lg p-4`
- 그룹 아이콘은 `IconName` 기반 lucide-react 매핑

---

## `src/pages/ProjectsPage.tsx` 구조

```
PageLayout
  PageHero visualSlot=<ProjectsHeroVisual />

  section bg-brand-dark
    div layout.container
      div flex gap-6
        ProjectListSidebar
        main flex-1
          ProjectListToolbar
          ProjectGrid projects={visibleProjects} viewMode={viewMode}
          ProjectPagination

  section bg-brand-dark
    ProjectTechStackBand groups={techStackGroups}
```

필터 계산은 페이지에서 수행한다. 공통 컴포넌트는 `src/data`를 import하지 않는다.

---

## 필터/정렬 동작

### 필터

- 카테고리 필터는 사이드바 카테고리 목록만 사용한다.
- 사이드바 위 또는 Hero 아래에 같은 역할의 카테고리 pill 버튼을 추가하지 않는다.
- 사용 기술: `project.techStack.some((tag) => selectedTechStacks.includes(tag.name))`
- 기간: 현재 `period` 문자열을 기준으로 정확한 날짜 계산이 어렵다. 초기 구현에서는 `"전체"`만 실제 필터로 적용하고, 다른 옵션은 비활성화하거나 데이터 모델에 `startedAt`, `endedAt`을 추가한 뒤 구현한다.
- 협업 방식: `project.type`

### 정렬

- `latest`: `period` 문자열 정렬은 불안정하므로, 정확한 최신순이 필요하면 `ProjectCard`에 `sortOrder` 또는 `startedAt`을 추가한다.
- `featured`: `status === "featured"` 우선
- `name`: `title.localeCompare`

---

## 반응형

- `lg` 미만: 사이드바 숨김, 정렬 toolbar + 1열/2열 카드
- `lg` 이상: 좌측 필터 패널 고정, 우측 3열 카드
- 히어로 우측 비주얼은 `lg` 이상에서만 표시
- 기술 스택은 모바일 1열, 태블릿 2열, 데스크톱 6열

---

## import 경계

| import | 방향 | 허용 |
|---|---|---|
| `ProjectsPage` → `projects`, `filters`, `techStackGroups` | pages → data | ✅ |
| `ProjectsPage` → `Project*`, `PageHero` | pages → components | ✅ |
| `Project*` → `ProjectCard`, `ProjectFilterState`, `TechStackGroup` | components → types | ✅ |
| `Project*` → `button`, `surface`, `layout` | components → styles/constants | ✅ |
| `Project*` → `projects` | components → data | ❌ |

---

## 구현 노트

- 레퍼런스 이미지 자체는 Git에 포함하지 않는다.
- 화면 표시 텍스트는 `src/data/filters.ts`, `src/data/hero.ts`, `src/data/techStack.ts`에서 관리한다.
- `ProjectListSidebar`의 count는 페이지에서 `projects` 기반으로 계산해 props로 전달한다.
- `ProjectCard`는 상세 페이지 링크에 `Link`, GitHub 링크에 `<a target="_blank">`를 사용한다.
- `pnpm check:all` 전에 이미지 경로 검사가 통과하도록 신규 썸네일을 반드시 추가한다.
