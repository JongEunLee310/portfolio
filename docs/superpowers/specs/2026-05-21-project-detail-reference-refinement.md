# Project Detail Reference Refinement

**Goal:** 프로젝트 상세 화면을 제공된 레퍼런스 이미지처럼 정보 밀도 높은 케이스 스터디 페이지로 개선한다. 현재 상세 페이지의 데이터 기반 구조는 유지하되, 히어로, 개요, 문제/해결, 아키텍처, 기능, 스크린샷, 기술 스택, 기여, 성과, 트러블슈팅, 회고를 한 화면에서 더 선명하게 읽히는 시각 구조로 재배치한다.

---

## 현재 차이점

| 영역 | 현재 구현 | 개선 목표 |
|---|---|---|
| Hero | 프로젝트명, 요약, 메타 카드, 태그, 링크, 대표 이미지 | 뒤로가기 링크, 카테고리 배지, 큰 제목, 기간/역할/팀 규모 아이콘 메타, 핵심 성과 배지, CTA 2개, 우측 대시보드 목업 |
| 개요 | 단독 카드 | 섹션 제목 + 설명 + 우측 태그 pill로 간결하게 표시 |
| 문제/해결 | 작은 카드 2개 | 같은 높이의 2열 카드, 체크 아이콘 목록, 문제와 해결의 대비를 강화 |
| 아키텍처 | 노드 카드 그리드 | 넓은 플로우 다이어그램 카드, 그룹/노드/연결선/연결 라벨 중심 |
| 핵심 기능 | 3열 기능 카드 | 레퍼런스처럼 5개 내외의 작고 균일한 기능 카드 |
| 스크린샷 | 2열 큰 카드 | 4열 썸네일 갤러리 + 확대 액션 자리 |
| 기술 스택 | 태그 나열 | Backend, Infra & DevOps, Data & AI 등 그룹별 목록 |
| 기여 | 카드 목록 | 날짜 축이 있는 타임라인 |
| 성과 | 다크 섹션의 3열 카드 | 다크 밴드 안 숫자 중심 5개 KPI 카드 |
| 하단 | 트러블슈팅/링크/회고/배운 점 | 트러블슈팅 캐러셀, 성능 개선 카드, 회고 요약 + 전문 링크 3카드 구성 |

---

## 섹션 구성

| # | 영역 | 배경 | 핵심 컴포넌트 |
|---|---|---|---|
| 0 | Header | `bg-brand-dark` | 기존 `Header` 활성 메뉴 유지 |
| 1 | Detail Hero | `bg-brand-dark` | `ProjectDetailHero` |
| 2 | Overview + Narrative | `bg-slate-50` | `ProjectOverviewSection`, `ProjectNarrativeCard` |
| 3 | Architecture | `bg-slate-50` | `ProjectArchitectureFlowSection` |
| 4 | Features | `bg-slate-50` | `ProjectFeatureStripSection` |
| 5 | Screenshots | `bg-slate-50` | `ProjectScreenshotGallerySection` |
| 6 | Stack + Timeline | `bg-slate-50` | `ProjectTechStackGroupedSection`, `ProjectContributionTimelineSection` |
| 7 | Metrics | `bg-brand-dark` | `ProjectResultsSection` |
| 8 | Closing Cards | `bg-slate-50` | `ProjectTroubleshootingSection`, `ProjectPerformanceImprovementSection`, `ProjectRetrospectiveSection` |
| 9 | Footer | `bg-brand-dark` | 기존 `Footer` |

섹션 순서는 ADR-004의 Project Detail 규칙을 따른다. 구현 중 텍스트는 컴포넌트에 하드코딩하지 않고 `src/data/projectDetails.ts`와 `src/constants/projectDetail.ts`에서 관리한다.

---

## 데이터 모델

### `src/types/project.ts`

현재 `ProjectDetail`은 기본 상세 콘텐츠를 포함한다. 레퍼런스 밀도를 맞추려면 아래 필드를 선택적으로 확장한다.

```typescript
export type ProjectHeroHighlight = {
  label: string;
  value: string;
  icon?: IconName;
};

export type ProjectTechStackGroup = {
  title: string;
  items: TechTag[];
};

export type ProjectArchitectureGroup = {
  id?: string;
  title: string;
  nodes: ArchitectureNode[];
};

export type ProjectArchitectureConnectionTone = "sync" | "async" | "data";

export type ProjectArchitectureConnection = {
  from: string;
  to: string;
  tone: ProjectArchitectureConnectionTone;
  label?: string;
};

export type ProjectArchitectureFlow = {
  title: string;
  description?: string;
  groups: ProjectArchitectureGroup[];
  connections?: ProjectArchitectureConnection[];
  legends?: {
    label: string;
    tone: "solid" | "dashed" | "muted";
  }[];
};

export type ProjectImprovement = {
  title: string;
  description: string;
  result?: string;
  icon: IconName;
};
```

`ProjectDetail` 추가 필드:

```typescript
heroHighlights?: ProjectHeroHighlight[];
architectureFlow?: ProjectArchitectureFlow;
techStackGroups?: ProjectTechStackGroup[];
improvements?: ProjectImprovement[];
```

`ArchitectureNode`는 기존 구조를 유지하되 `id?: string`을 허용한다. 연결선은 `connections[].from/to`가 node id를 참조한다.

`troubleshooting` 항목은 기술 노트 상세로 연결하기 위해 `noteSlug?: string`을 허용한다.

`retrospective`는 회고 전문 문서 연결을 위해 `noteSlug?: string`을 허용한다.

기존 `architecture`, `techStack`, `performance`는 유지한다. 신규 필드가 없을 때는 현재 렌더링 구조로 fallback한다.

### `src/constants/projectDetail.ts`

표시 라벨과 CTA 문구는 상수로 관리한다.

추가 후보:

- `backToProjects`: `"프로젝트 목록으로 돌아가기"`
- `hero.liveDemo`: `"Live Demo"`
- `hero.github`: `"GitHub 보기"`
- `sections.improvements.title`: `"성능 개선"`
- `sections.retrospective.title`: `"회고"`
- `screenshots.zoomLabel`: `"스크린샷 확대"`

### `src/data/projectDetails.ts`

레퍼런스와 가까운 첫 번째 상세 화면을 만들려면 `ai-devops-orchestration-platform`부터 데이터를 보강한다.

- `heroHighlights`: `"배포 자동화 90% 이상 시간 절감"`, `"장애 탐지 정확도 95%+"`, `"운영 비용 40% 절감"`처럼 히어로에 노출할 짧은 성과
- `performance`: 다크 KPI 밴드에 들어갈 4~5개 숫자 중심 지표
- `architectureFlow`: 사용자/외부, API Gateway, 마이크로서비스, 데이터 & AI, 인프라/외부 연동 그룹
- `architectureFlow.connections`: Web UI/CLI/API Clients에서 Gateway로 들어오는 요청, Gateway에서 서비스로 분기되는 요청, 서비스 내부 비동기 이벤트, 데이터 저장/조회 흐름
- `techStackGroups`: Backend, Infra & DevOps, Data & AI, Messaging & Etc 등 그룹
- `improvements`: DB 쿼리 최적화, 캐시 전략, 비동기 처리 확대 등
- `screenshots`: 레퍼런스처럼 4개 이상이면 갤러리 밀도가 살아난다.
- `troubleshooting`: 캐러셀로 노출할 수 있도록 4개 이상까지 확장하고, 연결 가능한 항목에는 `noteSlug`를 둔다.
- `retrospective.noteSlug`: 회고 전문 기술 노트 slug를 둔다.

### `src/data/technicalNotes.ts`, `src/data/noteDetails.ts`

트러블슈팅과 회고 전문 링크가 실제 페이지로 이동해야 하므로, 연결되는 `noteSlug`는 `technicalNotes`와 `noteDetails`에 모두 존재해야 한다.

AI DevOps 상세에서 추가한 대표 문서:

- `ai-log-analysis-latency`
- `metric-cardinality-troubleshooting`
- `ai-devops-retrospective`

기존 목록 노트 중 상세 페이지가 필요한 항목:

- `async-pipeline-transition`
- `rabbitmq-event-topology`

---

## 컴포넌트

### `src/components/project/ProjectDetailSections.tsx` 분리

현재 파일이 상세 섹션 대부분을 포함한다. 이번 변경에서는 파일이 과도하게 커질 수 있으므로, 아래처럼 상세 페이지 전용 컴포넌트를 분리하는 것을 권장한다.

| 신규 파일 | 책임 |
|---|---|
| ProjectDetailHero.tsx | 히어로 전용 |
| ProjectArchitectureFlowSection.tsx | 넓은 아키텍처 플로우 |
| ProjectFeatureStripSection.tsx | 작고 균일한 기능 카드 |
| ProjectScreenshotGallerySection.tsx | 썸네일 갤러리 |
| ProjectTechStackGroupedSection.tsx | 그룹형 기술 스택 |
| ProjectContributionTimelineSection.tsx | 날짜 타임라인 |
| ProjectClosingCardsSection.tsx | 트러블슈팅/개선/회고 3카드 |

분리 후에도 공통 컴포넌트는 `src/data`를 import하지 않는다.

### `ProjectDetailHero`

Props:

```typescript
type ProjectDetailHeroProps = {
  project: ProjectDetail;
};
```

렌더링:

- 최상단 뒤로가기 링크: `PATHS.projects`
- 카테고리 배지
- `h1`: 프로젝트명
- 요약 문장
- 기간/역할/팀 규모 메타: `Calendar`, `User`, `Users` 아이콘
- `heroHighlights` 3개 이하를 작은 다크 배지로 표시
- CTA: Demo가 있으면 `Live Demo`, GitHub가 있으면 `GitHub 보기`
- 우측 이미지는 `heroImage`, `aspect-[16/10]`, `rounded-xl`, `shadow-glow`

### `ProjectOverviewSection`

- 카드 대신 레퍼런스처럼 본문 첫 줄 영역으로 간결하게 구성한다.
- 좌측: `프로젝트 개요` 제목과 overview
- 우측: 대표 기술/카테고리 pill 4개 이하
- 모바일에서는 세로 배치

### `ProjectNarrativeCard`

- 문제 정의와 해결 방향은 같은 컴포넌트를 유지하되 다음 스타일로 조정한다.
- `rounded-lg`, `border-slate-200`, `shadow-card`
- 목록 아이콘은 파란 체크 아이콘을 사용한다.
- 두 카드가 데스크톱에서 같은 높이로 보이도록 `h-full` 적용

### `ProjectArchitectureFlowSection`

목표:

- 레퍼런스처럼 하나의 넓은 흰색 카드 안에서 그룹별 노드를 보여준다.
- 데이터는 `architectureFlow`가 있으면 사용하고, 없으면 기존 `architecture.nodes`를 1행 노드 카드로 fallback한다.
- group과 node에는 optional id를 둔다.
- `connections`를 이용해 그룹 사이 흐름과 그룹 내부 흐름을 함께 표시한다.
- 연결 종류는 `sync`, `async`, `data`로 구분하고 legend와 같은 시각 언어를 사용한다.
- 노드 카드는 작게 유지해 여백을 확보한다.
- 표시 텍스트는 모두 데이터에서 온다.

### `ProjectFeatureStripSection`

- 5개 내외의 기능 카드를 한 줄 또는 2줄 그리드로 배치한다.
- 카드 높이와 아이콘 크기를 고정해 레이아웃 흔들림을 줄인다.
- `features` 데이터가 5개 미만이어도 비어 있는 카드나 더미 텍스트를 만들지 않는다.

### `ProjectScreenshotGallerySection`

- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- 각 썸네일은 `aspect-[16/9]`
- 제목은 이미지 아래 짧게 표시
- 확대 버튼은 아이콘 버튼으로 제공하되, 초기 구현에서는 새 탭 링크 또는 모달 중 하나를 선택한다.
- 모달을 구현하면 `Escape`, overlay click, focus return을 처리한다.

### `ProjectTechStackGroupedSection`

- `techStackGroups`가 있으면 그룹형 목록을 사용한다.
- 없으면 기존 `techStack` 태그 목록으로 fallback한다.
- 그룹 카드에는 제목과 기술 목록을 표시한다.
- 기술 아이콘이 없으면 텍스트만 표시한다.

### `ProjectContributionTimelineSection`

- `contributions`를 날짜순으로 가로 타임라인에 배치한다.
- 좁은 화면에서는 세로 타임라인으로 바꾼다.
- 날짜, 제목, 설명은 모두 데이터에서 온다.

### `ProjectResultsSection`

- 다크 밴드 안에 숫자 중심 KPI 카드를 배치한다.
- `performance`를 4~5개까지 자연스럽게 보여준다.
- 카드 내부는 아이콘, value, label 순서로 강조한다.

### `ProjectClosingCardsSection`

레퍼런스 하단의 3카드 구성을 만든다.

1. 트러블슈팅: `troubleshooting` 캐러셀
2. 성능 개선: `improvements` 서브카드 목록
3. 회고: `retrospective` 서브카드 + 우측 CTA

트러블슈팅은 이전/다음 버튼과 dot navigation을 제공한다. 현재 보이는 트러블슈팅 항목에 `noteSlug`가 있으면 카드 본문 클릭 시 기술 노트 상세로 이동한다.

회고 카드에는 `RETROSPECTIVE` eyebrow, 요약, 배운 점/개선 계획 일부, 기술 태그, 우측 정렬 CTA를 표시한다. `retrospective.noteSlug`가 있으면 `회고 전문 읽기`로 기술 노트 상세에 연결한다.

---

## `src/pages/ProjectDetailPage.tsx` 구조

```
PageLayout
  ProjectDetailHero

  section bg-slate-50
    ProjectOverviewSection
    grid problem/solution
    ProjectArchitectureFlowSection
    ProjectFeatureStripSection
    ProjectScreenshotGallerySection
    grid techStack/timeline

  ProjectResultsSection

  section bg-slate-50
    ProjectClosingCardsSection
```

페이지 컴포넌트는 `projectDetails`를 import하고, 렌더링 컴포넌트에는 `project` 또는 섹션별 데이터만 props로 전달한다.

---

## 반응형

- Desktop: 히어로 2열, 문제/해결 2열, 아키텍처 full-width, 기능 5열, 스크린샷 4열, 기술/기여 2열, 하단 3열
- Tablet: 히어로 1열 또는 2열 유지, 기능/스크린샷 2열
- Mobile: 모든 섹션 1열, 히어로 CTA는 세로 또는 2개 버튼 균등 폭, 아키텍처 연결선은 숨기고 카드 목록으로 표시

텍스트는 카드 내부에서 줄바꿈되어야 하며, 버튼/배지/카드 제목이 부모 영역을 넘치지 않아야 한다.

---

## 접근성

- 뒤로가기 링크는 명확한 텍스트를 제공한다.
- CTA는 `target="_blank"` 사용 시 `rel="noreferrer"`를 유지한다.
- 스크린샷 이미지 alt는 프로젝트명과 화면명을 포함한다.
- 확대 버튼은 `aria-label`을 제공한다.
- 타임라인은 시각 장식과 별개로 DOM 순서만으로 날짜 흐름을 읽을 수 있어야 한다.
- 아키텍처 연결선은 장식이므로 스크린리더에 노출하지 않는다.

---

## 구현 노트

- 화면 표시 텍스트는 `src/data/projectDetails.ts` 또는 `src/constants/projectDetail.ts`에 둔다.
- `src/components`에서 `src/data`를 import하지 않는다.
- `src/data`는 React 컴포넌트를 import하지 않는다.
- 기존 `ProjectDetail` 데이터가 부족한 프로젝트는 fallback 렌더링을 제공한다.
- SVG/이미지 경로를 추가하면 `public/images/projects/...` 아래에 두고 `/images/...` 절대 경로를 사용한다.
- 최종 검증은 `pnpm check:all`로 수행한다.
