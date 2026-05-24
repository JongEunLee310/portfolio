import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { TechnicalNoteDetailPage } from "@/pages/TechnicalNoteDetailPage";
import { TechnicalNotesPage } from "@/pages/TechnicalNotesPage";
import { ScrollToTop } from "./ScrollToTop";

export function AppRouter() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path={PATHS.home} element={<HomePage />} />
        <Route path={PATHS.projects} element={<ProjectsPage />} />
        <Route path="/projects/:projectSlug" element={<ProjectDetailPage />} />
        <Route path={PATHS.technicalNotes} element={<TechnicalNotesPage />} />
        <Route
          path="/technical-notes/:noteSlug"
          element={<TechnicalNoteDetailPage />}
        />
        <Route path={PATHS.about} element={<AboutPage />} />
        <Route path={PATHS.contact} element={<ContactPage />} />
        <Route path={PATHS.notFound} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />
      </Routes>
    </HashRouter>
  );
}
