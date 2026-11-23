import { useEffect, useState } from "react";
import axios from "axios";
import { CatalogLesson, paths } from "@lessoneditor/contracts";

const STORAGE_KEY = "lessoneditor.catalogLessons.v1";
/** Older than this, the list is shown at once and read again behind it. */
const FRESH_MS = 10 * 60 * 1000;

type Stored = { at: number; lessons: CatalogLesson[] };

let memory: Stored | undefined;
let request: Promise<Stored | undefined> | undefined;
const listeners = new Set<(stored: Stored) => void>();

function readStorage(): Stored | undefined {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return stored && Array.isArray(stored.lessons) ? stored : undefined;
  } catch {
    return undefined;
  }
}

function fetchLessons(): Promise<Stored | undefined> {
  request ??= axios
    .get<CatalogLesson[] | null>(paths.CATALOG_LESSONS)
    .then(({ data }) => {
      if (!data?.length) return memory;
      memory = { at: Date.now(), lessons: data };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
      } catch {
        // Full or blocked storage: the list is kept for this visit.
      }
      listeners.forEach((listener) => listener(memory!));
      return memory;
    })
    .catch(() => memory)
    .finally(() => {
      request = undefined;
    });
  return request;
}

/**
 * Starts reading the lesson list before anyone asks for it (the front page calls it when it has
 * loaded), so «Finn en oppgave» opens with the list ready. The first read on the server takes
 * a few seconds; after that it is kept there and in this browser.
 */
export function prefetchLessonCatalog() {
  memory ??= readStorage();
  if (!memory || Date.now() - memory.at > FRESH_MS) void fetchLessons();
}

/**
 * The lessons in the lesson repo: from this browser at once when it has them, read again behind
 * them when they are old (stale while revalidate). Undefined while nothing is there yet; null
 * when the server could not read them.
 */
export function useLessonCatalog(): { lessons: CatalogLesson[] | undefined; failed: boolean } {
  memory ??= readStorage();
  const [stored, setStored] = useState<Stored | undefined>(memory);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    listeners.add(setStored);
    if (!memory || Date.now() - memory.at > FRESH_MS) {
      void fetchLessons().then((result) => {
        if (!result) setFailed(true);
      });
    }
    return () => {
      listeners.delete(setStored);
    };
  }, []);
  return { lessons: stored?.lessons, failed: failed && !stored };
}
