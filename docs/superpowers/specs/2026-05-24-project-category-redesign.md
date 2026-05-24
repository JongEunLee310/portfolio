# Project Category Redesign

**Date:** 2026-05-24
**Branch:** docs/project/pipeline

## 문제

현재 `ProjectCategory = "backend" | "infra" | "ai" | "iot" | "personal"` 는 기술 도메인, 협업 방식, 프로젝트 성격이 혼재된 분류다.

- 기술 스택 필터가 별도 존재하므로 `backend`, `ai`, `iot` 카테고리는 중복
- 협업 방식 필터(`type: personal | team`)가 별도 존재하므로 `personal` 카테고리는 중복
- `category: ProjectCategory[]` 배열이지만 실제로는 혼재 목적으로 사용됨

## 결정

카테고리를 **프로젝트 목적/성격** 기준의 대분류로 재편한다.

```ts
export type ProjectCategory = "service" | "infra" | "research";
```

- `service`: 사용자에게 직접 제공되는 서비스 또는 API 구현
- `infra`: 인프라 구축, 운영, DevOps 중심 프로젝트
- `research`: 연구, 실험, 학습 목적 프로젝트

`category` 필드 타입을 `ProjectCategory[]` 배열에서 `ProjectCategory` 단일값으로 변경한다. 대분류이므로 하나의 프로젝트는 하나의 카테고리에만 속한다.

## 프로젝트별 카테고리 매핑

| slug | 카테고리 | 근거 |
|---|---|---|
| ai-devops-orchestration-platform | `service` | FastAPI 기반 실제 API 서버 구현 |
| halo | `service` | 서비스 매칭 플랫폼 백엔드 |
| the-listening-tree | `service` | 사용자 대면 웹 서비스 |
| smart-farm | `service` | 실제 모니터링 서비스 시스템 |
| goorm-bank-problem-bank | `infra` | EKS 기반 인프라 구축 중심 |
| eks-efk-monitoring-practice | `infra` | 인프라 실습 프로젝트 |
| arm-embedded-cnn-mixed-precision | `research` | 학부연구생 연구 프로젝트 |

## 수정 범위

### 타입
- `src/types/project.ts`: `ProjectCategory` 값 교체, `ProjectCard.category` 타입을 `ProjectCategory[]` → `ProjectCategory`

### 데이터
- `src/data/filters.ts`: `projectCategoryFilters` 라벨·값 교체
- `src/data/projects/` 7개 파일: `category` 필드 단일값으로 업데이트

### 컴포넌트·페이지
- `src/pages/ProjectsPage.tsx`: 필터 비교 로직 `.includes(filters.category)` → `=== filters.category`
- `src/components/project/ProjectCard.tsx`: `category.join(" · ")` → 단일값 직접 참조
- `src/components/project/HomeFeaturedProjects.tsx`: 동일
- `src/components/project/ProjectDetailHero.tsx`: `category.map()` → 단일값 직접 렌더링
