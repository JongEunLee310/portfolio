import type { TechnicalNoteDetail } from "@/types/note";
import { multirepoCI } from "../notes/multirepo-ci-duplication-and-drift";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const multirepoCIDetail: TechnicalNoteDetail = {
  ...multirepoCI,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "4개 서비스(auth_service, auto_response, memory_service, user_service)를 각각 독립 git 레포지토리로 운영하면서 CI 워크플로우를 복붙하는 과정에서 실수가 누적됐습니다. memory_service와 user_service의 GitHub Actions 워크플로우 이름이 'The Tree Auth Service CI'로 잘못 복사된 채 배포됐습니다.",
    },
    {
      type: "paragraph",
      content:
        "이름 불일치 외에도 fastapi 버전이 서비스마다 달랐고(auth/memory/user는 ^0.115.7, auto_response는 ^0.115.11), GitHub Secrets를 4개 레포에 각각 수동으로 등록해야 하는 구조적 문제도 있었습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "공유 수단의 부재: 멀티레포 구조에서는 서비스 간 CI 워크플로우를 직접 공유할 수 없습니다. 공통 내용을 각 레포에 수동으로 복붙하다 보면 서비스별로 수정해야 하는 부분(이름, 소스 경로 등)을 빠뜨리는 실수가 발생합니다.",
        "의존성 버전 불일치: 각 서비스가 독립적인 pyproject.toml과 poetry.lock을 가지므로, 한 서비스에서 fastapi를 업그레이드해도 다른 서비스에는 전파되지 않습니다.",
        "Secrets 중복 관리: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SONAR_TOKEN 등을 4개 레포마다 등록해야 하며, 한 곳에서 키가 교체되면 나머지도 수동으로 갱신해야 합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "CI 워크플로우 이름 수정",
          description:
            "memory_service_CI.yml과 user_service_CI.yml의 name 필드를 각 서비스명으로 수정합니다. 'The Tree Auth Service CI' → 'The Tree Memory Service CI', 'The Tree User Service CI'.",
          badge: "즉시 수정",
        },
        {
          title: "GitHub Reusable Workflows 검토",
          description:
            "공통 CI 단계를 별도 워크플로우 파일로 분리하고 각 레포에서 uses 키워드로 참조합니다. 서비스별 차이(소스 경로, 프로젝트 키)는 with 입력으로 전달합니다.",
          badge: "중기 방향",
        },
        {
          title: "Organization Secrets 활용",
          description:
            "레포 단위 Secrets 대신 GitHub Organization Secrets를 사용하면 AWS_ACCESS_KEY_ID 같은 공통 시크릿을 Organization 수준에서 관리할 수 있습니다.",
          badge: "장기 방향",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "Reusable Workflows를 도입하면 각 서비스의 CI 파일에서 공통 워크플로우를 참조하는 방식으로 구성할 수 있습니다. 서비스별 차이(소스 경로, SonarCloud 프로젝트 키)는 with 입력으로 주입합니다.",
    },
    {
      type: "code",
      language: "yaml",
      filename: "memory_service_CI.yml",
      code: "name: The Tree Memory Service CI  # 수정 전: The Tree Auth Service CI\n\non:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  build:\n    uses: org/workflows/.github/workflows/python-ci.yml@main\n    with:\n      service-name: memory_service\n      sonar-project-key: memory_service_key",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "memory_service CI 이름",
          before: "The Tree Auth Service CI",
          after: "The Tree Memory Service CI",
          change: "서비스별 구분 가능",
        },
        {
          label: "user_service CI 이름",
          before: "The Tree Auth Service CI",
          after: "The Tree User Service CI",
          change: "서비스별 구분 가능",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "CI 대시보드에서 각 서비스의 워크플로우가 정확한 이름으로 표시되어 실행 기록을 서비스별로 구분할 수 있게 됐습니다. fastapi 버전 불일치와 Secrets 중복 관리 문제는 구조적 원인에서 비롯되므로 ADR을 통해 접근 방식의 한계를 기록하고 장기 개선 방향을 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "멀티레포 구조에서 공통 설정을 복붙으로 관리하면 즉각적인 실수뿐 아니라 시간이 지날수록 서비스 간 불일치가 누적됩니다. CI 이름 실수처럼 작은 문제도 운영 중 디버깅 시 혼란을 일으킵니다. 공유 수단(Reusable Workflows, Organization Secrets)을 초기에 설계하지 않으면, 서비스가 늘어날수록 유지 비용이 선형이 아니라 제곱에 가깝게 증가합니다.",
    },
  ],
  relatedNoteSlugs: [
    "google-oauth-exception-masking",
    "stateless-prompt-context-loss",
  ],
};
