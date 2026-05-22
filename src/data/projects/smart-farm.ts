import { PATHS } from "@/constants/paths";
import type { ProjectCard } from "@/types/project";

export const smartFarm: ProjectCard = {
  slug: "smart-farm",
  title: "스마트팜 재배기 모니터링 시스템",
  subtitle: "클라우드 기반 실시간 모니터링 및 원격 제어",
  summary:
    "원격지 센서 데이터를 Azure VM에서 실시간 수집하고 REST API와 Monitoring Engine을 통해 이상 감지, 알림, 원격 디바이스 제어 기능을 제공한 스마트팜 시스템",
  description:
    "Azure Cloud 기반 IoT 센서 데이터 수집, 이상 감지, 원격 디바이스 제어 플랫폼. DAS와 ModbusTCP로 통신하는 Data Collector, Monitoring Engine, Device Controller를 구성했다.",
  thumbnail: "/images/projects/smart-farm/thumbnail.svg",
  category: ["backend", "iot"],
  type: "team",
  status: "normal",
  period: "2022.03 - 2022.07",
  role: "원격 데이터 수집 / DB 업로드 / 디바이스 제어 기능 개발",
  techStack: [
    { name: "Java", category: "language" },
    { name: "REST API", category: "backend" },
    { name: "MySQL", category: "database" },
    { name: "Azure", category: "infra" },
    { name: "ModbusTCP", category: "messaging" },
  ],
  links: {
    detail: PATHS.projectDetail("smart-farm"),
  },
};
