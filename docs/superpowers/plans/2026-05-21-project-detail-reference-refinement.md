# Project Detail Reference Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 프로젝트 상세 화면을 레퍼런스 이미지처럼 다크 히어로 + 라이트 케이스 스터디 본문 + 다크 KPI 밴드 + 하단 요약 카드 구조로 개선한다. 스펙: `docs/superpowers/specs/2026-05-21-project-detail-reference-refinement.md`

**Architecture:** 데이터 타입 확장 → 상수/데이터 보강 → 상세 섹션 컴포넌트 분리 및 추가 → `ProjectDetailPage` 재조립 → 반응형/접근성 확인 → 검증 순서로 진행한다.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, lucide-react

---

## File Structure

**Create:**
- src/components/project/ProjectDetailHero.tsx — 상세 페이지 히어로
- src/components/project/ProjectArchitectureFlowSection.tsx — 넓은 아키텍처 플로우
- src/components/project/ProjectFeatureStripSection.tsx — 균일한 핵심 기능 카드
- src/components/project/ProjectScreenshotGallerySection.tsx — 4열 스크린샷 갤러리
- src/components/project/ProjectTechStackGroupedSection.tsx — 그룹형 기술 스택
- src/components/project/ProjectContributionTimelineSection.tsx — 날짜 타임라인
- src/components/project/ProjectClosingCardsSection.tsx — 트러블슈팅/성능 개선/회고 3카드

**Modify:**
- `src/types/project.ts` — 히어로 성과, 아키텍처 플로우, 기술 스택 그룹, 개선 항목 타입 추가
- `src/constants/projectDetail.ts` — 뒤로가기/CTA/스크린샷/개선/회고 라벨 추가
- `src/data/projectDetails.ts` — 대표 프로젝트 상세 데이터 보강
- `src/data/technicalNotes.ts` — 트러블슈팅/회고 연결 기술 노트 카드 추가
- `src/data/noteDetails.ts` — 트러블슈팅/회고 연결 기술 노트 상세 추가
- `src/components/project/ProjectDetailSections.tsx` — 남길 공통 섹션과 분리할 섹션 정리
- `src/components/project/ProjectMetricCard.tsx` — 숫자 중심 KPI 카드 스타일 조정
- `src/pages/ProjectDetailPage.tsx` — 상세 페이지 레이아웃 재조립

**Optional assets:**
- `public/images/projects/ai-devops/screenshot-*.svg` — 갤러리 4개 구성을 위한 이미지
- `public/images/projects/ai-devops/dashboard.svg` — 히어로 대시보드 목업 개선

---

## Task 1: 타입 확장

**Files:**
- Modify: `src/types/project.ts`

- [x] `ProjectHeroHighlight` 타입 추가 (`label`, `value`, `icon?`)
- [x] `ProjectTechStackGroup` 타입 추가 (`title`, `items`)
- [x] `ProjectArchitectureGroup` 타입 추가 (`id?`, `title`, `nodes`)
- [x] `ProjectArchitectureConnection` 타입 추가 (`from`, `to`, `tone`, `label?`)
- [x] `ProjectArchitectureFlow` 타입 추가 (`title`, `description?`, `groups`, `connections?`, `legends?`)
- [x] `ProjectImprovement` 타입 추가 (`title`, `description`, `result?`, `icon`)
- [x] `ProjectDetail`에 `heroHighlights?`, `architectureFlow?`, `techStackGroups?`, `improvements?` 추가
- [x] `troubleshooting[].noteSlug?`, `retrospective.noteSlug?` 추가
- [x] 기존 데이터가 깨지지 않도록 모든 신규 필드는 optional로 둔다.
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 2: 상세 페이지 라벨 상수 보강

**Files:**
- Modify: `src/constants/projectDetail.ts`

- [x] `backToProjects` 라벨 추가
- [x] `hero.liveDemo`, `hero.github` CTA 라벨 추가
- [x] `sections.improvements` 라벨 추가
- [x] `sections.retrospective.title`, `sections.retrospective.eyebrow`, `sections.retrospective.openNote` 라벨 추가
- [x] `sections.troubleshooting` 캐러셀/문서 링크 라벨 추가
- [x] `screenshots.zoomLabel` 라벨 추가
- [x] 현재 컴포넌트에 있는 표시 텍스트가 상수 또는 데이터에서 오는지 확인
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 3: 대표 프로젝트 데이터 보강

**Files:**
- Modify: `src/data/projectDetails.ts`
- Optional create/modify: `public/images/projects/ai-devops/*.svg`

- [x] `ai-devops-orchestration-platform`에 `heroHighlights` 3개 추가
- [x] `performance`를 KPI 밴드용 5개 지표로 보강
- [x] `architectureFlow` 데이터 추가: 사용자/외부, API Gateway, 마이크로서비스, 데이터 & AI, 인프라/외부 연동
- [x] `architectureFlow.connections` 추가: 그룹 사이 흐름, 내부 서비스 이벤트, 데이터 흐름
- [x] `techStackGroups` 추가: Backend, Infra & DevOps, Data & AI, Messaging & Etc
- [x] `improvements` 추가: DB 쿼리 최적화, 캐시 전략, 비동기 처리 확대 등
- [x] `screenshots`를 4개 이상으로 보강
- [x] `troubleshooting`을 5개 항목으로 확장하고 연결 가능한 기술 노트 slug 추가
- [x] `retrospective.noteSlug`와 관련 노트 slug 추가
- [x] 이미지 경로 검증: `pnpm check:image-paths`
- [x] 콘텐츠 검증: `pnpm check:content`

---

## Task 4: ProjectDetailHero 분리 및 개선

**Files:**
- Create: src/components/project/ProjectDetailHero.tsx
- Modify: `src/components/project/ProjectDetailSections.tsx`
- Modify: `src/pages/ProjectDetailPage.tsx`

- [x] 기존 `ProjectDetailHero`를 별도 파일로 이동
- [x] 뒤로가기 링크를 히어로 상단에 추가하고 `PATHS.projects` 사용
- [x] 카테고리 배지, 제목, 요약을 레퍼런스 비율로 조정
- [x] 기간/역할/팀 규모 메타를 아이콘 + label/value 형태로 조정
- [x] `heroHighlights`가 있으면 성과 배지로 렌더링
- [x] Demo/GitHub CTA를 상수 라벨 기준으로 렌더링
- [x] 우측 `heroImage`를 `aspect-[16/10]`, `rounded-xl`, `shadow-glow`로 조정
- [x] 모바일에서 CTA와 메타 카드가 넘치지 않는지 확인
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 5: 개요와 문제/해결 섹션 정리

**Files:**
- Modify: `src/components/project/ProjectDetailSections.tsx`
- Modify: `src/pages/ProjectDetailPage.tsx`

- [x] `ProjectOverviewSection`을 카드형에서 제목/본문/태그 pill 구조로 조정
- [x] overview 오른쪽에 대표 기술 또는 카테고리 pill을 표시
- [x] `ProjectNarrativeCard`에 체크 아이콘 목록 스타일 적용
- [x] 문제/해결 카드가 데스크톱에서 같은 높이를 갖도록 조정
- [x] 라이트 본문 배경과 카드 shadow/radius가 ADR-004와 맞는지 확인
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 6: 아키텍처 플로우 섹션 구현

**Files:**
- Create: src/components/project/ProjectArchitectureFlowSection.tsx
- Modify: `src/pages/ProjectDetailPage.tsx`

- [x] `architectureFlow`가 있으면 그룹형 플로우를 렌더링
- [x] `architectureFlow`가 없으면 기존 `architecture.nodes` 기반 노드 카드로 fallback
- [x] 각 그룹은 상단 제목과 compact 내부 노드 카드를 가진다.
- [x] 데스크톱에서는 그룹 사이 연결 레일과 연결 라벨을 표시
- [x] 그룹 내부 연결은 `내부 흐름` 영역으로 표시
- [x] 모바일에서는 그룹과 화살표가 세로 흐름으로 접히도록 처리
- [x] legend가 있으면 카드 하단에 표시
- [x] 장식 연결선은 `aria-hidden` 처리
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 7: 핵심 기능 스트립 구현

**Files:**
- Create: src/components/project/ProjectFeatureStripSection.tsx
- Modify: `src/pages/ProjectDetailPage.tsx`

- [x] 기존 `ProjectFeaturesSection` 책임을 새 컴포넌트로 이전
- [x] 기능 카드를 `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`로 구성
- [x] 아이콘 박스, 제목, 설명 높이가 안정적으로 유지되도록 스타일 적용
- [x] 데이터가 5개 미만이어도 더미 카드는 만들지 않음
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 8: 스크린샷 갤러리 구현

**Files:**
- Create: src/components/project/ProjectScreenshotGallerySection.tsx
- Modify: `src/pages/ProjectDetailPage.tsx`

- [x] 스크린샷 그리드를 `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`로 구성
- [x] 썸네일은 `aspect-[16/9]`로 고정
- [x] 각 카드에 화면 제목과 확대 아이콘 버튼 추가
- [x] 초기 구현 방식 선택: 새 탭 링크
- [x] 이미지 alt에 프로젝트명과 스크린샷 제목 포함
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 9: 그룹형 기술 스택과 기여 타임라인 구현

**Files:**
- Create: src/components/project/ProjectTechStackGroupedSection.tsx
- Create: src/components/project/ProjectContributionTimelineSection.tsx
- Modify: `src/pages/ProjectDetailPage.tsx`

- [x] `techStackGroups`가 있으면 그룹형 카드 렌더링
- [x] 없으면 기존 `techStack` 태그 목록으로 fallback
- [x] 기술 스택 그룹 카드는 2열 반응형으로 구성
- [x] `contributions`를 날짜순 타임라인으로 렌더링
- [x] 반응형 그리드 기반 타임라인 적용
- [x] 타임라인 DOM 순서가 날짜 흐름과 일치하는지 확인
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 10: KPI 밴드와 MetricCard 조정

**Files:**
- Modify: `src/components/project/ProjectMetricCard.tsx`
- Modify: `src/components/project/ProjectDetailSections.tsx` 또는 분리된 results 컴포넌트

- [x] KPI 카드에서 value를 가장 크게 강조
- [x] 아이콘이 있으면 상단에 표시
- [x] 5개 KPI가 한 줄에 자연스럽게 배치되도록 `lg:grid-cols-5` 적용
- [x] 다크 밴드 배경, 카드 경계, 파란 포인트가 ADR-004와 맞는지 확인
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 11: 하단 3카드 섹션 구현

**Files:**
- Create: src/components/project/ProjectClosingCardsSection.tsx
- Modify: `src/pages/ProjectDetailPage.tsx`

- [x] 트러블슈팅 카드: `troubleshooting` 캐러셀 표시
- [x] 트러블슈팅 항목에 `noteSlug`가 있으면 기술 노트 상세로 이동
- [x] 성능 개선 카드: `improvements` 항목을 서브카드로 표시
- [x] 회고 카드: `RETROSPECTIVE` eyebrow, `retrospective.learned`, `retrospective.improvement` 요약 표시
- [x] 회고 전문 링크를 우측 CTA로 표시
- [x] 관련 기술 태그 노출
- [x] 데이터가 없는 칸은 렌더링하지 않고 그리드가 자연스럽게 재배치되도록 구현
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 12: ProjectDetailPage 레이아웃 재조립

**Files:**
- Modify: `src/pages/ProjectDetailPage.tsx`

최종 구조:

```tsx
<PageLayout {...pageChrome}>
  <ProjectDetailHero project={project} />

  <section className="bg-slate-50 py-16 lg:py-20">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <ProjectOverviewSection ... />
      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectNarrativeCard ... />
        <ProjectNarrativeCard ... />
      </div>
      <ProjectArchitectureFlowSection ... />
      <ProjectFeatureStripSection ... />
      <ProjectScreenshotGallerySection ... />
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <ProjectTechStackGroupedSection ... />
        <ProjectContributionTimelineSection ... />
      </div>
    </div>
  </section>

  <ProjectResultsSection performance={project.performance} />

  <section className="bg-slate-50 py-16 lg:py-20">
    <ProjectClosingCardsSection project={project} />
  </section>
</PageLayout>
```

- [x] 기존 섹션 순서를 레퍼런스 이미지 순서에 맞게 재배치
- [x] 중복되는 기존 `ProjectLinksSection` 위치를 히어로 CTA 또는 하단 카드로 통합
- [x] 데이터가 없는 프로젝트에서도 fallback이 깨지지 않는지 확인
- [x] TypeScript 검증: `pnpm typecheck`

---

## Task 13: 반응형 및 접근성 확인

**Files:**
- No planned code changes unless issues are found

- [x] 모바일에서 히어로 제목, CTA, 메타 카드가 넘치지 않도록 반응형 클래스 적용
- [x] 태블릿에서 스크린샷/기능/기술 스택 그리드가 자연스럽게 줄바꿈되도록 반응형 그리드 적용
- [x] 데스크톱에서 아키텍처 플로우와 KPI 밴드가 레퍼런스 밀도에 가깝게 보이도록 compact 카드 적용
- [x] 이미지 alt, 버튼 aria-label, 타임라인 DOM 순서 확인
- [x] 키보드로 CTA와 확대 버튼을 탐색할 수 있도록 링크/버튼 semantics 유지

---

## Task 14: 최종 검증

**Files:**
- No planned code changes

- [x] 린트 검증: `pnpm lint`
- [x] 타입 검증: `pnpm typecheck`
- [x] 이미지 경로 검증: `pnpm check:image-paths`
- [x] 콘텐츠 검증: `pnpm check:content`
- [x] 전체 검증: `pnpm check:all`
- [x] 빌드 검증: `pnpm build`
- [x] 변경 파일 목록 확인: `git status --short`
