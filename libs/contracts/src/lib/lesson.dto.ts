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

  /** For texts: the version of the content, sent back as `base` when saving it. */
  version?: string;

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
  /** The version the change was made to; the server refuses it (409) if the text changed since. */
  base?: string;
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
  /**
   * The language a text was copied from to be translated (nb, nn …). The editor says so until
   * the translator marks it done; it is never submitted.
   */
  copiedFrom?: string;
}

/** Where a submitted lesson's pull request on the lesson repo stands. */
export type PullRequestState = "open" | "merged" | "closed";

export interface LessonPullRequest {
  state: PullRequestState;
  url: string;
}

/** A topic, subject or grade tag from the lesson repo's filtertags, with its Norwegian name. */
export interface CatalogTag {
  value: string;
  name: string;
}

/** The courses one can write lessons in, and the tags, as the lesson repo has them (#335). */
export interface LessonCatalog {
  courses: { value: string; text: string }[];
  topic: CatalogTag[];
  subject: CatalogTag[];
  grade: CatalogTag[];
}

/** A lesson in the lesson repo, for finding it and making a copy from the front page. */
export interface CatalogLesson {
  course: string;
  courseTitle: string;
  /** The lesson's folder, also its name in /rediger/<course>/<lesson>. */
  slug: string;
  /** Its main text's name, for its page on oppgaver.kidsakoder.no (<course>/<slug>/<text>). */
  text: string;
  title: string;
  level?: number;
  /** The texts' languages (nb, nn, en …), bokmål first. */
  languages: string[];
  teacherGuide: boolean;
  tags: { topic: string[]; subject: string[]; grade: string[] };
  /** The lesson's own picture in the repo (src/<course>/<lesson>/<lesson>.png), if it has one. */
  image?: string;
}
