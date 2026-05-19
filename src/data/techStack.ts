import type { IconName, TechTag } from "@/types/common";

export type TechStackGroup = {
  title: string;
  description: string;
  icon: IconName;
  items: TechTag[];
};

export const techStackGroups: TechStackGroup[] = [
  {
    title: "Backend",
    description: "서비스 로직과 API 설계",
    icon: "Server",
    items: [
      { name: "Spring Boot", category: "backend" },
      { name: "FastAPI", category: "backend" },
      { name: "Java", category: "language" },
      { name: "Python", category: "language" },
    ],
  },
  {
    title: "Database",
    description: "데이터 모델링과 조회 최적화",
    icon: "Database",
    items: [
      { name: "MySQL", category: "database" },
      { name: "PostgreSQL", category: "database" },
      { name: "Redis", category: "database" },
      { name: "QueryDSL", category: "backend" },
    ],
  },
  {
    title: "Infra & DevOps",
    description: "배포와 운영 자동화",
    icon: "Cloud",
    items: [
      { name: "AWS", category: "infra" },
      { name: "Docker", category: "infra" },
      { name: "GitHub Actions", category: "devops" },
      { name: "Nginx", category: "infra" },
    ],
  },
];
