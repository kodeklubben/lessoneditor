import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { announceThumbnail } from "./thumbnailEvents";

/**
 * The server's message for a refused import (4xx), otherwise a general one. Validation errors
 * (400) come as a list of field messages, which mean nothing to a teacher.
 */
export function importErrorMessage(error: unknown): string {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
    ?.response;
  const status = response?.status ?? 500;
  if (status === 400 && typeof response?.data?.message !== "string")
    return "Adressen peker ikke på en oppgave. Den skal se slik ut: /rediger/<kurs>/<oppgave>, for eksempel /rediger/scratch/asteroids.";
  return typeof response?.data?.message === "string" && status < 500
    ? response.data.message
    : "Kunne ikke hente oppgaven fra GitHub. Prøv igjen litt senere.";
}

/** Asks for the copy's first thumbnail, of the text the server chose. */
async function makeThumbnail(lessonId: number, text: string) {
  try {
    const { data: made } = await axios.put<boolean>(
      paths.LESSON_FILE_UPDATE_THUMB.replace(":lessonId", String(lessonId)).replace(
        ":filename",
        encodeURIComponent(text),
      ),
    );
    if (made === true) announceThumbnail(lessonId, text);
  } catch {
    // Cosmetic: the thumbnail is made again after the first edit.
  }
}

/**
 * Copies a lesson from the lesson repo to the user, or finds their copy of it (existing). Used
 * by /rediger/<course>/<lesson> and by «Finn en oppgave» on the front page.
 */
export async function copyLessonFromRepo(
  userId: number,
  course: string,
  lesson: string,
  courseTitle?: string,
): Promise<{ lessonId: number; existing: boolean }> {
  const { data } = await axios.post<{
    lessonId: number;
    existing: boolean;
    thumbnailFrom: string | null;
  }>(paths.USER_LESSON_IMPORT.replace(":userId", String(userId)), { course, lesson, courseTitle });
  // A thumbnail right away instead of after the first edit, while the copy has none; it takes a
  // few seconds and the page shows a neutral picture meanwhile.
  if (data.thumbnailFrom) void makeThumbnail(data.lessonId, data.thumbnailFrom);
  return { lessonId: data.lessonId, existing: data.existing };
}
