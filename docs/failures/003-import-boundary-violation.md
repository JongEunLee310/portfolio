# Failure-003: import 경계 위반

## 상황

공통 컴포넌트가 `src/data`를 직접 import하면 재사용성이 떨어지고 데이터 흐름이 흐려진다.

## 해결

`src/pages`만 `src/data`를 직접 import한다. 공통 컴포넌트는 props를 사용한다.

## 관련 파일

- `eslint.config.js`
- `src/components/AGENTS.md`
