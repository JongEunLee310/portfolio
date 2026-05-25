# Failure-004: overflow:hidden 자식 요소가 document.scrollHeight에 기여하는 문제

## 상황

`max-h-[6.75rem] overflow-hidden` 컨테이너 안에 80개 항목을 모두 렌더링하고 넘치는 항목을 시각적으로 숨겼다.
`overflow: hidden`은 시각적 클리핑만 수행하며 스크롤 컨테이너를 생성하지 않는다.
따라서 숨겨진 자식 요소의 레이아웃 위치가 `document.documentElement.scrollHeight` 계산에 포함돼,
footer 아래로 최대 4000px 이상 빈 공간이 생기는 버그가 발생했다.
`position: sticky` 사이드바 안에 위치해 일반적인 시각 검사에서는 발견되지 않았다.

## 해결

collapsed 상태에서는 표시할 항목만 DOM에 렌더링한다.

```tsx
// 잘못된 방식: 전부 렌더링 후 overflow:hidden으로 숨김
<div className="max-h-[6.75rem] overflow-hidden">
  {allOptions.map((option, index) => (
    <label aria-hidden={!showAll && index >= COUNT} ...>
```

```tsx
// 올바른 방식: 표시할 항목만 렌더링
<div className={showAll ? "max-h-64 overflow-y-auto" : ""}>
  {(showAll ? allOptions : allOptions.slice(0, COUNT)).map((option) => (
    <label ...>
```

`overflow-y-auto`(expanded)는 스크롤 컨테이너를 생성하므로 자식이 document.scrollHeight에 기여하지 않는다.

## 관련 파일

- `src/components/note/NoteListSidebar.tsx`
- `src/components/project/ProjectListSidebar.tsx`
