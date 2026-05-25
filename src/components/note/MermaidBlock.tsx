import { useEffect, useId, useRef } from "react";
import { useTheme } from "@/app/theme/useTheme";

type MermaidBlockProps = {
  code: string;
};

export function MermaidBlock({ code }: MermaidBlockProps) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
      });

      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, code);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-sm text-red-400 p-4">${code}</pre>`;
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [code, id, resolvedTheme]);

  return (
    <figure className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card">
      <div ref={containerRef} className="flex justify-center" />
    </figure>
  );
}
