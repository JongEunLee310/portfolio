import { Maximize2 } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type { ProjectDetail } from "@/types/project";

type ProjectScreenshotGallerySectionProps = {
  projectTitle: string;
  screenshots: ProjectDetail["screenshots"];
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

export function ProjectScreenshotGallerySection({
  projectTitle,
  screenshots,
}: ProjectScreenshotGallerySectionProps) {
  const visibleScreenshots = screenshots.filter(
    (screenshot) => hasText(screenshot.title) && hasText(screenshot.image),
  );

  if (visibleScreenshots.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.screenshots.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.screenshots.title}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleScreenshots.map((screenshot) => (
          <article
            key={`${screenshot.title}-${screenshot.image}`}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card"
          >
            <a
              href={screenshot.image}
              target="_blank"
              rel="noreferrer"
              className="group relative block"
              aria-label={`${screenshot.title} ${PROJECT_DETAIL_LABELS.screenshots.zoomLabel}`}
            >
              <img
                src={screenshot.image}
                alt={`${projectTitle} ${screenshot.title}`}
                className="aspect-[16/9] w-full bg-slate-100 object-cover"
              />
              <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950/80 text-white opacity-90 transition group-hover:bg-blue-600">
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
            <div className="px-4 py-3 text-center">
              <h3 className="text-sm font-semibold text-slate-800">
                {screenshot.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
