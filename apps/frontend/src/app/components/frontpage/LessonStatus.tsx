import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { LessonDTO, LessonPullRequest, paths } from "@lessoneditor/contracts";

/**
 * Where each submitted lesson's pull request stands, for the cards. Asked once per visit to the
 * front page and only when something was submitted; until it answers (or if GitHub does not), a
 * submitted card just says «Sendt inn».
 */
export function useLessonPullRequests(userId: number | undefined, lessons: LessonDTO[]) {
  const [pullRequests, setPullRequests] = useState<Record<number, LessonPullRequest>>({});
  const anySubmitted = lessons.some((lesson) => lesson.submitted);
  useEffect(() => {
    if (!userId || !anySubmitted) return;
    let active = true;
    axios
      .get<Record<number, LessonPullRequest>>(
        paths.USER_LESSON_PULL_REQUESTS.replace(":userId", String(userId)),
      )
      .then(({ data }) => active && setPullRequests(data))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [userId, anySubmitted]);
  return pullRequests;
}

const LOOK: Record<
  "merged" | "open" | "closed",
  { text: string; icon: SemanticICONS; title: string; className: string }
> = {
  merged: {
    text: "Publisert",
    icon: "check circle",
    title: "Tatt med i oppgavene på kidsakoder.no",
    className: "lesson-status--merged",
  },
  open: {
    text: "Sendt inn",
    icon: "paper plane outline",
    title: "Venter på gjennomgang hos Lær Kidsa Koding",
    className: "lesson-status--open",
  },
  closed: {
    text: "Ikke tatt med",
    icon: "minus circle",
    title: "Forslaget ble lukket uten å bli tatt med",
    className: "lesson-status--closed",
  },
};

/** The small tag on a card: submitted, published or not taken. Links to the pull request. */
const LessonStatus: FC<{ lesson: LessonDTO; pullRequest?: LessonPullRequest }> = ({
  lesson,
  pullRequest,
}) => {
  if (!lesson.submitted) return null;
  const look = LOOK[pullRequest?.state ?? "open"];
  const date = lesson.submitted_at
    ? ` ${new Date(lesson.submitted_at).toLocaleDateString("nb-NO")}`
    : "";
  const title = `${look.title}. Sendt inn${date}.`;
  const content = (
    <>
      <Icon name={look.icon} aria-hidden="true" />
      {look.text}
    </>
  );
  return pullRequest ? (
    <a
      className={`lesson-status ${look.className}`}
      href={pullRequest.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${title} Åpne forslaget på GitHub.`}
      // The card itself opens the lesson.
      onClick={(event) => event.stopPropagation()}
    >
      {content}
    </a>
  ) : (
    <span className={`lesson-status ${look.className}`} title={title}>
      {content}
    </span>
  );
};

export default LessonStatus;
