import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { UserDTO } from "@lessoneditor/contracts";
import { User } from "./user.entity";
import { NewLessonDTO, YamlContent, HeaderData } from "@lessoneditor/contracts";
// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import { invalidLessonFields } from "../../../../libs/contracts/src/lib/validation";
import { stringifyLessonMarkdown } from "../../../../libs/contracts/src/lib/frontmatter";
import { FileStore, Lesson, isLessonOwner } from "../lesson/lesson.entity";
import { oppgaveMal, imageTemplate } from "./fileTemplates";
import { GithubService, publishedLessonMessage } from "../github/github.service";

/** Slugs end up as paths in the lesson repo, so they are checked before they are stored. */
export function assertValidLesson(lesson: NewLessonDTO) {
  const invalid = invalidLessonFields(lesson ?? ({} as NewLessonDTO));
  if (invalid.length > 0)
    throw new BadRequestException(`Invalid lesson fields: ${invalid.join(", ")}`);
}

/** The files every new lesson starts with: the lesson text, lesson.yml, the template image and preview.png. */
export function newLessonFiles(
  lesson: NewLessonDTO & { language: string },
  user: Pick<User, "name" | "username">,
): FileStore[] {
  const file = (filename: string, ext: string, content: Buffer) =>
    Object.assign(new FileStore(), {
      filename,
      ext,
      content,
      created_by: user.username,
      updated_by: user.username,
    });
  const yml: YamlContent = {
    level: 1,
    license: "CC BY-SA 4.0",
    tags: { topic: [], subject: [], grade: [] },
  };
  const header: HeaderData = {
    title: lesson.lessonTitle,
    author: "",
    authorList: [user.name || user.username || ""],
    language: lesson.language,
    translator: "",
    translatorList: [],
  };
  const textName =
    lesson.language === "nb" ? lesson.lessonSlug : `${lesson.lessonSlug}_${lesson.language}`;
  return [
    file(textName, ".md", Buffer.from(stringifyLessonMarkdown(header, oppgaveMal))),
    file("lesson", ".yml", Buffer.from(JSON.stringify(yml))),
    file("image_rT34Yx", ".png", Buffer.from(imageTemplate, "base64")),
    // A placeholder until the first thumbnail is taken.
    file("preview", ".png", Buffer.from(" ")),
  ];
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private githubService: GithubService,
  ) {}

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: { lessons: true },
    });
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /** Errors are thrown, not logged: a failed save must fail the login, not return undefined. */
  async addUser(newUser: UserDTO): Promise<User> {
    const user = new User();
    user.userId = newUser.userId;
    user.email = newUser.email;
    user.username = newUser.username;
    user.name = newUser.name;
    user.photo = newUser.photo;
    return this.userRepository.save(user);
  }

  async updateUser(newUser: UserDTO, userId: number): Promise<User> {
    const user = await this.getUser(userId);
    user.email = newUser.email;
    user.username = newUser.username;
    user.name = newUser.name;
    user.photo = newUser.photo;
    return this.userRepository.save(user);
  }

  async getUserLessons(userId: number): Promise<User> {
    return this.getUser(userId);
  }

  /**
   * The lesson, its files and the membership are created together or not at all. Its folder
   * src/<course>/<slug> must be free: a submission writes there, and replaced a published lesson
   * of the same name.
   */
  async addUserLesson(userId: number, lesson: NewLessonDTO, accessToken?: string): Promise<number> {
    // Without a language the text file was named <slug>_undefined.
    const withLanguage = { ...lesson, language: lesson.language ?? "nb" };
    assertValidLesson(withLanguage);
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const own = await this.lessonRepository.findOne({
      where: {
        created_by_id: userId,
        courseSlug: lesson.courseSlug,
        lessonSlug: lesson.lessonSlug,
        upstream_path: IsNull(),
      },
    });
    if (own) {
      throw new ConflictException(
        `Du har allerede en oppgave som heter «${own.lessonTitle}» i dette kurset. Velg et annet navn.`,
      );
    }
    const folder = ["src", lesson.courseSlug, lesson.lessonSlug].join("/");
    let published = false;
    if (accessToken) {
      try {
        published = await this.githubService.lessonFolderExists(accessToken, folder);
      } catch (error) {
        // Checked again, and strictly, when the lesson is submitted.
        this.logger.warn(
          `Could not check ${folder} on GitHub: ${(error as { status?: number }).status}`,
        );
      }
    }
    if (published) throw new ConflictException(publishedLessonMessage(folder));

    return this.lessonRepository.manager.transaction(async (manager) => {
      const newLesson = Object.assign(new Lesson(), {
        lessonTitle: lesson.lessonTitle,
        lessonSlug: lesson.lessonSlug,
        courseSlug: lesson.courseSlug,
        courseTitle: lesson.courseTitle,
        submitted: false,
        submitted_at: null,
        updated_by: user.username,
        created_by: user.username,
        created_by_id: user.userId,
      });
      const savedLesson = await manager.save(Lesson, newLesson);
      const files = newLessonFiles(withLanguage, user).map((file) =>
        Object.assign(file, { lesson: savedLesson }),
      );
      await manager.save(FileStore, files);
      await manager
        .createQueryBuilder()
        .relation(User, "lessons")
        .of(user.userId)
        .add(savedLesson.lessonId);
      return savedLesson.lessonId;
    });
  }

  async deleteUserLesson(userId: number, lessonId: number): Promise<Lesson> {
    const user = await this.getUser(userId);
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
      relations: { files: true },
    });

    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    //You can only delete the items you have self created
    if (!isLessonOwner(lesson, user)) {
      throw new HttpException("Lesson can only be deleted by creator", HttpStatus.FORBIDDEN);
    }
    // All or nothing: the membership rows of every user (not only the creator) go first, or the
    // foreign key (ON DELETE NO ACTION) stops a shared lesson half way, files already gone.
    await this.lessonRepository.manager.transaction(async (manager) => {
      await manager.query(`DELETE FROM "user_lessons_lesson" WHERE "lessonLessonId" = $1`, [
        lesson.lessonId,
      ]);
      await manager.delete(FileStore, { lesson: { lessonId: lesson.lessonId } });
      await manager.delete(Lesson, { lessonId: lesson.lessonId });
    });
    return lesson;
  }
}
