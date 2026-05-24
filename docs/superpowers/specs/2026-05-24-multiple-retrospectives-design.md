# 다중 회고 표시 설계

작성일: 2026-05-24

## 배경

AI DevOps 프로젝트에 MSA 전환 회고(`ai-devops-retrospective`) 외에 전체 프로젝트 회고 문서가 추가됐다. 프로젝트 상세 페이지에서 두 회고를 모두 표시해야 한다.

## 결정

### 데이터 모델

`src/types/project.ts`의 `retrospective` 단일 객체를 `retrospectives` 배열로 교체한다.

```typescript
// 변경 전
retrospective: {
  learned: string[];
  improvement: string[];
  noteSlug?: string;
};

// 변경 후
retrospectives: Array<{
  title: string;
  learned: string[];
  improvement: string[];
  noteSlug?: string;
}>;
```

### AI DevOps 프로젝트 데이터

`src/data/project-details/ai-devops-orchestration-platform.ts`에서 `retrospectives` 배열 2개 항목으로 구성한다. 순서: 전체 프로젝트 회고 → MSA 전환 회고.

```typescript
retrospectives: [
  {
    title: "전체 프로젝트 회고",
    learned: [...],      // 전체 프로젝트 회고 문서 기반 신규 작성
    improvement: [...],
    noteSlug: "ai-devops-project-retrospective",
  },
  {
    title: "MSA 전환 회고",
    learned: [...],      // 기존 retrospective.learned 이전
    improvement: [...],  // 기존 retrospective.improvement 이전
    noteSlug: "ai-devops-retrospective",
  },
],
```

### 나머지 프로젝트

기존 6개 프로젝트 파일은 내용 변경 없이 배열로 감싼다.

```typescript
// 변경 전
retrospective: {
  learned: [...],
  improvement: [...],
  noteSlug: "...",
}

// 변경 후
retrospectives: [
  {
    title: "회고",
    learned: [...],
    improvement: [...],
    noteSlug: "...",
  },
],
```

### UI 컴포넌트

`src/components/project/ProjectClosingCardsSection.tsx` 회고 카드를 케로셀 패턴으로 변경한다.

- `retrospectives.length === 1`: 단일 레이아웃 (케로셀 UI 없음)
- `retrospectives.length > 1`: 케로셀. 상단 좌우 화살표 + 하단 dot indicator

케로셀 한 슬라이드 구조:
- 섹션 `title` 헤딩
- `learned[0]` 요약 텍스트
- `noteSlug`가 있으면 우측 하단 "노트 열기" 링크

기존 Troubleshooting / Improvements 카드와 동일한 케로셀 UX 패턴을 따른다.

### 신규 노트

전체 프로젝트 회고를 기술 노트로 추가한다.

- `src/data/notes/ai-devops-project-retrospective.ts` (메타)
- `src/data/note-details/ai-devops-project-retrospective.ts` (상세, 전체 프로젝트 회고 문서 기반)
- `src/data/noteDetails.ts`에 export 추가
- `src/data/technicalNotes.ts`에 목록 추가

## 변경 범위

| 파일 | 유형 |
|------|------|
| `src/types/project.ts` | 타입 변경 |
| `src/data/project-details/ai-devops-orchestration-platform.ts` | 데이터 변경 (신규 회고 포함) |
| `src/data/project-details/halo.ts` | 구조 감싸기 |
| `src/data/project-details/arm-embedded-cnn-mixed-precision.ts` | 구조 감싸기 |
| `src/data/project-details/eks-efk-monitoring-practice.ts` | 구조 감싸기 |
| `src/data/project-details/goorm-bank-problem-bank.ts` | 구조 감싸기 |
| `src/data/project-details/smart-farm.ts` | 구조 감싸기 |
| `src/data/project-details/the-listening-tree.ts` | 구조 감싸기 |
| `src/components/project/ProjectClosingCardsSection.tsx` | 컴포넌트 변경 |
| `src/data/notes/ai-devops-project-retrospective.ts` | 신규 |
| `src/data/note-details/ai-devops-project-retrospective.ts` | 신규 |
| `src/data/noteDetails.ts` | export 추가 |
| `src/data/technicalNotes.ts` | 목록 추가 |

## 제약

- 컴포넌트는 데이터를 직접 import하지 않는다 (`components -> data` 금지).
- 화면 문구는 `src/data`에서 관리한다.
- 노트 콘텐츠는 전체 프로젝트 회고 문서의 실제 내용을 기반으로 작성한다. 일반 예시 코드나 근거 없는 수치는 포함하지 않는다.
