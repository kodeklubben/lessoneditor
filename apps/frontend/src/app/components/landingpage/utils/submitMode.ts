import { LessonDTO, LessonPullRequest } from "@lessoneditor/contracts";

export type SubmitMode = "new" | "update" | "again";

/**
 * What «Sende inn» does now (3): the first submission; while the pull request is open, an update
 * to it; after it was merged or closed, a new one, which the dialog asks about.
 */
export function submitMode(lesson: LessonDTO, pullRequest?: LessonPullRequest): SubmitMode {
  if (!lesson.submitted) return "new";
  return (pullRequest?.state ?? "open") === "open" ? "update" : "again";
}

export const SUBMIT_LABEL: Record<SubmitMode, string> = {
  new: "Send inn",
  update: "Send oppdatering",
  again: "Send inn på nytt",
};
