import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const githubPagesWorkflowSourceOverwrite: TechnicalNoteCard = {
  slug: "github-pages-workflow-source-overwrite",
  title: "GitHub Pages 자동 Jekyll 배포가 Vite 산출물을 덮어쓴 문제",
  summary:
    "커스텀 GitHub Actions 배포는 성공했지만 GitHub Pages가 소스 index.html을 그대로 서빙했습니다. 자동 pages-build-deployment가 main 루트를 Jekyll로 다시 배포해 dist 산출물을 덮어쓴 원인과 복구 절차를 정리합니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/multirepo-ci-drift.svg"),
  date: "2026.05.26",
  readingTime: "9분 읽기",
  tags: [
    { name: "GitHub Pages", category: "devops" },
    { name: "GitHub Actions", category: "devops" },
    { name: "Vite", category: "frontend" },
  ],
  cardSummary: {
    title: "Pages 자동 배포가 dist 대신 소스 루트를 서빙",
    problem:
      "Vite 빌드는 성공했지만 배포 URL에서는 %BASE_URL%이 미치환된 index.html과 /src/main.tsx 요청이 노출됐습니다. 빌드 산출물의 JS 에셋은 404를 반환했습니다.",
    solution:
      "pages-build-deployment 로그에서 Jekyll이 source: . 를 artifact로 올린 사실을 확인했습니다. Pages build_type을 workflow로 다시 저장하고 커스텀 deploy workflow를 재실행해 dist 산출물로 복구했습니다.",
    result:
      "배포 URL의 index.html이 /portfolio/assets/... 번들 파일을 참조하고, JS 에셋도 HTTP 200으로 응답하게 됐습니다.",
  },
};
