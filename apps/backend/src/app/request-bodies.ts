import {
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import {
  COURSE_SLUG_PATTERN,
  LANGUAGE_PATTERN,
  LESSON_SLUG_PATTERN,
  MAX_SLUG_LENGTH,
  MAX_TITLE_LENGTH,
} from "../../../../libs/contracts/src/lib/validation";

/**
 * Request bodies as classes, so the global ValidationPipe checks types and drops unknown fields.
 * The shared DTOs in libs/contracts stay interfaces: the frontend imports them as well.
 */

export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".gif", ".png"];
export const FILE_EXTENSIONS = [".md", ".yml", ...IMAGE_EXTENSIONS];

/** 5 MB of binary data, base64 encoded; matches the limit shown in the image upload. */
export const MAX_FILE_BASE64_LENGTH = Math.ceil((5 * 1024 * 1024) / 3) * 4;

export class NewLessonBody {
  @IsString()
  @MaxLength(MAX_SLUG_LENGTH)
  @Matches(LESSON_SLUG_PATTERN)
  lessonSlug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(MAX_TITLE_LENGTH)
  lessonTitle!: string;

  @IsString()
  @MaxLength(MAX_SLUG_LENGTH)
  @Matches(COURSE_SLUG_PATTERN)
  courseSlug!: string;

  @IsString()
  @MaxLength(MAX_TITLE_LENGTH)
  courseTitle!: string;

  @IsOptional()
  @IsString()
  @Matches(LANGUAGE_PATTERN)
  language?: string;
}

export class NewFileBody {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_TITLE_LENGTH)
  // Not blank, and no / \ or NUL anywhere.
  @Matches(/^[^/\\\x00]*[^/\\\x00\s][^/\\\x00]*$/, {
    message: "filename must not be blank or contain / or \\",
  })
  filename!: string;

  @IsIn(FILE_EXTENSIONS)
  ext!: string;

  // The size is checked in the controller, which answers 413 instead of 400.
  @IsString()
  content!: string;
}

export class UpdatedFileBody {
  /** Markdown as a string, or the lesson.yml data as an object; the controller checks which. */
  @IsDefined()
  content: unknown;
}

export class ShareLessonBody {
  @IsString()
  @Matches(/^[1-9]\d{0,15}$/, { message: "invitationToUserId must be a GitHub user id" })
  invitationToUserId!: string;
}

export class SubmitLessonBody {
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  message?: string;
}
