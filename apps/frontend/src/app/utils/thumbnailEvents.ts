/**
 * "Text Y of lesson X has a new thumbnail" (without Y: the lesson's own preview). The thumbnail is taken 15–20 s after the editor is left, when
 * the front page has already loaded its pictures; the pages listen and fetch that one again
 * (N6). Module-level, because each page mounts its own contexts.
 */
const target = new EventTarget();

type Detail = { lessonId: number; filename?: string };

export function announceThumbnail(lessonId: number, filename?: string) {
  target.dispatchEvent(new CustomEvent<Detail>("thumbnail", { detail: { lessonId, filename } }));
}

/** Calls back for each new thumbnail; returns the unsubscribe function. */
export function onThumbnail(callback: (lessonId: number, filename?: string) => void): () => void {
  const listener = (event: Event) => {
    const { lessonId, filename } = (event as CustomEvent<Detail>).detail;
    callback(lessonId, filename);
  };
  target.addEventListener("thumbnail", listener);
  return () => target.removeEventListener("thumbnail", listener);
}
