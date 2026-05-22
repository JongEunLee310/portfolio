import { TROUBLESHOOTING_NOTE_TEMPLATE } from "@/constants/noteDetail";
import type { TechnicalNoteDetail } from "@/types/note";

export const troubleshootingToc: TechnicalNoteDetail["toc"] =
  TROUBLESHOOTING_NOTE_TEMPLATE.sections.map((section) => ({
    id: section.id,
    title: section.tocTitle,
    depth: 1,
  }));

export function troubleshootingHeading(sectionIndex: number) {
  const section = TROUBLESHOOTING_NOTE_TEMPLATE.sections[sectionIndex];

  if (!section) {
    throw new Error(`트러블슈팅 템플릿 섹션 인덱스가 잘못되었습니다: ${sectionIndex}`);
  }

  return {
    type: "heading",
    id: section.id,
    title: section.headingTitle,
  } as const;
}

export { TROUBLESHOOTING_NOTE_TEMPLATE };
