# About Page Redesign

**Goal:** 단순 소개 문구 나열에서, 개발자의 방향성·역할·경력·기술 스택·일하는 방식을 구조적으로 보여주는 자기소개 페이지로 개선한다.

---

## 섹션 구성

| # | eyebrow / title | 배경 | 핵심 컴포넌트 |
|---|---------|------|--------------|
| 0 | — | `bg-brand-dark` | `PageHero` (visualSlot: `AboutArchDiagram`) |
| 1 | PROFILE / 이종은 | `bg-slate-50` | `AboutProfile` |
| 2 | WHAT I BUILD / 역할과 책임 | `bg-white` | `AboutRoleCard` × 4 |
| 3 | CAREER & EDUCATION / 경력 및 교육 | `bg-slate-50` | `AboutTimeline` |
| 4 | TECH STACK / 기술 스택 | `bg-white` | `HomeTechStack` |
| 5 | WORKING STYLE / 일하는 방식 + GROWTH METRICS / 지표로 보는 성장 | `bg-slate-50` | `AboutWorkStyle` + `AboutGrowthMetrics` (2열 반반 배치) |

마지막 섹션은 하나의 배경 밴드 안에서 두 영역을 `lg:grid-cols-2`로 반씩 나누며, 각 영역이 독립적인 `SectionHeader`를 가진다.

---

## 데이터 모델

### `src/types/about.ts`

**추가 타입:**

```typescript
ProfileLink = { label: string; href: string; icon: "Mail" | "Github" | "ExternalLink" }
Role        = { title: string; description: string; icon: IconName; tags?: string[] }
```

**변경:**

- `ProfileInfo`: `links: ProfileLink[]` 추가, `experience: string` 유지
- `Strength` → `Role` rename
- `AboutData.strengths` → `roles: Role[]`
- `AboutData.skills` 제거 (페이지에서 `techStackGroups` 직접 import)
- `AboutData.growthMetrics`, `TimelineItem`, `AboutData.timeline` 유지

### `src/data/about.ts`

**`profile`**

- `links`: email / github / linkedin / gitlab (4개) — `externalLinks` 참조
- `experience`: `"백엔드 개발 1년+"`
- `introduction`: 2개 단락 유지

**`roles`** (4개):
- 백엔드 API 설계 (`Server`) — tags: Spring Boot, FastAPI, Python
- 인프라 / DevOps (`Cloud`) — tags: AWS, Docker, GitHub Actions
- AI 서비스 통합 (`Code2`) — tags: FastAPI, Celery, Python
- 데이터 모델링 (`Database`) — tags: MySQL, PostgreSQL, QueryDSL

**`timeline`** — 경력/교육/부트캠프 항목 (type: `"career"` | `"education"` | `"bootcamp"` | `"project"`)

**`growthMetrics`** (4개):
- 대표 프로젝트 `"4+"`, 기여 기간 `"1년+"`, 핵심 기술 `"15+"`, 커밋/PR `"200+"`

**`workStyle`** — 기존 quote + principles 유지

---

## 컴포넌트

### `src/components/about/AboutArchDiagram.tsx`
- Props: 없음 (정적 UI)
- 렌더링: `surface.darkCard hidden lg:block p-6` — CloudFront/API Gateway 기반 서비스 분기 아키텍처 다이어그램 (HTML/CSS)

다이어그램 구조:
```
[Client/Web] → [Amazon CloudFront] → [Amazon API Gateway]
                                                     ↓
                +--------------------+--------------------+
                ↓                    ↓                    ↓
       [서비스 A (서버리스)]  [서비스 B (컨테이너)]  [서비스 C (비동기 이벤트)]
        - AWS Lambda          - Amazon ECS(Fargate)   - Amazon SQS / EventBridge
        - Amazon DynamoDB     - Amazon Aurora(DB)     - AWS Lambda(배경 작업)
```

구현 방식 (모두 HTML/CSS):
- 상단 entry flow: `grid w-fit grid-cols-[auto_auto_auto_auto_auto]`로 Client/Web, CloudFront, API Gateway를 가로 배치
- API Gateway 바로 아래에만 `↓` 화살표와 세로 연결선을 둔다. CloudFront 아래에는 분기 화살표를 두지 않는다.
- API Gateway 아래 연결선은 3개 서비스 영역으로 수평 분기한다.
- 서비스 영역은 `lg:grid-cols-3`으로 나란히 배치한다.
- 서비스 박스 공통 스타일: `border border-blue-300/30 rounded-lg p-3`
- 서비스명: `font-mono text-xs font-semibold text-blue-300`
- 리소스 목록: `font-mono text-xs text-slate-400`
- 노드 박스 공통 스타일: `rounded border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs font-mono text-blue-300`

### `src/components/about/AboutProfile.tsx`
- Props: `{ profile: ProfileInfo }`
- 렌더링 (`grid lg:grid-cols-[240px_1fr] gap-8 items-stretch`):
  - **좌측** — `<img>` avatar만 (`h-full w-full rounded-2xl object-cover`)
    - `aspect-square` 미사용 — 우측 높이에 맞춰 늘어남
  - **우측** — `flex flex-col justify-between`
    - **위**: intro 단락들 — `text-lg leading-8 text-slate-700`
    - **아래**: info row (`grid grid-cols-5 border-t border-slate-200 pt-5`)
      - 5개 항목 균등 분할, lucide-react 아이콘:
        - 이름 — `User`
        - 직무 — `Briefcase`
        - 경력 — `Clock`
        - 위치 — `MapPin`
        - 이메일 — `Mail`
      - 각 항목: `<div flex flex-col gap-1 min-w-0>`
        - 아이콘+라벨 row: `flex items-center gap-1.5` — icon(`h-3.5 w-3.5 text-slate-400`) + label(`text-xs text-slate-400`)
        - value: `text-sm font-medium text-slate-900 truncate`
        - 이메일 value → `<a href="mailto:...">`

### `src/components/about/AboutRoleCard.tsx`
- Props: `{ role: Role }`
- 렌더링 (`surface.card p-6`): Icon(8×8) → title → description → tags row (optional)
- 아이콘 매핑 (lucide-react): `Server`, `Cloud`, `Code2`, `Database`

### `src/components/about/AboutTimeline.tsx`
- Props: `{ items: TimelineItem[] }`
- 렌더링: 수직 타임라인 (`relative pl-8`)
  - 수직선: `absolute left-3 top-0 h-full w-0.5 bg-slate-200`
  - 각 항목 (`relative mb-8 last:mb-0`):
    - 원형 마커: `absolute -left-[1.375rem] top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white`
    - 상단 row: badge chip + period
    - title / organization / description
  - badge chip: `rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700`
- 단일 수직 흐름, 데이터 순서 그대로

### `src/components/about/AboutWorkStyle.tsx`
- Props: `{ workStyle: WorkStyle }`
- 제목 없음 (페이지 `SectionHeader`가 담당)
- 렌더링: 세로 흐름
  - quote 강조
    - 여는 따옴표만: `<span>` — `text-6xl font-bold leading-none text-blue-600` + `"` (닫는 따옴표 없음)
    - `<blockquote>` — `mt-2 text-2xl font-semibold leading-snug text-slate-900`
  - quote 아래 수직 체크리스트
    - `<ul className="mt-8 flex flex-col gap-3">`
    - 각 항목: `Check` 아이콘(`h-5 w-5 text-blue-600`) + `text-sm text-slate-700`

### `src/components/about/AboutGrowthMetrics.tsx`
- Props: `{ metrics: Metric[] }`
- 제목 없음 (페이지 `SectionHeader`가 담당)
- 렌더링: metrics 2×2 그리드 (`grid grid-cols-2 gap-4`)
  - 각 metric: `surface.card p-5`
    - value: `text-3xl font-bold text-blue-600`
    - label: `mt-1 text-sm font-semibold text-slate-700`
    - description (optional): `mt-0.5 text-xs text-slate-500`

---

## `src/pages/AboutPage.tsx` 구조

```
PageHero visualSlot=<AboutArchDiagram />

Section bg-slate-50                          // PROFILE
  SectionHeader eyebrow="PROFILE" title={profile.name}
  AboutProfile profile={aboutData.profile}

Section bg-white                             // WHAT I BUILD
  SectionHeader eyebrow="WHAT I BUILD" title="역할과 책임"
  grid grid-cols-2 lg:grid-cols-4
    AboutRoleCard × 4

Section bg-slate-50                          // CAREER & EDUCATION
  SectionHeader eyebrow="CAREER & EDUCATION" title="경력 및 교육"
  AboutTimeline items={aboutData.timeline}

Section bg-white                             // TECH STACK
  SectionHeader eyebrow="TECH STACK" title="기술 스택"
  HomeTechStack groups={techStackGroups}

Section bg-slate-50                          // WORKING STYLE + GROWTH METRICS
  div grid lg:grid-cols-2 gap-12
    div
      SectionHeader eyebrow="WORKING STYLE" title="일하는 방식"
      AboutWorkStyle workStyle={aboutData.workStyle}
    div
      SectionHeader eyebrow="GROWTH METRICS" title="지표로 보는 성장"
      AboutGrowthMetrics metrics={aboutData.growthMetrics}
```

---

## import 경계

| import | 방향 | 허용 |
|--------|------|------|
| `AboutPage` → `aboutData`, `techStackGroups` | pages → data | ✅ |
| `AboutPage` → 모든 `About*`, `HomeTechStack` | pages → components | ✅ |
| `About*` → `ProfileLink`, `Role`, `TimelineItem`, `Metric` | components → types | ✅ |

---

## 구현 노트

- `AboutArchDiagram` — 외부 SVG 없이 HTML/CSS, `hidden lg:block`
- `AboutWorkStyle`, `AboutGrowthMetrics` — 제목 없음 (페이지가 `SectionHeader` 주입)
- `surface.card` — `src/styles/classNames.ts`
- lucide-react: `Check`(WorkStyle), `User/Briefcase/Clock/MapPin/Mail`(Profile)
- `AboutTimeline` — 단일 수직 흐름
