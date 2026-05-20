# HomePage 전체 리디자인 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 레퍼런스 이미지 기준으로 HomePage 5개 섹션을 리디자인한다 — 히어로 코드 스니펫, 비대칭 프로젝트 레이아웃, 컴팩트 노트 카드, 기술 스택 플랫 그리드, 3컬럼 푸터.

**Architecture:** (1) `PageHero`에 `visualSlot` prop 추가 + 새 `CodeSnippetBlock`으로 히어로 우측 교체. (2) `HomeFeaturedProjects`로 프로젝트 섹션 교체. (3) 다크 섹션 노트 카드를 `HomeNoteCard` 컴팩트 카드로 교체. (4) `techStackGroups`에 2개 그룹 추가 + `HomeTechStack` 플랫 레이아웃 컴포넌트로 교체. (5) `Footer`를 3컬럼 레이아웃으로 리디자인하고 홈페이지 CTA 섹션 제거.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest

---

## File Structure

**Create:**
- `src/components/hero/CodeSnippetBlock.tsx` — 히어로 우측 코드 스니펫 시각화 카드
- `src/components/project/HomeFeaturedProjects.tsx` — 홈 전용 비대칭 프로젝트 레이아웃
- `src/components/note/HomeNoteCard.tsx` — 다크 섹션용 컴팩트 번호 카드 (케로셀 슬롯)
- `src/components/note/HomeNoteCarousel.tsx` — CSS scroll snap 기반 케로셀 컨테이너 + 이전/다음 버튼
- `src/components/project/HomeTechStack.tsx` — 플랫 카테고리 그리드

**Modify:**
- `src/data/hero.ts` — `HomeHeroCode` 추가, `homeCta` 제거 (Task 5)
- `src/data/techStack.ts` — Messaging & Queue, Observability 그룹 추가 + Backend → General 이름 변경
- `package.json` — `react-icons` 의존성 추가 (Task 4)
- `src/components/hero/PageHero.tsx` — `visualSlot?: React.ReactNode` prop 추가
- `src/components/layout/Footer.tsx` — 로고+태그라인 상단, 페이지 링크 1행 + 연락처 링크 1행 구조로 리디자인
- `src/components/layout/PageLayout.tsx` — `footerTagline` prop 추가, Footer에 navigation 전달
- `src/utils/pageChrome.ts` — `footerTagline` 추가
- `src/pages/HomePage.tsx` — 모든 섹션 교체 적용

**No change:**
- `src/tests/` — 데이터 모델 및 라우트 변경 없으므로 기존 15개 테스트 그대로

---

> Task 3 ~ 5는 Task 1 ~ 2 완료 후 순서대로 진행한다.

---

## Task 1: CodeSnippetBlock 컴포넌트 + Hero 통합

**Files:**
- Modify: `src/data/hero.ts`
- Create: `src/components/hero/CodeSnippetBlock.tsx`
- Modify: `src/components/hero/PageHero.tsx`
- Modify: `src/pages/HomePage.tsx`

### 배경 지식

- `PageHero`는 이미 `lg:grid-cols-2` 레이아웃이다. 오른쪽 컬럼은 현재 `visual?: string` prop으로 받은 SVG를 `<img>`로 렌더링한다.
- `src/styles/classNames.ts`의 `surface.darkCard` = `"rounded-2xl border border-white/10 bg-white/[0.04] shadow-glow"` 를 카드 스타일로 활용한다.
- CLAUDE.md 규칙: 화면 표시 문구(코드 내용)는 컴포넌트에 직접 작성하지 않고 `src/data/hero.ts`에서 관리한다.

---

- [ ] **Step 1: `src/data/hero.ts`에 `HomeHeroCode` 타입과 `homeHeroCode` 상수 추가**

  파일 하단(기존 `homeCta` 아래)에 추가:

  ```typescript
  // 타입 시그니처
  export type HomeHeroCode = {
    filename: string;
    lines: string[];
  };

  // 상수 (Celery 비동기 태스크 코드, 8~10 라인)
  export const homeHeroCode: HomeHeroCode = {
    filename: "pipeline/tasks.py",
    lines: [
      "# 파이프라인 비동기 실행 태스크",
      "@celery.task(bind=True, max_retries=3)",
      "def process_pipeline(self, job_id: str):",
      "    try:",
      '        result = pipeline.execute(job_id)',
      '        metrics.track("pipeline.done", job=job_id)',
      '        return {"status": "ok", "result": result}',
      "    except NetworkError as exc:",
      "        raise self.retry(exc=exc, countdown=60)",
    ],
  };
  ```

- [ ] **Step 2: `src/components/hero/CodeSnippetBlock.tsx` 생성**

  Props 인터페이스:
  ```typescript
  type CodeSnippetBlockProps = {
    filename: string;
    lines: string[];
  };
  ```

  렌더링 책임:
  - 최상위 래퍼: `surface.darkCard` 스타일 + `hidden lg:block` (모바일 숨김)
  - 상단 탭: 좌측 점 3개(빨/노/초 `bg-red-500`, `bg-yellow-500`, `bg-green-500`, 각 `h-3 w-3 rounded-full`), 우측 `filename` 텍스트 (`text-xs text-slate-500`)
  - 코드 영역: `<pre>` 태그 + `font-mono text-sm text-slate-300 leading-7`
  - 각 `line`은 `<code>` 블록 또는 `<div>` 한 줄로 렌더링
  - `#`으로 시작하는 라인: `text-slate-500` (주석 색상)
  - `@`으로 시작하는 라인: `text-blue-400` (데코레이터 색상)
  - 나머지: `text-slate-300`

- [ ] **Step 3: `src/components/hero/PageHero.tsx` 수정 — `visualSlot` prop 추가**

  `PageHeroProps`에 필드 추가:
  ```typescript
  visualSlot?: React.ReactNode;
  ```

  오른쪽 컬럼 렌더링 로직 변경:
  - `visualSlot`이 있으면 해당 노드 렌더링
  - 없고 `visual`이 있으면 기존 `<img>` 렌더링
  - 둘 다 없으면 오른쪽 컬럼 비어있음 (기존 동작 유지)

- [ ] **Step 4: `src/pages/HomePage.tsx` 수정 — `CodeSnippetBlock` 주입**

  추가할 import:
  ```typescript
  import { CodeSnippetBlock } from "@/components/hero/CodeSnippetBlock";
  import { homeCta, homeHeroCode, pageHeroes } from "@/data/hero";
  ```

  `<PageHero>` 호출에 prop 추가:
  ```tsx
  visualSlot={
    <CodeSnippetBlock
      filename={homeHeroCode.filename}
      lines={homeHeroCode.lines}
    />
  }
  ```

- [ ] **Step 5: 테스트 실행 및 확인**

  ```bash
  npm test
  ```

  Expected: `15 tests pass` (content-integrity, image-paths, route-integrity 모두 통과)

- [ ] **Step 6: 커밋**

  ```bash
  git add src/data/hero.ts src/components/hero/CodeSnippetBlock.tsx src/components/hero/PageHero.tsx src/pages/HomePage.tsx
  git commit -m "feat: 홈 히어로 우측 코드 스니펫 블록 추가"
  ```

---

## Task 2: HomeFeaturedProjects 비대칭 레이아웃 컴포넌트

**Files:**
- Create: `src/components/project/HomeFeaturedProjects.tsx`
- Modify: `src/pages/HomePage.tsx`

### 배경 지식

- `src/data/projects.ts`에는 `status: "featured"` 2개(ai-devops-orchestration-platform, halocare), `status: "normal"` 2개(story-tree, smart-farm)가 있다.
- `ProjectCard` 타입은 `src/types/project.ts`에 정의. `slug`, `title`, `summary`, `thumbnail`, `techStack`, `status`, `period`, `links` 필드를 사용한다.
- `surface.darkCard` = `"rounded-2xl border border-white/10 bg-white/[0.04] shadow-glow"` (다크 카드)
- `surface.card` = `"rounded-2xl border border-slate-200 bg-white shadow-card"` (라이트 카드)
- `Badge` 컴포넌트: `variant="dark"` (다크 카드용), `variant="light"` (라이트 카드용)
- `TechTag` 컴포넌트: `tag` prop (`TechTag` 타입)
- `Link` (react-router-dom): 내부 경로에 사용. `ExternalLink` 아이콘 (lucide-react): 외부 링크 버튼에 사용.
- `import` 경계 규칙: `components → data` 방향 금지. `HomeFeaturedProjects`는 props로 데이터만 받는다.

---

- [ ] **Step 1: `src/components/project/HomeFeaturedProjects.tsx` 생성**

  Props 인터페이스:
  ```typescript
  import type { ProjectCard } from "@/types/project";

  type HomeFeaturedProjectsProps = {
    featured: ProjectCard[];  // featured[0]=주 카드, featured[1]=보조 카드
    others: ProjectCard[];
  };
  ```

  **주 카드 (`featured[0]`)** — 좌측 대형, 다크 배경:
  - 래퍼: `surface.darkCard` + 텍스트 흰색
  - `Badge variant="dark"` + `subtitle ?? category.join(" · ")`
  - `title` (xl/2xl 굵은 폰트)
  - `summary` (`text-slate-300`)
  - `techStack.slice(0, 5)` → `<TechTag>` 목록
  - "상세 보기" 버튼 (`Link`, blue), GitHub 버튼 (`<a>`, darkOutline)

  **보조 카드 (`featured[1]`)** — 우측 중형, 라이트 배경:
  - 래퍼: `surface.card`
  - `<img src={thumbnail}>` (16/10 비율)
  - `Badge variant="light"`
  - `title`, `summary`
  - `techStack.slice(0, 4)` → `<TechTag>` 목록
  - "상세 보기" 버튼

  **그리드 레이아웃**:
  - 주 카드 + 보조 카드를 `lg:grid-cols-3` 에서 주 카드 `lg:col-span-2`, 보조 카드 `lg:col-span-1`로 배치

  **"기타 프로젝트" 서브섹션 (`others`)**:
  - `<h3>기타 프로젝트</h3>` 레이블 (`mt-12 text-lg font-bold text-slate-900`)
  - `grid-cols-1 md:grid-cols-2` 소형 카드 row
  - 소형 카드: 좌측 썸네일(고정 크기 `w-24 h-16`), 우측 제목 + 기간 + `techStack.slice(0, 3)` + "상세 보기" 텍스트 링크

- [ ] **Step 2: `src/pages/HomePage.tsx` 수정**

  추가할 import:
  ```typescript
  import { HomeFeaturedProjects } from "@/components/project/HomeFeaturedProjects";
  ```

  제거할 import:
  ```typescript
  import { ProjectGrid } from "@/components/project/ProjectGrid";
  ```

  컴포넌트 내부 변수 추가:
  ```typescript
  const normalProjects = projects.filter((p) => p.status === "normal");
  ```

  섹션 교체: `<ProjectGrid projects={featuredProjects} />` →
  ```tsx
  <HomeFeaturedProjects featured={featuredProjects} others={normalProjects} />
  ```

- [ ] **Step 3: 테스트 실행 및 확인**

  ```bash
  npm test
  ```

  Expected: `15 tests pass`

- [ ] **Step 4: TypeScript 빌드 확인**

  ```bash
  npx tsc --noEmit
  ```

  Expected: 에러 없음

- [ ] **Step 5: 커밋**

  ```bash
  git add src/components/project/HomeFeaturedProjects.tsx src/pages/HomePage.tsx
  git commit -m "feat: 홈 주요 프로젝트 비대칭 레이아웃으로 교체"
  ```

---

## Task 3: HomeNoteCard + HomeNoteCarousel — 컴팩트 카드 케로셀

**Files:**
- Create: `src/components/note/HomeNoteCard.tsx`
- Create: `src/components/note/HomeNoteCarousel.tsx`
- Modify: `src/pages/HomePage.tsx`

### 배경 지식

- 현재 홈 다크 섹션은 `NoteGrid` → `NoteCard`를 사용한다. `NoteCard`는 썸네일 + 뱃지 + 제목 + 요약 + 태그 + 날짜 구조로 기술 노트 페이지와 동일한 카드다.
- 목표: 썸네일 없는 컴팩트 카드를 좌우 스크롤 케로셀로 표시한다.
- **케로셀 구현 방식: CSS scroll snap** — 새 라이브러리 없이 `overflow-x-auto` + `snap-x snap-mandatory`로 구현한다. 이전/다음 버튼은 `useRef`로 컨테이너를 참조해 `scrollBy()` 호출로 처리한다.
- `technicalNotes`는 총 5개 항목이다. 홈에서는 전체를 표시한다 (`slice(0, 5)`).
- 카드 너비: 고정폭 `w-72` + `shrink-0` — 케로셀 내에서 줄바꿈 없이 가로 나열.
- 번호 표시: `String(index + 1).padStart(2, '0')` → "01", "02", "03"...
- `surface.darkCard` = `"rounded-2xl border border-white/10 bg-white/[0.04] shadow-glow"` — 다크 카드 스타일.
- `Badge variant="dark"` — 다크 섹션용 카테고리 배지.
- `Link` (react-router-dom): `PATHS.technicalNoteDetail(note.slug)` 로 제목 링크.
- `import` 경계 규칙: 두 컴포넌트 모두 `@/data`를 직접 import하지 않는다. props만 사용.

**케로셀 레이아웃:**
```
  [←]  [ 01 card ][ 02 card ][ 03 card ][ 04 card ][ 05 card ]  [→]
       ←─── overflow-x-auto + snap-x snap-mandatory ───→
```
- `ChevronLeft` / `ChevronRight` 버튼: `SectionHeader`의 `action` prop 영역 또는 케로셀 상단 우측에 배치
- 스크롤 단위: 카드 너비 + gap (`scrollBy({ left: ±304, behavior: 'smooth' })`)

---

- [ ] **Step 1: `src/components/note/HomeNoteCard.tsx` 생성**

  Props 인터페이스:
  ```typescript
  import type { TechnicalNoteCard } from "@/types/note";

  type HomeNoteCardProps = {
    note: TechnicalNoteCard;
    index: number;
  };
  ```

  렌더링 책임:
  - 래퍼: `surface.darkCard` + `w-72 shrink-0` (케로셀 고정 너비)
  - 상단 행: 번호 (`text-xs font-mono text-slate-500`, `padStart(2, '0')`) + `Badge variant="dark"` + `note.category`
  - 제목: `<Link to={PATHS.technicalNoteDetail(note.slug)}>` — `text-base font-bold text-white hover:text-blue-400`
  - 요약: `line-clamp-3 text-sm text-slate-400`
  - 하단: `note.date` (`text-xs text-slate-500`)

- [ ] **Step 2: `src/components/note/HomeNoteCarousel.tsx` 생성**

  Props 인터페이스:
  ```typescript
  import type { TechnicalNoteCard } from "@/types/note";

  type HomeNoteCarouselProps = {
    notes: TechnicalNoteCard[];
  };
  ```

  내부 ref 및 핸들러:
  - `scrollRef = useRef<HTMLDivElement>(null)` — 스크롤 컨테이너 참조
  - `scrollPrev()`: `scrollRef.current?.scrollBy({ left: -304, behavior: 'smooth' })`
  - `scrollNext()`: `scrollRef.current?.scrollBy({ left: 304, behavior: 'smooth' })`

  렌더링 책임:
  - **버튼 행**: 케로셀 위 우측 정렬 (`flex justify-end gap-2 mb-4`)
    - `ChevronLeft` 버튼 + `ChevronRight` 버튼 (lucide-react)
    - 버튼 스타일: `rounded-full border border-white/10 bg-white/[0.06] p-2 text-white hover:bg-white/10`
  - **스크롤 컨테이너**: `ref={scrollRef}` + `flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2`
    - 스크롤바 숨김: `style={{ scrollbarWidth: 'none' }}` 인라인 스타일 (또는 Tailwind `[&::-webkit-scrollbar]:hidden`)
  - 각 아이템 래퍼: `snap-start`
  - `notes.map((note, i) => <HomeNoteCard key={note.slug} note={note} index={i} />)`

- [ ] **Step 3: `src/pages/HomePage.tsx` 수정**

  추가할 import:
  ```typescript
  import { HomeNoteCarousel } from "@/components/note/HomeNoteCarousel";
  ```

  제거할 import:
  ```typescript
  import { NoteGrid } from "@/components/note/NoteGrid";
  ```

  `featuredNotes` 슬라이스 변경:
  ```typescript
  const featuredNotes = technicalNotes.slice(0, 5);
  ```

  다크 섹션 내부 교체 — `<NoteGrid notes={featuredNotes} />` →
  ```tsx
  <HomeNoteCarousel notes={featuredNotes} />
  ```

- [ ] **Step 4: 테스트 실행 및 확인**

  ```bash
  npm test
  ```

  Expected: `15 tests pass`

- [ ] **Step 5: 커밋**

  ```bash
  git add src/components/note/HomeNoteCard.tsx src/components/note/HomeNoteCarousel.tsx src/pages/HomePage.tsx
  git commit -m "feat: 홈 기술 문제 해결 기록 케로셀 카드로 교체"
  ```

---

## Task 4: HomeTechStack — 아이콘 + 항목 가로 배치

**Files:**
- Modify: `package.json` (react-icons 설치)
- Modify: `src/data/techStack.ts`
- Create: `src/components/project/HomeTechStack.tsx`
- Modify: `src/pages/HomePage.tsx`

### 배경 지식

- 현재 `techStackGroups`는 3개 그룹(Backend, Database, Infra & DevOps)이다. 레퍼런스 이미지는 5개 카테고리를 표시한다.
- 추가할 그룹: Messaging & Queue (Celery, RabbitMQ, Redis), Observability (Prometheus, Grafana).
- 첫 번째 그룹명 `"Backend"` → `"General"` 로 변경 (이미지 기준).
- 목표 레이아웃: 카드 없이 **카테고리 레이블 좌측 고정 + 우측 아이콘+이름 뱃지 가로 나열**, 구분선으로 행 분리.
- 아이콘 소스: `react-icons/si` (SimpleIcons) — 기술 로고 SVG 컴포넌트를 제공한다.
  - 아이콘이 없는 항목(QueryDSL 등)은 아이콘 없이 이름만 표시한다.
- 아이콘 맵은 `src/components/project/HomeTechStack.tsx` 내부에 로컬로 정의한다 (데이터 레이어에 넣지 않는다 — 시각 표현 관심사).
- `HomeTechStack`은 `@/data`를 직접 import하지 않는다. props로만 데이터를 받는다.
- `TechStackGroup`은 `title`, `items` 외 필드도 가지므로, 로컬 `TechGroup` 타입(부분 집합)으로 props를 선언해도 TypeScript 구조적 서브타이핑으로 `techStackGroups`를 그대로 전달할 수 있다.

**`react-icons/si` 아이콘 이름 매핑 (설치 후 사용 가능한 항목):**

| 기술 이름 | 컴포넌트 |
|---|---|
| Spring Boot | `SiSpringboot` |
| FastAPI | `SiFastapi` |
| Java | `SiOpenjdk` |
| Python | `SiPython` |
| MySQL | `SiMysql` |
| PostgreSQL | `SiPostgresql` |
| Redis | `SiRedis` |
| AWS | `SiAmazonwebservices` |
| Docker | `SiDocker` |
| GitHub Actions | `SiGithubactions` |
| Nginx | `SiNginx` |
| Celery | `SiCelery` |
| RabbitMQ | `SiRabbitmq` |
| Prometheus | `SiPrometheus` |
| Grafana | `SiGrafana` |
| QueryDSL | (없음 — 아이콘 없이 이름만) |

---

- [ ] **Step 1: `react-icons` 설치**

  ```bash
  pnpm add react-icons
  ```

  Expected: `package.json`의 `dependencies`에 `"react-icons": "..."` 추가됨

- [ ] **Step 2: `src/data/techStack.ts` 수정 — 그룹 추가 및 첫 번째 그룹명 변경**

  `techStackGroups[0].title` 변경: `"Backend"` → `"General"`

  배열 끝에 2개 그룹 추가:
  ```typescript
  {
    title: "Messaging & Queue",
    description: "비동기 메시지 처리와 이벤트 기반 구조",
    icon: "MessageQueue",
    items: [
      { name: "Celery", category: "messaging" },
      { name: "RabbitMQ", category: "messaging" },
      { name: "Redis", category: "messaging" },
    ],
  },
  {
    title: "Observability",
    description: "운영 모니터링과 지표 수집",
    icon: "Activity",
    items: [
      { name: "Prometheus", category: "observability" },
      { name: "Grafana", category: "observability" },
    ],
  },
  ```

- [ ] **Step 3: `src/components/project/HomeTechStack.tsx` 생성**

  Props 인터페이스 — 로컬 최소 타입 정의:
  ```typescript
  import type { TechTag } from "@/types/common";

  type TechGroup = {
    title: string;
    items: TechTag[];
  };

  type HomeTechStackProps = {
    groups: TechGroup[];
  };
  ```

  아이콘 맵 — 컴포넌트 파일 상단 모듈 스코프에 정의:
  ```typescript
  import type { ComponentType } from "react";
  import {
    SiSpringboot, SiFastapi, SiOpenjdk, SiPython,
    SiMysql, SiPostgresql, SiRedis,
    SiAmazonwebservices, SiDocker, SiGithubactions, SiNginx,
    SiCelery, SiRabbitmq, SiPrometheus, SiGrafana,
  } from "react-icons/si";

  const TECH_ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
    "Spring Boot": SiSpringboot,
    "FastAPI": SiFastapi,
    "Java": SiOpenjdk,
    "Python": SiPython,
    "MySQL": SiMysql,
    "PostgreSQL": SiPostgresql,
    "Redis": SiRedis,
    "AWS": SiAmazonwebservices,
    "Docker": SiDocker,
    "GitHub Actions": SiGithubactions,
    "Nginx": SiNginx,
    "Celery": SiCelery,
    "RabbitMQ": SiRabbitmq,
    "Prometheus": SiPrometheus,
    "Grafana": SiGrafana,
  };
  ```

  각 아이템 렌더링 — 기존 `TechTag`를 사용하지 않고 아이콘 포함 뱃지를 인라인 렌더링:
  - 래퍼 `<span>`: 기존 `TechTag`의 카테고리별 색상과 동일한 클래스 + `inline-flex items-center gap-1.5`
  - `TECH_ICON_MAP[item.name]`이 존재하면: `<Icon className="h-3.5 w-3.5" />` 렌더링
  - `item.name` 텍스트

  섹션 레이아웃:
  - 래퍼: `divide-y divide-slate-200`
  - 각 그룹 행: `flex items-center gap-6 py-5`
    - 좌측: `w-40 shrink-0 text-sm font-semibold text-slate-500` — `group.title`
    - 우측: `flex flex-wrap gap-2` — 아이템 목록

- [ ] **Step 4: `src/pages/HomePage.tsx` 수정**

  추가할 import:
  ```typescript
  import { HomeTechStack } from "@/components/project/HomeTechStack";
  ```

  기존 tech stack 섹션 내 인라인 `grid` 및 `article` 루프 전체를 교체:
  ```tsx
  <HomeTechStack groups={techStackGroups} />
  ```

- [ ] **Step 5: 테스트 실행 및 확인**

  ```bash
  npm test
  ```

  Expected: `15 tests pass`

- [ ] **Step 6: 커밋**

  ```bash
  git add package.json pnpm-lock.yaml src/data/techStack.ts src/components/project/HomeTechStack.tsx src/pages/HomePage.tsx
  git commit -m "feat: 기술 스택 아이콘 추가 및 가로 배치 레이아웃 적용"
  ```

---

## Task 5: Footer 리디자인 + 홈 CTA 섹션 제거

**Files:**
- Modify: `src/utils/pageChrome.ts`
- Modify: `src/components/layout/PageLayout.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/data/hero.ts` (homeCta 제거)

### 배경 지식

- 현재 `Footer`는 1열 — 연락처 링크 나열 + 저작권만 표시한다.
- 목표 레이아웃: **로고+소개(좌) + 2열 링크 그룹(우)**
  - 우측 2열: 페이지 링크 컬럼 | 연락처 링크 컬럼 (가로 나란히 배치)
  - 하단: 구분선 + 저작권 전체 너비
- 현재 `src/pages/HomePage.tsx`에 `bg-hero-radial` CTA 섹션이 있다. 이미지에는 별도 CTA 배너가 없고 연락처가 Footer에 통합되어 있다 → CTA 섹션 제거.
- `Footer`는 `components → data` 경계 규칙으로 `src/data/navigation.ts`를 직접 import할 수 없다. `navigation` 배열은 `PageLayout` → `Footer`로 props 전달한다.
- `PageLayout`은 이미 `navigation` prop을 가지고 있고 `Header`에 전달한다. `Footer`에도 동일 배열을 전달하면 된다.
- 소셜 아이콘 렌더링: lucide-react의 `Mail`, `Github` 아이콘을 직접 import해 사용한다. `footerContacts`의 `label` 값("Email", "GitHub")으로 분기한다.
- `src/utils/pageChrome.ts`는 `src/utils/` 에 있으며 `siteConfig`와 `navigation`을 모두 접근할 수 있다.

**Footer 레이아웃 구조:**
```
┌─────────────────────────────────────────────────────────┐
│  <LJE/>          Projects  Technical Notes  About  Contact  │
│  문제를 관찰하고,  Email  GitHub  LinkedIn  GitLab        │
│  구조를 개선하는                                          │
│  개발자                                                   │
├─────────────────────────────────────────────────────────┤
│  © 2026 이종은. All rights reserved.                     │
└─────────────────────────────────────────────────────────┘
```

레이아웃 구조: `flex justify-between items-start`
- **좌측** (로고 + 소개): `flex flex-col gap-2`
  - `logoText` — `font-mono text-lg font-bold text-white`
  - `tagline` — `text-sm text-slate-400 max-w-xs`
- **우측** (링크 2행): `flex flex-col gap-3 items-end` 또는 `items-start`
  - 1행: `navigation` 배열 → `flex flex-wrap gap-6` 가로 나열
  - 2행: `contacts` 배열 → `flex flex-wrap gap-6` 가로 나열
- **하단 전체 너비**: `border-t border-white/10 mt-8 pt-6` + `copyright` (`text-xs text-slate-500`)

---

- [ ] **Step 1: `src/utils/pageChrome.ts` 수정 — `footerTagline` 추가**

  `siteConfig.headline`을 `footerTagline`으로 export:
  ```typescript
  export const pageChrome = {
    logoText: siteConfig.logoText,
    copyright: siteConfig.copyright,
    navigation: mainNavigation,
    footerContacts: footerNavigation.contact,
    footerTagline: siteConfig.headline,
  } as const;
  ```

- [ ] **Step 2: `src/components/layout/Footer.tsx` 리디자인**

  Props 인터페이스 변경:
  ```typescript
  type NavigationItem = { label: string; href: string };

  type FooterProps = {
    logoText: string;
    tagline: string;
    navigation: readonly NavigationItem[];
    contacts: readonly FooterContact[];
    copyright: string;
  };
  ```

  렌더링 책임:
  - **최상위 래퍼**: `flex justify-between items-start`
  - **좌측 — 로고 + 소개**: `flex flex-col gap-2`
    - `logoText` — `font-mono text-lg font-bold text-white`
    - `tagline` — `text-sm leading-6 text-slate-400 max-w-xs`
  - **우측 — 링크 2행**: `flex flex-col gap-3`
    - **1행 — 페이지 링크**: `flex flex-wrap gap-6` — `navigation` 배열을 `<NavLink>` 목록으로 렌더링
      - 링크 스타일: `text-sm text-slate-400 transition hover:text-white`
    - **2행 — 연락처 링크**: `flex flex-wrap gap-6` — `contacts` 배열을 `<a>` 링크 목록으로 렌더링
      - 각 링크: `<a href target="_blank" rel="noreferrer">` + 아이콘 + `label` 텍스트
      - `label === "GitHub"` → `Github` 아이콘 (lucide-react)
      - `label === "Email"` → `Mail` 아이콘 (lucide-react)
      - 나머지 → `ExternalLink` 아이콘 (lucide-react)
      - 링크 스타일: `inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white`
  - **하단 구분선**: `border-t border-white/10 mt-8 pt-6` + `copyright` (`text-xs text-slate-500`)

- [ ] **Step 3: `src/components/layout/PageLayout.tsx` 수정 — `Footer`에 `navigation`, `tagline` 전달**

  Props에 추가:
  ```typescript
  footerTagline: string;
  ```

  `Footer` 호출 수정:
  ```tsx
  <Footer
    logoText={logoText}
    tagline={footerTagline}
    navigation={navigation}
    contacts={footerContacts}
    copyright={copyright}
  />
  ```

- [ ] **Step 4: `src/pages/HomePage.tsx` 수정 — CTA 섹션 제거**

  다음 전체 섹션을 삭제:
  ```tsx
  <section className="bg-hero-radial py-20 text-white lg:py-24">
    ...
  </section>
  ```

  관련 import 정리:
  - `import { homeCta, homeHeroCode, pageHeroes }` → `homeCta` 제거
  - `import { externalLinks }` 전체 제거 (GitHub 버튼이 CTA 섹션과 함께 사라짐)

- [ ] **Step 5: `src/data/hero.ts` 수정 — `homeCta` 제거**

  `homeCta` export 블록 삭제. 이 상수는 CTA 섹션 제거 후 아무 곳에서도 사용되지 않는다.

- [ ] **Step 6: 테스트 실행 및 확인**

  ```bash
  npm test
  ```

  Expected: `15 tests pass`

- [ ] **Step 7: TypeScript 빌드 확인**

  ```bash
  npx tsc --noEmit
  ```

  Expected: 에러 없음

- [ ] **Step 8: 커밋**

  ```bash
  git add src/utils/pageChrome.ts src/components/layout/Footer.tsx src/components/layout/PageLayout.tsx src/pages/HomePage.tsx src/data/hero.ts
  git commit -m "feat: Footer 3컬럼 리디자인 및 홈 CTA 섹션 제거"
  ```
