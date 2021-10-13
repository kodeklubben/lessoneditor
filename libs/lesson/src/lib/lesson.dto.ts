export interface LessonDTO {
  lessonId: number;

  lessonSlug: string;

  lessonTitle: string;

  courseSlug: string;

  courseTitle: string;

  created_by: string;

  updated_by: string;

  created_at: Date;

  updated_at: Date;

  thumbUrl?: string;
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
}

interface Subtag {
  grade: string[];
  subject: string[];
  topic: string[];
}

export interface YamlContent {
  level: number;
  license: string;
  tags: Subtag;
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

  createdByUserId: number;
}
export interface UpdatedFileDTO {
  fileId: number;

  content: string;

  updatedByUserId: string;
}

export interface LessonFilterDTO {
  userId?: number;
}
