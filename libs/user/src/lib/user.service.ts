import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { UserDTO } from "./user.dto";
import { User } from "./user.entity";
import {
  LessonDTO,
  NewLessonDTO,
  YamlContent,
  HeaderData,
} from "../../../lesson/src/lib/lesson.dto";
import { FileStore, Lesson } from "../../../lesson/src/lib/lesson.entity";
import { ThumbService } from "../../../thumb/src/lib/thumb.service";
import { Request } from "express";
import { GRADE, SUBJECT, TOPIC, oppgaveMal } from "./fileTemplates";
import * as fs from "fs";
import * as yaml from "js-yaml";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private thumbService: ThumbService
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne(userId, { relations: ["lessons"] });
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
    const user = await this.userRepository.findOne(userId, { relations: ["lessons"] });
    if (!user) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }

    const newLesson = new Lesson();
    newLesson.lessonTitle = lesson.lessonTitle;
    newLesson.lessonSlug = lesson.lessonSlug;
    newLesson.courseSlug = lesson.courseSlug;
    newLesson.courseTitle = lesson.courseTitle;
    newLesson.updated_by = user.name;
    newLesson.created_by = user.name;
    const emptyYamlFile = new FileStore();
    emptyYamlFile.filename = "lesson";
    const jsonContent: YamlContent = {
      level: 1,
      license: "CC BY-SA 4.0",
      tags: { topic: [], subject: [], grade: [] },
    };
    emptyYamlFile.content = Buffer.from(JSON.stringify(jsonContent));
    emptyYamlFile.ext = ".yml";
    emptyYamlFile.updated_by = user.name;
    emptyYamlFile.created_by = user.name;

    const header: HeaderData = {
      title: lesson.lessonTitle,
      author: "",
      authorList: [user.name],
      language: "nb",
      translator: "",
      translatorList: [],
    };
    const rawREADMEBody = "---\n" + yaml.dump(header) + "---\n" + this.insertMetaData(jsonContent);
    const defaultReadMeFile = new FileStore();
    defaultReadMeFile.filename = "README";
    defaultReadMeFile.ext = ".md";
    defaultReadMeFile.content = Buffer.from(rawREADMEBody);
    defaultReadMeFile.updated_by = user.name;
    defaultReadMeFile.created_by = user.name;
    const rawBody = "---\n" + yaml.dump(header) + "---\n" + oppgaveMal;
    const emptyMdFile = new FileStore();
    emptyMdFile.content = Buffer.from(rawBody);
    emptyMdFile.ext = ".md";
    emptyMdFile.filename = lesson.lessonSlug;
    emptyMdFile.updated_by = user.name;
    emptyMdFile.created_by = user.name;

    newLesson.files
      ? newLesson.files.push(defaultReadMeFile, emptyMdFile, emptyYamlFile)
      : (newLesson.files = [defaultReadMeFile, emptyMdFile, emptyYamlFile]);
    user.lessons ? user.lessons.push(newLesson) : (user.lessons = [newLesson]);

    const savedLesson = await this.lessonRepository.save(newLesson);
    const savedUser = await this.userRepository.save(user);

    try {
      const thumbImage = await this.thumbService.getThumb(
        savedLesson.lessonId,
        savedLesson.lessonSlug,
        request
      );
      var buffer = new Int8Array(thumbImage);
      const previewPngFile = new FileStore();
      previewPngFile.content = Buffer.from(thumbImage);
      previewPngFile.ext = ".png";
      previewPngFile.filename = "preview";
      previewPngFile.updated_by = user.name;
      previewPngFile.created_by = user.name;
      savedLesson.files.push(previewPngFile);
      await this.lessonRepository.save(savedLesson);
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
    request: Request
  ): Promise<Lesson> {
    const user = await this.getUser(userId);
    const isAssignedLesson = user.lessons.find((lesson) => lesson.lessonId == lessonId);
    if (!isAssignedLesson) {
      throw new HttpException("Lesson is not assigned user", HttpStatus.NOT_FOUND);
    }
    const lesson = await this.lessonRepository.findOne(lessonId, { relations: ["files"] });
    if (regenThumb) {
      const previewFile = lesson.files.find((file) => file.filename == "preview");
      if (!previewFile) {
        throw new HttpException("Preview file not found", HttpStatus.NOT_FOUND);
      }
      const thumbImage = await this.thumbService.getThumb(lessonId, lesson.lessonSlug, request);
      previewFile.content = Buffer.from(thumbImage);
    }
    lesson.lessonTitle = updatedLesson.lessonTitle;
    lesson.lessonSlug = updatedLesson.lessonSlug;
    lesson.courseSlug = updatedLesson.courseSlug;
    lesson.lessonTitle = updatedLesson.lessonTitle;
    lesson.updated_by = user.name;

    const savedUser = await this.userRepository.save(user);
    const savedLesson = await this.lessonRepository.save(lesson);

    return savedLesson;
  }

  async deleteUserLesson(userId: number, lessonId: number): Promise<Lesson> {
    const user = await this.getUser(userId);
    const lesson = user.lessons.find((lesson) => lesson.lessonId == lessonId);
    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    //You can only delete the items you have self created
    if (!(lesson.created_by == user.name)) {
      throw new HttpException("Lesson can only be deleted by creator", HttpStatus.FORBIDDEN);
    }
    return await this.lessonRepository.remove(lesson);
  }

  insertMetaData(ymlData: YamlContent) {
    const subject = ymlData.tags.subject.map((element) => {
      // @ts-ignore
      return SUBJECT[element];
    });
    const topic = ymlData.tags.topic.map((element) => {
      // @ts-ignore
      return TOPIC[element];
    });
    const grade = ymlData.tags.grade.map((element) => {
      // @ts-ignore
      return GRADE[element];
    });

    let veiledningWithData = oppgaveMal.replace(/{subject}/, subject.join(", "));
    veiledningWithData = veiledningWithData.replace(/{topic}/, topic.join(", "));
    veiledningWithData = veiledningWithData.replace(/{grade}/, grade.join(", "));
    return veiledningWithData;
  }
}
