import { PATHS } from "@/constants/paths";
import type { RouteMeta } from "@/types/route";

export const routeMeta: RouteMeta[] = [
  { path: PATHS.home, label: "Home", public: true },
  { path: PATHS.projects, label: "Projects", public: true },
  { path: PATHS.technicalNotes, label: "Technical Notes", public: true },
  { path: PATHS.about, label: "About", public: true },
  { path: PATHS.contact, label: "Contact", public: true },
  { path: PATHS.notFound, label: "Not Found", public: true },
];
