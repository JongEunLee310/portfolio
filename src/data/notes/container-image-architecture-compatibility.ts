import type { TechnicalNoteCard } from "@/types/note";

export const containerImageArchitectureCompatibility: TechnicalNoteCard = {
  slug: "container-image-architecture-compatibility",
  title: "컨테이너 이미지 CPU 아키텍처 호환성 문제 (arm64 vs amd64)",
  summary:
    "arm64 환경에서 빌드한 Docker 이미지를 amd64 노드에 배포할 때 발생하는 호환성 문제와 대응 방법을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: "/images/notes/container-arch.svg",
  date: "2022.11.01",
  readingTime: "6분 읽기",
  tags: [
    { name: "Docker", category: "devops" },
    { name: "Kubernetes", category: "infra" },
    { name: "AWS EKS", category: "infra" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
};
