import { useEffect } from "react";

export function useSeo(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
