# Troubleshooting Card 데이터 단일화 설계

## 배경 및 목적

프로젝트 상세 페이지의 "문제해결" 카드(problem/solution/result)가 `ProjectDetail.troubleshooting[]`에 직접 작성되어 있다. 동일한 내용이 note 파일에도 존재하거나, note 파일이 없어도 카드에 텍스트가 존재하는 이중화 구조이다.

목표: note 파일을 단일 진실 공급원으로 만들고, project-detail은 "어떤 slug를 어떤 순서로 보여줄지"만 관리한다.

## 변경 범위

- 대상 프로젝트: 전체 7개 (halo, ai-devops, arm, eks, goorm-bank, smart-farm, the-listening-tree)
- 카드 형태(problem/solution/result UI): 현행 유지

---

## 타입 변경

### `TechnicalNoteCard` (src/types/note.ts)

```ts
cardSummary?: {
  problem: string
  solution: string
  result?: string
}
isStub?: true   // projectNoteStubs 전용. technicalNotes 항목에는 사용 금지
```

- `cardSummary`가 있으면 프로젝트 상세 카드에 표시
- `cardSummary`가 없으면 카드에 표시되지 않음 (일반 note)
- `isStub: true`이면 카드에 링크 없이 렌더링

### `ProjectDetail` (src/types/project.ts)

| 제거 | 추가 |
|------|------|
| `troubleshooting: { title, problem, solution, result, noteSlug? }[]` | `troubleshootingNoteSlugs: string[]` |
| `relatedNoteSlugs: string[]` | (없음) |

`troubleshootingNoteSlugs`는 표시 순서를 포함한 note slug 목록이다.

---

## note 파일 작업

### 기존 note 활용 (cardSummary 이전)

| 프로젝트 | 이전 대상 |
|---------|---------|
| halo | 11개 note에 cardSummary 추가 |
| ai-devops | 9개 note에 cardSummary 추가 |
| the-listening-tree | 4개 note에 cardSummary 추가 |
| smart-farm | 3개 note에 cardSummary 추가 |

카드 텍스트(problem/solution/result)는 project-detail에서 해당 note로 이전한다.

### arm 재매핑

arm project-detail의 troubleshooting 13개는 존재하지 않는 slug를 참조하고 있다. 기존 arm 관련 note 9개(note-im2col-gemm-bottleneck 등)와 주제 기반으로 매핑한 뒤:

1. 매핑된 note에 cardSummary 추가
2. project-detail의 troubleshootingNoteSlugs를 실제 note slug로 교체
3. 매핑되지 않는 카드(4개 예상)는 신규 스텁 생성

### 스텁 신규 생성

note 파일이 없거나 재매핑이 불가한 경우 최소 스텁을 생성한다.

| 프로젝트 | 스텁 수 |
|---------|--------|
| eks | 4 |
| goorm-bank | 4 |
| smart-farm | 1 |
| the-listening-tree | 1 |
| arm | 4 (재매핑 후 잔여) |

스텁 파일 구조:
- `slug`, `title`, `category`, `thumbnail`, `date`, `readingTime`, `tags` — 최소 필드
- `relatedProjectSlugs` — 해당 프로젝트 slug 포함
- `cardSummary` — project-detail에서 이전한 텍스트
- detail 페이지 콘텐츠(toc, content 등) 없음 → note detail 페이지 접근 시 처리 필요

스텁 note는 `technicalNotes` 배열에 추가하지 않는다. 카드 렌더링에만 쓰이므로 별도 `projectNoteStubs` 배열로 분리하거나, technicalNotes에 포함하되 `featured: false`로 노출을 제한한다.

> **결정 필요**: 스텁을 technicalNotes에 포함할지 여부. 포함하면 기술 노트 목록에 미완성 항목이 노출될 수 있다.
> → 포함하지 않는다. 스텁은 별도 `src/data/projectNoteStubs.ts`로 관리하고, ProjectDetailPage에서 technicalNotes와 합쳐서 slug 조회에 사용한다.

---

## 렌더링 변경

### ProjectDetailPage (또는 ProjectClosingCardsSection)

```ts
import { technicalNotes } from "@/data/technicalNotes"
import { projectNoteStubs } from "@/data/projectNoteStubs"

const allNotes = [...technicalNotes, ...projectNoteStubs]

const troubleshootingCards = project.troubleshootingNoteSlugs
  .map(slug => allNotes.find(n => n.slug === slug))
  .filter(Boolean)
```

카드 UI:
- `note.cardSummary.problem / solution / result` 사용
- 링크: `PATHS.technicalNoteDetail(note.slug)` — 스텁 note는 detail 페이지가 없으므로 링크 없이 렌더링

스텁 여부 판별: `TechnicalNoteCard`에 `isStub?: true` 필드를 추가한다. ProjectClosingCardsSection은 `note.isStub`가 true이면 Link 없이 일반 div로 렌더링한다. 이 필드는 projectNoteStubs에만 사용하며, technicalNotes의 항목에는 사용하지 않는다.

---

## 테스트 변경 (src/tests/content-integrity.test.ts)

| 기존 | 변경 |
|------|------|
| `project.relatedNoteSlugs` slug 유효성 검사 | 제거 |
| (없음) | `project.troubleshootingNoteSlugs` 내 slug가 allNotes(technicalNotes + stubs)에 존재하는지 검사 |
| (없음) | `cardSummary`가 있는 note는 `relatedProjectSlugs`가 비어있지 않아야 함 |

---

## 마이그레이션 순서

1. 타입 변경 (types/note.ts, types/project.ts)
2. `src/data/projectNoteStubs.ts` 파일 신설
3. halo note 11개에 cardSummary 추가 → halo project-detail 교체 → 빌드 검증
4. ai-devops, the-listening-tree, smart-farm 동일 패턴 적용
5. arm 재매핑 + 스텁 생성
6. eks, goorm-bank 스텁 생성
7. ProjectDetailPage/ProjectClosingCardsSection 렌더링 로직 변경
8. 테스트 변경
9. 전체 빌드 및 타입 체크

---

## 제약

- 카드 UI(problem/solution/result 형태) 변경 없음
- technicalNotes 목록 노출: 스텁은 제외 (projectNoteStubs로 분리)
- 스텁 note의 detail 페이지: 현재 범위 밖 (나중에 필요 시 콘텐츠 추가)
- `TechnicalNoteDetail.relatedNoteSlugs`는 변경 없음 (note detail 페이지의 관련 note 기능)
