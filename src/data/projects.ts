import type { ProjectCard } from "@/types/project";
import { aiDevopsOrchestrationPlatform } from "./projects/ai-devops-orchestration-platform";
import { goormBankProblemBank } from "./projects/goorm-bank-problem-bank";
import { halo } from "./projects/halo";
import { smartFarm } from "./projects/smart-farm";
import { theListeningTree } from "./projects/the-listening-tree";

export const projects: ProjectCard[] = [
  aiDevopsOrchestrationPlatform,
  halo,
  theListeningTree,
  smartFarm,
  goormBankProblemBank,
];
