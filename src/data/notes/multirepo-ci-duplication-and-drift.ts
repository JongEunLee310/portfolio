import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const multirepoCI: TechnicalNoteCard = {
  slug: "multirepo-ci-duplication-and-drift",
  title: "멀티레포 CI 복붙 관리의 한계와 이름 불일치 문제",
  summary:
    "GitHub Actions 워크플로우를 복붙으로 관리할 때 name 필드 누락이 CI 대시보드를 혼란스럽게 만든 문제와 수정 과정을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/multirepo-ci-drift.svg"),
  date: "2025.02.05",
  readingTime: "4분 읽기",
  tags: [
    { name: "GitHub Actions", category: "devops" },
    { name: "Docker", category: "infra" },
  ],
  relatedProjectSlugs: ["the-listening-tree"],
  cardSummary: {
    title: "멀티레포 CI 이름 불일치",
    problem: "auth_service CI를 복붙하면서 name 필드 수정 누락. memory_service·user_service가 GitHub Actions에서 'The Tree Auth Service CI'로 표시.",
    solution: "memory_service, user_service 워크플로우 name 필드를 각 서비스명으로 수정.",
    result: "CI 대시보드에서 서비스별 워크플로우 구분 가능.",
  },
};
