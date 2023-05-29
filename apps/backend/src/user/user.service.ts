import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { HeaderData, NewLessonDTO, UserDTO, YamlContent } from "@lessoneditor/contracts";
import { UserEntity } from "./user.entity";
import { LessonEntity } from "../lesson/lesson.entity";
import { Request } from "express";
import { imageTemplate, oppgaveMal } from "./fileTemplates";
import * as yaml from "js-yaml";
import { LessonFileEntity } from "../lesson/lesson-file.entity";
import { UserLessonsEntity } from "./user-lessons.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(LessonFileEntity)
    private fileRepository: Repository<LessonFileEntity>,

    @InjectRepository(UserLessonsEntity)
    private userLessonRepository: Repository<UserLessonsEntity>
  ) {}

  async getUser(userId: number): Promise<UserEntity> {
    this.userRepository.metadata;
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async addUser(newUser: UserDTO): Promise<UserEntity> {
    const user = new UserEntity();
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

  async updateUser(newUser: UserDTO, userId: number): Promise<UserEntity> {
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

  async getUserLessons(userId: number): Promise<LessonEntity[]> {
    const userLessonRows = await this.userLessonRepository.findBy({
      userUserId: userId,
    });
    const lessonIds = userLessonRows.map((row) => row.lessonLessonsId);
    return await this.lessonRepository.findBy({
      lessonId: In(lessonIds),
    });
  }

  async addUserLesson(userId: number, lesson: NewLessonDTO, request: Request): Promise<number> {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }

    const files: LessonFileEntity[] = [];

    const newLesson = new LessonEntity();
    newLesson.lessonTitle = lesson.lessonTitle;
    newLesson.lessonSlug = lesson.lessonSlug;
    newLesson.courseSlug = lesson.courseSlug;
    newLesson.courseTitle = lesson.courseTitle;
    newLesson.submitted = false;
    newLesson.submitted_at = null;
    newLesson.updated_by = user.username;
    newLesson.created_by = user.username;
    newLesson.created_at = new Date();

    const savedLesson = await this.lessonRepository.save(newLesson);
    const emptyYamlFile = new LessonFileEntity();
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
    emptyYamlFile.lessonLessonId = savedLesson.lessonId;

    const header: HeaderData = {
      title: lesson.lessonTitle,
      author: "",
      authorList: [user.name || user.username],
      language: lesson.language,
      translator: "",
      translatorList: [],
    };

    const rawBody = "---\n" + yaml.dump(header) + "---\n" + oppgaveMal;
    const emptyMdFile = new LessonFileEntity();
    emptyMdFile.content = Buffer.from(rawBody);
    emptyMdFile.ext = ".md";
    emptyMdFile.filename =
      lesson.language === "nb" ? lesson.lessonSlug : `${lesson.lessonSlug}_${lesson.language}`;
    emptyMdFile.updated_by = user.username;
    emptyMdFile.created_by = user.username;
    emptyMdFile.lessonLessonId = savedLesson.lessonId;

    const templateImage = new LessonFileEntity();
    templateImage.content = Buffer.from(imageTemplate, "base64");
    templateImage.ext = ".png";
    templateImage.filename = "image_rT34Yx";
    templateImage.updated_by = user.username;
    templateImage.created_by = user.username;
    templateImage.lessonLessonId = savedLesson.lessonId;

    files.push(emptyMdFile, emptyYamlFile, templateImage);

    const promises: Promise<LessonFileEntity>[] = files.map((file) =>
      this.fileRepository.save(file)
    );
    await Promise.all(promises);
    const savedUser = await this.userRepository.save(user);

    try {
      const previewPngFile = new LessonFileEntity();
      previewPngFile.content = Buffer.from(" ");
      previewPngFile.ext = ".png";
      previewPngFile.filename = "preview";
      previewPngFile.updated_by = user.username;
      previewPngFile.created_by = user.username;
      previewPngFile.lessonLessonId = savedLesson.lessonId;

      await this.fileRepository.save(previewPngFile);
    } catch (error) {
      console.error(error.message);
    }
    return savedLesson.lessonId;
  }

  async updateUserLesson(
    userId: number,
    lessonId: number,
    regenThumb: boolean,
    updatedLesson: NewLessonDTO
  ): Promise<LessonEntity> {
    const user = await this.getUser(userId);
    const isAssignedLesson = await this.userLessonRepository.countBy({
      userUserId: userId,
      lessonLessonsId: lessonId,
    });
    if (isAssignedLesson !== 1) {
      throw new HttpException("Lesson is not assigned user", HttpStatus.NOT_FOUND);
    }
    const lesson = await this.lessonRepository.findOneBy({ lessonId });

    lesson.lessonTitle = updatedLesson.lessonTitle;
    lesson.lessonSlug = updatedLesson.lessonSlug;
    lesson.courseSlug = updatedLesson.courseSlug;
    lesson.lessonTitle = updatedLesson.lessonTitle;
    lesson.updated_by = user.username;
    lesson.updated_at = new Date();

    const savedUser = await this.userRepository.save(user);
    return await this.lessonRepository.save(lesson);
  }

  async deleteUserLesson(userId: number, lessonId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    const lesson = await this.lessonRepository.findOneBy({ lessonId });

    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    //You can only delete the items you have self created
    if (lesson.created_by !== user.username) {
      throw new HttpException("Lesson can only be deleted by creator", HttpStatus.FORBIDDEN);
    }
    await this.fileRepository.delete({
      lessonLessonId: lessonId,
    });

    await this.lessonRepository.delete({
      lessonId: lessonId,
    });
    return true;
  }
}
