import { useEffect, useRef } from "react";
import axios from "axios";
import { LessonDTO, paths } from "@lessoneditor/contracts";
import { announceThumbnail } from "./thumbnailEvents";

const PER_VISIT = 3;
const WAIT_MS = 4000;
const FAILED_KEY = "lessoneditor.thumbnailFailed";
const DAY = 24 * 60 * 60 * 1000;

function failedRecently(): Record<string, number> {
  try {
    const failed = JSON.parse(localStorage.getItem(FAILED_KEY) ?? "{}") as Record<string, number>;
    return Object.fromEntries(Object.entries(failed).filter(([, at]) => Date.now() - at < DAY));
  } catch {
    return {};
  }
}

function rememberFailed(lessonId: number) {
  try {
    localStorage.setItem(
      FAILED_KEY,
      JSON.stringify({ ...failedRecently(), [lessonId]: Date.now() }),
    );
  } catch {
    // Without storage a failing lesson is only tried again on the next visit.
  }
}

/**
 * Cards without a picture get one while the front page sits idle: one at a time, at most three
 * per visit, newest first, and only while the tab is visible. The server photographs only a
 * lesson that still has no picture, so a second tab or a repeat asks for nothing. A lesson that
 * fails is left alone for a day. No job on the server: lessons nobody looks at are never drawn.
 */
export function useThumbnailBackfill(missing: number[], lessons: LessonDTO[]) {
  const latest = useRef({ missing, lessons });
  latest.current = { missing, lessons };
  const started = useRef(false);
  // Stops the queue when the page is left, not when the list changes (a picture just made
  // takes its lesson off the list).
  const left = useRef(false);
  useEffect(() => {
    left.current = false;
    return () => {
      left.current = true;
    };
  }, []);

  useEffect(() => {
    if (started.current || missing.length === 0) return undefined;
    // Once per visit, after the page has settled (the cards' pictures are loaded by then).
    const timer = window.setTimeout(async () => {
      started.current = true;
      const failed = failedRecently();
      const updated = new Map(latest.current.lessons.map((l) => [l.lessonId, l.updated_at]));
      const queue = [...latest.current.missing]
        .filter((id) => !failed[id])
        .sort((a, b) => String(updated.get(b)).localeCompare(String(updated.get(a))))
        .slice(0, PER_VISIT);
      for (const lessonId of queue) {
        if (left.current || document.hidden) return;
        try {
          const { data } = await axios.put<{ text: string | null }>(
            paths.LESSON_THUMB.replace(":lessonId", String(lessonId)),
          );
          // The card fetches its picture again (UserContext listens).
          if (data.text) announceThumbnail(lessonId);
        } catch {
          rememberFailed(lessonId);
        }
      }
    }, WAIT_MS);
    // The list fills in as the pictures load: wait until it has been still for a moment.
    return () => window.clearTimeout(timer);
  }, [missing.length]);
}
