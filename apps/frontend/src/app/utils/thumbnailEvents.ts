/**
 * "Lesson X has a new thumbnail". The thumbnail is taken 15–20 s after the editor is left, when
 * the front page has already loaded its pictures; the pages listen and fetch that one again
 * (N6). Module-level, because each page mounts its own contexts.
 */
const target = new EventTarget();

export function announceThumbnail(lessonId: number) {
  target.dispatchEvent(new CustomEvent<number>("thumbnail", { detail: lessonId }));
}

/** Calls back with the lesson id of each new thumbnail; returns the unsubscribe function. */
export function onThumbnail(callback: (lessonId: number) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<number>).detail);
  target.addEventListener("thumbnail", listener);
  return () => target.removeEventListener("thumbnail", listener);
}
