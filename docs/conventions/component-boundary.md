# Component Boundary Convention

## 원칙

컴포넌트는 데이터 출처를 알지 않는다. 페이지가 데이터를 읽고 props로 전달한다.

## 허용 import

```txt
components -> components
components -> types
components -> constants
```

## 금지 import

```txt
components -> data
components -> pages
data -> components
types -> data
```

## 관련 파일

- `eslint.config.js`
- `src/components/AGENTS.md`
- `src/pages/AGENTS.md`
