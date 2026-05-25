import type { TechnicalNoteDetail } from "@/types/note";
import { githubPagesWorkflowSourceOverwrite } from "../notes/github-pages-workflow-source-overwrite";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const githubPagesWorkflowSourceOverwriteDetail: TechnicalNoteDetail = {
  ...githubPagesWorkflowSourceOverwrite,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "포트폴리오 사이트는 Vite로 빌드한 dist 디렉토리를 GitHub Pages에 배포해야 합니다. 그런데 실제 배포 URL에서는 Vite가 처리하지 않은 원본 index.html이 그대로 내려왔습니다. %BASE_URL% 문자열이 치환되지 않았고, 브라우저는 /src/main.tsx를 직접 요청했습니다.",
    },
    {
      type: "list",
      items: [
        "로컬 pnpm build는 성공했고 dist/index.html에서는 %BASE_URL%이 /portfolio/로 치환됐습니다.",
        "dist/index.html은 /portfolio/assets/index-pwyY_dEO.js와 CSS 번들을 정상 참조했습니다.",
        "배포 URL의 index.html은 원본 index.html처럼 /src/main.tsx를 참조했습니다.",
        "https://jongeunlee310.github.io/portfolio/assets/index-pwyY_dEO.js 는 처음 확인 시 HTTP 404를 반환했습니다.",
        "GitHub Actions의 커스텀 Deploy to GitHub Pages workflow는 성공 상태였습니다.",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "GitHub Actions 배포 성공만 보면 dist가 올라간 것처럼 보입니다. 하지만 GitHub Pages에는 저장소 설정이 만든 자동 pages-build-deployment가 별도로 존재할 수 있습니다. 이 자동 실행이 나중에 같은 Pages 환경을 다시 배포하면 성공한 커스텀 배포가 덮어써집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 GitHub가 생성한 pages-build-deployment workflow가 main 브랜치 루트(source: .)를 Jekyll로 빌드해 Pages artifact로 업로드한 것이었습니다. 이 실행은 저장소의 .github/workflows/deploy.yml 파일이 아니라 Pages 설정에서 파생된 자동 workflow입니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "pages-build-deployment 로그에서 확인한 단서",
      code: "Build with Jekyll\n  uses: actions/jekyll-build-pages@v1\n  source: .\n  destination: ./_site\n\nUpload artifact 목록 일부:\n  ./index.html\n  ./src/\n  ./vite.config.ts\n  ./package.json\n  ./public/images/...\n\n결론:\n  dist가 아니라 main 브랜치의 소스 루트가 Pages artifact로 업로드됨",
    },
    {
      type: "cards",
      items: [
        {
          title: "빌드는 정상",
          description:
            "로컬 dist에는 Vite가 생성한 JS/CSS 번들 경로와 /portfolio/ base path가 반영돼 있었습니다.",
          badge: "배제",
        },
        {
          title: "base 설정도 정상",
          description:
            "vite.config.ts의 base: '/portfolio/' 설정은 저장소 Pages URL과 일치했습니다.",
          badge: "배제",
        },
        {
          title: "배포 artifact가 잘못됨",
          description:
            "자동 pages-build-deployment가 source: . 로 Jekyll 빌드를 수행하면서 dist 대신 소스 파일을 업로드했습니다.",
          badge: "원인",
        },
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "dist를 main에 커밋",
          description:
            "Pages branch source와 맞출 수 있지만 빌드 산출물이 소스 브랜치에 섞입니다. Vite 프로젝트의 관리 경계가 흐려집니다.",
          badge: "미채택",
        },
        {
          title: "gh-pages 브랜치로 산출물 배포",
          description:
            "유효한 방식이지만 현재 workflow는 actions/deploy-pages로 Pages artifact를 직접 배포하는 구조라 별도 브랜치가 필요하지 않습니다.",
          badge: "보류",
        },
        {
          title: "GitHub Actions 배포로 단일화",
          description:
            "Pages build_type을 workflow로 다시 저장하고 커스텀 deploy workflow만 dist를 업로드하도록 유지합니다.",
          badge: "채택",
        },
        {
          title: ".nojekyll 추가",
          description:
            "public/.nojekyll을 추가해 dist에도 .nojekyll이 포함되도록 했습니다. 산출물이 Jekyll 전처리 대상이 아님을 명확히 남깁니다.",
          badge: "방어",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "list",
      items: [
        "curl로 배포 URL의 index.html을 확인해 %BASE_URL%과 /src/main.tsx가 남아 있는지 봅니다.",
        "curl -I로 dist가 참조하는 JS 에셋 URL이 200인지 확인합니다.",
        "gh run view <run-id> --log 로 pages-build-deployment 로그를 확인합니다.",
        "로그에 actions/jekyll-build-pages@v1, source: ., Upload artifact 목록의 ./src/가 보이면 소스 루트 배포로 판단합니다.",
        "gh api --method PUT repos/<owner>/<repo>/pages -F build_type=workflow 로 Pages 설정을 GitHub Actions 배포 방식으로 다시 저장합니다.",
        "정상 커스텀 deploy workflow를 재실행해 dist artifact를 다시 배포합니다.",
        "public/.nojekyll을 추가해 이후 빌드 산출물에도 .nojekyll이 포함되도록 합니다.",
      ],
    },
    {
      type: "code",
      language: "bash",
      filename: "확인과 복구에 사용한 명령",
      code: "pnpm build\ncurl -I https://jongeunlee310.github.io/portfolio/assets/index-pwyY_dEO.js\ngh run view 26411441505 --log --repo JongEunLee310/portfolio\ngh api --method PUT repos/JongEunLee310/portfolio/pages -F build_type=workflow\ngh run rerun 26411442074 --repo JongEunLee310/portfolio",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "배포 index.html",
          before: "%BASE_URL% 미치환, /src/main.tsx 직접 참조",
          after: "/portfolio/assets/index-pwyY_dEO.js 번들 참조",
          change: "복구",
        },
        {
          label: "JS 에셋 응답",
          before: "HTTP 404",
          after: "HTTP 200",
          change: "복구",
        },
        {
          label: "Pages artifact",
          before: "Jekyll source: . 결과물",
          after: "커스텀 workflow의 dist 결과물",
          change: "정정",
        },
        {
          label: "Jekyll 처리 여부",
          before: "산출물에 .nojekyll 없음",
          after: "public/.nojekyll 추가로 dist/.nojekyll 생성",
          change: "방어",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "커스텀 Deploy to GitHub Pages workflow를 재실행한 뒤 배포 URL의 index.html은 빌드 산출물과 동일한 형태로 내려왔습니다. JS 에셋도 HTTP 200으로 응답해 브라우저가 Vite 번들을 정상 로드할 수 있게 됐습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "GitHub Pages 설정과 .github/workflows/deploy.yml은 별개의 제어면입니다. workflow 파일이 맞아도 Pages 설정이 branch source를 유지하면 자동 Jekyll 배포가 개입할 수 있습니다.",
        "배포 장애를 볼 때는 Actions 성공 여부보다 실제 서비스 URL의 HTML과 asset 응답을 먼저 확인해야 합니다.",
        "Vite 프로젝트에서 %BASE_URL%이 그대로 보이면 빌드 산출물이 아니라 소스 index.html이 서빙되고 있다는 강한 신호입니다.",
        ".nojekyll은 자동 Jekyll 배포를 끄는 주된 해결책은 아니지만, GitHub Pages에 올리는 정적 산출물이 Jekyll 사이트가 아니라는 의도를 명확히 남기는 방어 장치입니다.",
        "다음 main push 후 pages-build-deployment가 다시 생기는지 확인해야 합니다. 다시 생기면 GitHub UI의 Settings > Pages > Build and deployment > Source를 GitHub Actions로 확실히 전환해야 합니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "multirepo-ci-duplication-and-drift",
    "event-schema-versioning-deploy-order",
  ],
};
