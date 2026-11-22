import { Injectable, HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDTO } from "@lessoneditor/contracts";
import { User } from "./user.entity";
import { NewLessonDTO, YamlContent, HeaderData } from "@lessoneditor/contracts";
// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import { invalidLessonFields } from "../../../../libs/contracts/src/lib/validation";
import { stringifyLessonMarkdown } from "../../../../libs/contracts/src/lib/frontmatter";
import { FileStore, Lesson, isLessonOwner } from "../lesson/lesson.entity";
import { ThumbService } from "../thumb/thumb.service";
import { Request } from "express";
import { oppgaveMal, imageTemplate } from "./fileTemplates";

/** Slugs end up as paths in the lesson repo, so they are checked before they are stored. */
export function assertValidLesson(lesson: NewLessonDTO) {
  const invalid = invalidLessonFields(lesson ?? ({} as NewLessonDTO));
  if (invalid.length > 0)
    throw new BadRequestException(`Invalid lesson fields: ${invalid.join(", ")}`);
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FileStore)
    private fileStoreRepository: Repository<FileStore>,
    private thumbService: ThumbService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId }, relations: { lessons: true } });
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async addUser(newUser: UserDTO): Promise<User> {
    const user = new User();
    user.userId = newUser.userId;
    user.email = newUser.email;
    user.username = newUser.username;
    user.name = newUser.name;
    user.photo = newUser.photo;

    try {
      return await this.userRepository.save(user);
    } catch (err) {
      console.log(err);
    }
  }

  async updateUser(newUser: UserDTO, userId: number): Promise<User> {
    const user = await this.getUser(userId);
    user.userId = newUser.userId;
    user.email = newUser.email;
    user.username = newUser.username;
    user.name = newUser.name;
    user.photo = newUser.photo;

    try {
      return await this.userRepository.save(user);
    } catch (err) {
      console.log(err);
    }
  }

  async getUserLessons(userId: number): Promise<User> {
    const user = await this.getUser(userId);
    return user;
  }

  async addUserLesson(userId: number, lesson: NewLessonDTO, request: Request): Promise<number> {
    assertValidLesson({ language: "nb", ...lesson });
    const user = await this.userRepository.findOne({ where: { userId }, relations: { lessons: true } });
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }

    const files: FileStore[] = [];

    const newLesson = new Lesson();
    newLesson.lessonTitle = lesson.lessonTitle;
    newLesson.lessonSlug = lesson.lessonSlug;
    newLesson.courseSlug = lesson.courseSlug;
    newLesson.courseTitle = lesson.courseTitle;
    newLesson.submitted = false;
    newLesson.submitted_at = null;
    newLesson.updated_by = user.username;
    newLesson.created_by = user.username;
    newLesson.created_by_id = user.userId;
    newLesson.created_at = new Date();

    const savedLesson = await this.lessonRepository.save(newLesson);
    const emptyYamlFile = new FileStore();
    emptyYamlFile.filename = "lesson";
    const jsonContent: YamlContent = {
      level: 1,
      license: "CC BY-SA 4.0",
      tags: { topic: [], subject: [], grade: [] },
    };
    emptyYamlFile.content = Buffer.from(JSON.stringify(jsonContent));
    emptyYamlFile.ext = ".yml";
    emptyYamlFile.updated_by = user.username;
    emptyYamlFile.created_by = user.username;
    emptyYamlFile.lesson = savedLesson;

    const header: HeaderData = {
      title: lesson.lessonTitle,
      author: "",
      authorList: [user.name || user.username],
      language: lesson.language,
      translator: "",
      translatorList: [],
    };

    const rawBody = stringifyLessonMarkdown(header, oppgaveMal);
    const emptyMdFile = new FileStore();
    emptyMdFile.content = Buffer.from(rawBody);
    emptyMdFile.ext = ".md";
    emptyMdFile.filename =
      lesson.language === "nb" ? lesson.lessonSlug : `${lesson.lessonSlug}_${lesson.language}`;
    emptyMdFile.updated_by = user.username;
    emptyMdFile.created_by = user.username;
    emptyMdFile.lesson = savedLesson;

    const templateImage = new FileStore();
    templateImage.content = Buffer.from(imageTemplate, "base64");
    templateImage.ext = ".png";
    templateImage.filename = "image_rT34Yx";
    templateImage.updated_by = user.username;
    templateImage.created_by = user.username;
    templateImage.lesson = savedLesson;

    // newLesson.files
    //   ? newLesson.files.push(defaultReadMeFile, emptyMdFile, emptyYamlFile, templateImage)
    //   : (newLesson.files = [defaultReadMeFile, emptyMdFile, emptyYamlFile, templateImage]);

    files.push(emptyMdFile, emptyYamlFile, templateImage);
    user.lessons ? user.lessons.push(savedLesson) : (user.lessons = [savedLesson]);

    const promises: Promise<FileStore>[] = [];
    files.map((file) => {
      promises.push(this.fileStoreRepository.save(file));
    });
    await Promise.all(promises);
    const savedUser = await this.userRepository.save(user);

    try {
      // const thumbImage = await this.thumbService.getThumb(
      //   savedLesson.lessonId,
      //   savedLesson.lessonSlug,
      //   request
      // );
      const previewPngFile = new FileStore();
      previewPngFile.content = Buffer.from(" ");
      previewPngFile.ext = ".png";
      previewPngFile.filename = "preview";
      previewPngFile.updated_by = user.username;
      previewPngFile.created_by = user.username;
      previewPngFile.lesson = savedLesson;

      await this.fileStoreRepository.save(previewPngFile);
    } catch (error) {
      console.error(error.message);
    }
    return savedLesson.lessonId;
  }
  async updateUserLesson(
    userId: number,
    lessonId: number,
    regenThumb: boolean,
    updatedLesson: NewLessonDTO,
    request: Request,
  ): Promise<Lesson> {
    assertValidLesson(updatedLesson);
    const user = await this.getUser(userId);
    const isAssignedLesson = user.lessons.find((lesson) => lesson.lessonId == lessonId);
    if (!isAssignedLesson) {
      throw new HttpException("Lesson is not assigned user", HttpStatus.NOT_FOUND);
    }
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
      relations: { files: true },
    });
    // if (regenThumb) {
    //   const previewFile = lesson.files.find((file) => file.filename == "preview");
    //   if (!previewFile) {
    //     throw new HttpException("Preview file not found", HttpStatus.NOT_FOUND);
    //   }
    //   const thumbImage = await this.thumbService.getThumb(lessonId, lesson.lessonSlug, request);
    //   previewFile.content = Buffer.from(thumbImage);
    // }
    lesson.lessonTitle = updatedLesson.lessonTitle;
    lesson.lessonSlug = updatedLesson.lessonSlug;
    lesson.courseSlug = updatedLesson.courseSlug;
    lesson.lessonTitle = updatedLesson.lessonTitle;
    lesson.updated_by = user.username;
    lesson.updated_at = new Date();

    const savedUser = await this.userRepository.save(user);
    const savedLesson = await this.lessonRepository.save(lesson);

    return savedLesson;
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

  // insertMetaData(ymlData: YamlContent) {
  //   const subject = ymlData.tags.subject.map((element) => {
  //     return SUBJECT[element];
  //   });
  //   const topic = ymlData.tags.topic.map((element) => {
  //     return TOPIC[element];
  //   });
  //   const grade = ymlData.tags.grade.map((element) => {
  //     return GRADE[element];
  //   });

  //   let veiledningWithData = oppgaveMal.replace(/{subject}/, subject.join(", "));
  //   veiledningWithData = veiledningWithData.replace(/{topic}/, topic.join(", "));
  //   veiledningWithData = veiledningWithData.replace(/{grade}/, grade.join(", "));
  //   return veiledningWithData;
  // }
}
