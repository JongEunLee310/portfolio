# Error Handling Convention

## 원칙

오류 메시지는 수정할 파일과 문제 데이터를 알려줘야 한다.

## 예시

좋은 예:

```ts
throw new Error(`projects.ts에 존재하지 않는 프로젝트 slug입니다: ${slug}`);
```

나쁜 예:

```ts
throw new Error("데이터 오류");
```

## 상세 페이지

slug에 해당하는 데이터가 없으면 빈 단언을 사용하지 않고 NotFound 상태를 렌더링한다.
