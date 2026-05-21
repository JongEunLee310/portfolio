# Project Detail Extraction Template

이 문서는 프로젝트 저장소나 README를 읽으며 `src/data/projectDetails.ts`에 필요한 정보를 뽑아내기 위한 작성용 틀이다. 실제 화면 데이터가 아니므로 내용을 채운 뒤 필요한 항목만 `src/data/projects.ts`, `src/data/projectDetails.ts`, `src/data/technicalNotes.ts`, `src/data/noteDetails.ts`로 옮긴다.

---

## 1. 프로젝트 기본 정보

| 항목 | 작성 내용 |
|---|---|
| slug |  |
| title |  |
| subtitle |  |
| summary |  |
| description |  |
| category |  |
| type | team / personal |
| status | featured / normal / archived |
| period |  |
| role |  |
| teamSize |  |
| thumbnail | /images/projects/... |
| heroImage | /images/projects/... |
| GitHub |  |
| Demo |  |
| Docs |  |

---

## 2. 기술 스택

### 전체 태그

| name | category |
|---|---|
|  | backend / frontend / database / infra / devops / messaging / observability / ai / language / tool |

### 그룹형 기술 스택

| 그룹명 | 기술 |
|---|---|
| Backend |  |
| Infra & DevOps |  |
| Data & AI |  |
| Messaging & Etc |  |

---

## 3. 히어로 성과 배지

| label | value | icon |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

---

## 4. 프로젝트 개요

한 문단으로 작성한다.

```text

```

---

## 5. 문제 정의

| title | items |
|---|---|
|  |  |

작성 후보:

- 
- 
- 

---

## 6. 해결 방향

| title | items |
|---|---|
|  |  |

작성 후보:

- 
- 
- 

---

## 7. 아키텍처 기본 노드

`architecture` fallback 렌더링에 사용한다.

| title | items | icon |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

---

## 8. 아키텍처 플로우

### 그룹

| group id | title | node ids |
|---|---|---|
| clients | 사용자 / 외부 |  |
| gateway | API Gateway |  |
| services | 마이크로서비스 |  |
| data-ai | 데이터 & AI |  |
| infra-integrations | 인프라 / 외부 연동 |  |

### 노드

| node id | group id | title | items | icon |
|---|---|---|---|---|
|  |  |  |  |  |

### 연결

| from | to | tone | label |
|---|---|---|---|
|  |  | sync / async / data |  |

### 범례

| label | tone |
|---|---|
| 동기 요청 | solid |
| 비동기 이벤트 | dashed |
| 데이터 흐름 | muted |

---

## 9. 핵심 기능

| title | description | icon |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

---

## 10. 스크린샷

| title | image | description |
|---|---|---|
|  | /images/projects/... |  |
|  | /images/projects/... |  |
|  | /images/projects/... |  |
|  | /images/projects/... |  |

---

## 11. 기여 및 역할

| date | title | description |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

---

## 12. 트러블슈팅

트러블슈팅 상세 문서가 있으면 `noteSlug`를 작성한다.

| title | problem | solution | result | noteSlug |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

---

## 13. 성능 개선

| title | description | result | icon |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

---

## 14. 성과 지표

| label | value | description | icon |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

---

## 15. 회고

회고 전문 문서가 있으면 `noteSlug`를 작성한다.

### 배운 점

- 
- 

### 개선 계획

- 
- 

| noteSlug |
|---|
|  |

---

## 16. 관련 기술 노트

| relatedNoteSlugs |
|---|
|  |

---

## 17. TypeScript 작성 틀

아래 객체는 `ProjectDetail` 구조를 빠르게 채우기 위한 참고용이다. 실제 반영 시에는 `...findProject("slug")`를 사용하고, 표시 텍스트는 모두 데이터에 둔다.

```typescript
{
  ...findProject(""),
  heroImage: "",
  heroHighlights: [
    { label: "", value: "", icon: "" },
  ],
  overview: "",
  problem: {
    title: "",
    items: [],
  },
  solution: {
    title: "",
    items: [],
  },
  architecture: {
    title: "",
    description: "",
    nodes: [
      {
        id: "",
        title: "",
        items: [],
        icon: "",
      },
    ],
  },
  architectureFlow: {
    title: "",
    description: "",
    groups: [
      {
        id: "",
        title: "",
        nodes: [
          {
            id: "",
            title: "",
            items: [],
            icon: "",
          },
        ],
      },
    ],
    connections: [
      {
        from: "",
        to: "",
        tone: "sync",
        label: "",
      },
    ],
    legends: [
      { label: "동기 요청", tone: "solid" },
      { label: "비동기 이벤트", tone: "dashed" },
      { label: "데이터 흐름", tone: "muted" },
    ],
  },
  features: [
    {
      title: "",
      description: "",
      icon: "",
    },
  ],
  techStackGroups: [
    {
      title: "",
      items: [],
    },
  ],
  screenshots: [
    {
      title: "",
      image: "",
      description: "",
    },
  ],
  contributions: [
    {
      date: "",
      title: "",
      description: "",
    },
  ],
  troubleshooting: [
    {
      title: "",
      problem: "",
      solution: "",
      result: "",
      noteSlug: "",
    },
  ],
  improvements: [
    {
      title: "",
      description: "",
      result: "",
      icon: "",
    },
  ],
  performance: [
    {
      label: "",
      value: "",
      description: "",
      icon: "",
    },
  ],
  retrospective: {
    learned: [],
    improvement: [],
    noteSlug: "",
  },
  relatedNoteSlugs: [],
}
```
