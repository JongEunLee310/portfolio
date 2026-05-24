# 목록 페이지 페이지네이션 상태 유지

## 문제

`TechnicalNotesPage`와 `ProjectsPage`는 `currentPage`를 `useState`로 관리한다. 상세 페이지로 이동 후 돌아오면 컴포넌트가 재마운트되어 항상 1페이지로 리셋된다.

## 해결 방향

URL 검색 파라미터(`?page=N`)에 현재 페이지를 저장한다. 브라우저 히스토리에 항목을 쌓지 않도록 `replace: true`로 교체한다. 상세 페이지의 브레드크럼은 `navigate(-1)`을 사용해 이전 URL(페이지 번호 포함)로 복원한다.

페이지네이션 UI는 공통 `src/components/common/Pagination.tsx`를 사용한다. 숫자 버튼은 현재 페이지 주변 최대 5개만 표시한다. `ProjectPagination`과 `NotePagination`은 각 도메인 컴포넌트 이름을 유지하되, 실제 렌더링은 공통 컴포넌트에 위임한다.

## 변경 범위

| 파일 | 변경 내용 |
|------|----------|
| `src/pages/TechnicalNotesPage.tsx` | `useState(1)` → `useSearchParams`, 페이지 변경 시 `replace: true` |
| `src/pages/ProjectsPage.tsx` | 동일 |
| `src/components/common/Pagination.tsx` | 현재 페이지 주변 최대 5개 번호만 표시하는 공통 페이지네이션 |
| `src/components/note/NotePagination.tsx` | 공통 페이지네이션 위임 |
| `src/components/project/ProjectPagination.tsx` | 공통 페이지네이션 위임 |
| `src/pages/TechnicalNoteDetailPage.tsx` | 브레드크럼 `<Link>` → `navigate(-1)` |
| `src/components/project/ProjectDetailHero.tsx` | 브레드크럼 `<Link>` → `navigate(-1)` |

## 제외 범위

- 필터 상태(category, tags 등)는 URL 파라미터화하지 않음
- 상세 페이지 하단 탐색 CTA("모든 노트 보기", "모든 프로젝트")는 목록 루트로 유지
- `docs/domain/routes.md` 등 라우트 문서 변경 없음 (라우트 추가/제거 아님)

## 동작 시나리오

1. 사용자가 3페이지에서 카드 클릭 → URL: `/technical-notes?page=3` → `/technical-notes/slug`
2. 브레드크럼 클릭 → `navigate(-1)` → `/technical-notes?page=3` 복원 ✓
3. 브라우저 뒤로가기 → 동일하게 복원 ✓
4. 1→2→3 페이지 이동 후 뒤로가기 → `/technical-notes/slug` 이전으로 이동 (히스토리 미적재) ✓
5. 전체 페이지가 6개 이상이어도 페이지 번호는 현재 위치 주변 5개까지만 표시 ✓
