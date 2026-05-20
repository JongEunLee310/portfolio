import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { HomeNoteCard } from "@/components/note/HomeNoteCard";
import type { TechnicalNoteCard } from "@/types/note";

type HomeNoteCarouselProps = {
  notes: TechnicalNoteCard[];
};

const SCROLL_DISTANCE = 304;

export function HomeNoteCarousel({ notes }: HomeNoteCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    scrollRef.current?.scrollBy({
      left: -SCROLL_DISTANCE,
      behavior: "smooth",
    });
  };

  const scrollNext = () => {
    scrollRef.current?.scrollBy({
      left: SCROLL_DISTANCE,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={scrollPrev}
          className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-white transition hover:bg-white/10"
          aria-label="이전 기술 노트"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-white transition hover:bg-white/10"
          aria-label="다음 기술 노트"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {notes.map((note, index) => (
          <div key={note.slug} className="snap-start">
            <HomeNoteCard note={note} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
