import { externalLinks } from "@/constants/externalLinks";
import type { ContactData } from "@/types/contact";

export const contactData: ContactData = {
  sections: {
    contact: {
      id: "contact",
      eyebrow: "CONTACT",
      title: "연락하기",
      description:
        "프로젝트 제안, 백엔드 협업, 기술적인 논의가 필요하다면 이메일 또는 채용 플랫폼을 통해 편하게 연락해주세요.",
    },
    faq: {
      id: "faq",
      eyebrow: "FAQ",
      title: "자주 묻는 질문",
    },
    collaboration: {
      id: "collaboration",
      eyebrow: "COLLABORATION",
      title: "함께하는 방식",
    },
  },
  channels: [
    {
      label: "Email",
      value: "whddms1208@gmail.com",
      href: externalLinks.email,
      icon: "Mail",
      external: true,
    },
    {
      label: "GitHub",
      value: "github.com/JongEunLee310",
      href: externalLinks.github,
      icon: "Github",
      external: true,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/jong-eun-lee-5094ab240",
      href: externalLinks.linkedin,
      icon: "ExternalLink",
      external: true,
    },
    {
      label: "GitLab",
      value: "gitlab.com/SighingOwl",
      href: externalLinks.gitlab,
      icon: "ExternalLink",
      external: true,
    },
    {
      label: "Wanted",
      value: "wanted 프로필 보기",
      href: externalLinks.wanted,
      icon: "ExternalLink",
      external: true,
    },
    {
      label: "이력서 다운로드",
      value: "PDF 파일로 이력서 받기",
      href: externalLinks.resumePdf,
      icon: "FileDown",
      external: true,
    },
  ],
  faq: [
    {
      question: "어떤 포지션을 희망하나요?",
      answer:
        "백엔드 신입 개발자 포지션을 희망합니다. Python FastAPI나 Java Spring Boot를 사용하는 팀에 합류해 API 설계, 데이터베이스, 배포 경험을 바탕으로 빠르게 기여하고 싶습니다.",
    },
    {
      question: "신입 개발자로서 어떤 강점이 있나요?",
      answer:
        "문제를 작게 나누어 원인을 찾고, 학습한 내용을 코드와 문서로 남기는 습관이 있습니다. 모르는 부분은 빠르게 확인하고 팀의 피드백을 반영해 개선합니다.",
    },
    {
      question: "새로운 기술은 어떻게 배우시나요?",
      answer:
        "공식 문서를 확인하는 경우도 있지만, 요즘에는 Claude Code, Codex, GitHub Copilot 같은 AI 도구의 도움을 많이 받는 편입니다. 개인 프로젝트를 함께 개발하면서 적용해보고, 학습한 내용은 기술 노트로 남겨 다시 설명할 수 있는 수준까지 정리합니다.",
    },
    {
      question: "채용 관련 연락은 어떻게 하면 되나요?",
      answer:
        "Wanted 프로필을 통해 연락하시거나, 그룹바이·사람인·점핏 등 채용 플랫폼 내 메시지 기능을 이용해 주세요. 이메일로도 연락 가능하며, 포지션 정보와 주요 업무, 사용 기술 스택을 함께 보내주시면 확인 후 답변드리겠습니다.",
    },
  ],
  values: [
    {
      title: "문제 해결 중심",
      description:
        "단순 구현이 아니라 비즈니스 문제 해결을 목표로 기술적 솔루션을 제안합니다.",
      icon: "Gauge",
    },
    {
      title: "기술적 소통",
      description:
        "요구사항, 제약 조건, 의사결정 이유를 문서와 리뷰로 투명하게 공유합니다.",
      icon: "MessageSquare",
    },
    {
      title: "지속적 개선",
      description:
        "작게 검증하고 운영 지표를 확인하며 구조와 개발 흐름을 꾸준히 개선합니다.",
      icon: "Workflow",
    },
  ],
};
