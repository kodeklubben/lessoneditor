import { useEffect, useMemo, useRef, useState } from "react";
import { useFileContext } from "../../contexts/FileContext";
import { AutosaveController, AutosaveStatus } from "../../utils/autosave";

const THUMBNAIL_DELAY = 10000;
const RETRY_DELAY = 10000;

/**
 * The editor's single autosave (K3): one controller per editor, saves the newest text (K2),
 * flushes before navigation and on unload (K4), and updates the thumbnail separately, after the
 * writing has paused, so a slow or failing thumbnail never blocks saving (K5).
 */
export function useAutosave(text: string, loadedText: string | undefined) {
  const { saveFileBody, saveFileBodyOnUnload, updateThumbnail } = useFileContext();
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const latest = useRef({ saveFileBody, saveFileBodyOnUnload, updateThumbnail });
  latest.current = { saveFileBody, saveFileBodyOnUnload, updateThumbnail };
  const thumbnailStale = useRef(false);

  const controller = useMemo(
    () =>
      new AutosaveController({
        save: async (value) => (await latest.current.saveFileBody(value)) === 200,
        onStatus: (next) => {
          if (next === "saved") thumbnailStale.current = true;
          setStatus(next);
        },
      }),
    [],
  );

  useEffect(() => {
    if (loadedText !== undefined) controller.reset(loadedText);
  }, [controller, loadedText]);

  useEffect(() => {
    controller.update(text);
  }, [controller, text]);

  useEffect(() => {
    if (status === "saved") {
      const timer = setTimeout(() => {
        thumbnailStale.current = false;
        void latest.current.updateThumbnail();
      }, THUMBNAIL_DELAY);
      return () => clearTimeout(timer);
    }
    if (status === "error") {
      const timer = setTimeout(() => void controller.flush(), RETRY_DELAY);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [controller, status]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!controller.isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const unload = () => {
      const pending = controller.pendingText;
      if (pending) latest.current.saveFileBodyOnUnload(pending);
    };
    window.addEventListener("beforeunload", warn);
    window.addEventListener("pagehide", unload);
    return () => {
      window.removeEventListener("beforeunload", warn);
      window.removeEventListener("pagehide", unload);
      // Leaving the editor inside the app (logo, back button): save what is left.
      unload();
      controller.dispose();
      if (thumbnailStale.current) {
        thumbnailStale.current = false;
        void latest.current.updateThumbnail();
      }
    };
  }, [controller]);

  return { status, flush: () => controller.flush() };
}
