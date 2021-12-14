export interface LessonDTO {
  lessonId: number;

  lessonSlug: string;

  lessonTitle: string;

  courseSlug: string;

  courseTitle: string;

  submitted: boolean;

  created_by: string;

  updated_by: string;

  created_at: Date;

  updated_at: Date;

  language?: string;
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
  authorList: string[];
  translatorList: string[];
  translator: string;
  language: string;
  author: string;
}
