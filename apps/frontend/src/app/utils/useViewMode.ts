import { useState } from "react";

export type ViewMode = "cards" | "list";

/**
 * Cards or a list, remembered in this browser for each place (the front page, «Finn en oppgave»)
 * on its own.
 */
export function useViewMode(place: string, initial: ViewMode = "cards") {
  const key = `lessoneditor.view.${place}`;
  const [mode, setMode] = useState<ViewMode>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === "cards" || stored === "list" ? stored : initial;
    } catch {
      return initial;
    }
  });
  const choose = (next: ViewMode) => {
    setMode(next);
    try {
      localStorage.setItem(key, next);
    } catch {
      // Without storage the choice lasts until the page is left.
    }
  };
  return [mode, choose] as const;
}
