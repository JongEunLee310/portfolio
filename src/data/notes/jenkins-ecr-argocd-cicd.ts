import type { TechnicalNoteCard } from "@/types/note";

export const jenkinsEcrArgoCdCicd: TechnicalNoteCard = {
  slug: "jenkins-ecr-argocd-cicd",
  title: "Jenkins + ECR + Argo CD CI/CD 파이프라인 구성",
  summary:
    "Jenkins로 Docker 이미지를 빌드하고 ECR에 Push한 뒤 Argo CD로 Kubernetes Manifest 기반 배포를 자동화한 CI/CD 구성 기록입니다.",
  category: "architecture",
  thumbnail: "/images/notes/jenkins-argocd-cicd.svg",
  date: "2022.10.28",
  readingTime: "12분 읽기",
  tags: [
    { name: "Jenkins", category: "devops" },
    { name: "Amazon ECR", category: "infra" },
    { name: "Argo CD", category: "devops" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
};
