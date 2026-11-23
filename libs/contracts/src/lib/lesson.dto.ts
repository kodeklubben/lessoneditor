export interface LessonDTO {
  lessonId: number;

  lessonSlug: string;

  lessonTitle: string;

  courseSlug: string;

  courseTitle: string;

  submitted: boolean;

  submitted_at: Date | null;

  created_by: string;

  updated_by: string;

  created_at: Date;

  updated_at: Date;

  language?: string;

  /** For a copy of a published lesson: its folder in kodeklubben/oppgaver (docs/rediger-oppgave.md). */
  upstream_path?: string | null;

  /** The commit of kodeklubben/oppgaver the copy was made from. */
  upstream_commit?: string | null;
}

export interface ShareLessonDTO {
  invitationToUserId: string;
  invitationByUserId: string;
}

export interface NewLessonDTO {
  lessonSlug: string;

  lessonTitle: string;

  courseSlug: string;

  courseTitle: string;

  language?: string;
}

export interface YamlContent {
  level: number;
  license: string;
  tags: any;
}

export interface FileDTO<T> {
  fileId: number;

  filename: string;

  ext: string;

  content: T;

  created_by?: string;

  updated_by?: string;

  created_at?: Date;

  updated_at?: Date;
}

export interface NewFileDTO {
  filename: string;
  ext: string;
  content: string;
}

export interface UpdatedFileDTO {
  content: string;
}

export interface LessonFilterDTO {
  userId?: number;
}

export interface HeaderData {
  title: string;
  author: string;
  authorList: string[];
  translator: string;
  translatorList: string[];
  language: string;
  /** Set when the text was made by the translate button; shown until someone has reviewed it. */
  machineTranslated?: boolean;
  translatedFrom?: string;
}

/** Where a submitted lesson's pull request on the lesson repo stands. */
export type PullRequestState = "open" | "merged" | "closed";

export interface LessonPullRequest {
  state: PullRequestState;
  url: string;
}
