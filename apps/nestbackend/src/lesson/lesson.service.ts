import { Injectable, HttpException, HttpStatus, flatten } from "@nestjs/common";
import { Lesson, FileStore } from "./lesson.entity";
import { User } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonFilterDTO, NewFileDTO, NewLessonDTO, ShareLessonDTO } from "@lessoneditor/contracts";
import { GithubService } from "../github/github.service";
import * as fs from "fs";
import { ThumbService } from "../thumb/thumb.service";
import { Request } from "express";

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FileStore)
    private fileStoreRepository: Repository<FileStore>,
    private githubService: GithubService,
    private thumbService: ThumbService
  ) {}

  async submitLesson(lessonId: number) {
    const lesson = await this.getLesson(lessonId);
    if (lesson == null) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    try {
      await this.githubService.submitLesson(lesson);
    } catch (error) {
      console.error(error);
    }
  }

  async getLesson(lessonId: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne(lessonId, { relations: ["files"] });
    if (lesson == null) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    return lesson;
  }

  async getLessonFileNames(lessonId: number): Promise<string[]> {
    const lesson = await this.getLesson(lessonId);
    const fileNames: string[] = lesson.files.map((file) => file.filename + file.ext);
    return fileNames;
  }

  async addLessonUser(lessonid: number, shareLesson: ShareLessonDTO): Promise<void> {
    const invitedByUser = await this.userRepository.findOne(shareLesson.invitationByUserId);
    if (!invitedByUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const invitedToUser = await this.userRepository.findOne(shareLesson.invitationToUserId, {
      relations: ["lessons"],
    });
    if (!invitedToUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const lesson = await this.lessonRepository.findOne(lessonid);
    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    //A lesson can only be shared by the creator
    if (!(lesson.created_by == (await invitedByUser).name)) {
      throw new HttpException("Lesson can only be shared by creator", HttpStatus.FORBIDDEN);
    }
    invitedToUser.lessons.push(lesson);
    await this.userRepository.save(invitedToUser);
  }

  async getLessonFile(lessonId: number, filename: string) {
    const lesson = await this.getLesson(lessonId);

    const file = lesson.files.find((file) => file.filename == filename);

    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    // if (file.filename == "preview") {
    //   return file;
    // }
    return file;
  }

  async addLessonFile(lessonId: number, newFile: NewFileDTO, request: Request): Promise<number> {
    const lesson = await this.lessonRepository.findOne(lessonId);
    const file = new FileStore();
    const user = request.user as User;
    file.filename = newFile.filename;
    file.ext = newFile.ext;
    file.created_by = user.name;
    file.updated_by = user.name;
    file.lesson = lesson;
    if ([".jpg", ".jpeg", ".gif", ".png"].includes(file.ext)) {
      file.content = Buffer.from(newFile.content, "base64");
    } else {
      file.content = Buffer.from(newFile.content);
    }
    try {
      const newFile = await this.fileStoreRepository.save(file);
      return newFile.fileId;
    } catch (error) {
      console.error(error);
    }
  }

  async updateLessonFile(
    lessonId: number,
    fileName: string,
    updatedByUserId: number,
    fileContent: string,
    request: Request
  ): Promise<FileStore> {
    const lesson = await this.getLesson(lessonId);
    const file = lesson.files.find((file) => file.filename == fileName);
    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    const updatedByUser = await this.userRepository.findOne(updatedByUserId);
    if (!updatedByUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    file.content = Buffer.from(fileContent);
    file.updated_by = updatedByUser.name;

    const thumbImage = await this.thumbService.getThumb(
      lesson.lessonId,
      lesson.lessonSlug,
      request
    );
    const previewFile = lesson.files.find((file) => file.filename == "preview");
    previewFile.content = Buffer.from(thumbImage);

    const savedLesson = await this.lessonRepository.save(lesson);
    return file;
  }

  async deleteLessonFile(lessonId: number, fileName: string, ext: string, request: Request) {
    const lesson = await this.getLesson(lessonId);
    const file = lesson.files.find((file) => file.filename === fileName && file.ext === `.${ext}`);

    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    try {
      const deletedFileRes = await this.fileStoreRepository.delete(file.fileId);
      return deletedFileRes.affected;
    } catch (e) {
      console.log(e);
    }
  }
}
