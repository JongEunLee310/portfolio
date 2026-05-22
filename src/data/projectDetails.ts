import type { ProjectDetail } from "@/types/project";
import { aiDevopsOrchestrationPlatformDetail } from "./project-details/ai-devops-orchestration-platform";
import { goormBankProblemBankDetail } from "./project-details/goorm-bank-problem-bank";
import { haloDetail } from "./project-details/halo";
import { smartFarmDetail } from "./project-details/smart-farm";
import { theListeningTreeDetail } from "./project-details/the-listening-tree";

export const projectDetails: ProjectDetail[] = [
  aiDevopsOrchestrationPlatformDetail,
  haloDetail,
  theListeningTreeDetail,
  smartFarmDetail,
  goormBankProblemBankDetail,
];
