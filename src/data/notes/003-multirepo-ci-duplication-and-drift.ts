import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const multirepoCI: TechnicalNoteCard = {
  slug: "003-multirepo-ci-duplication-and-drift",
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
};
