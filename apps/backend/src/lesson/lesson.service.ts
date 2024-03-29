import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Lesson, FileStore } from "./lesson.entity";
import { User } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NewFileDTO, ShareLessonDTO } from "@lessoneditor/contracts";
import { GithubService } from "../github/github.service";
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

  async submitLesson(
    user: User,
    accessToken: string,
    lessonId: number,
    submitMessage: { message: string }
  ) {
    const lesson = await this.getLesson(lessonId);
    lesson.submitted = true;
    lesson.submitted_at = new Date();
    const updateLessonRes = await this.lessonRepository.save(lesson);

    if (lesson == null) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    try {
      await this.githubService.submitLesson(user, accessToken, lesson, submitMessage);
    } catch (error) {
      console.error(error);
    }
  }

  async getLesson(lessonId: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
      relations: ["files"],
    });
    if (lesson == null) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    return lesson;
  }

  async getLessonFileNames(lessonId: number): Promise<string[]> {
    const lesson = await this.getLesson(lessonId);
    const filenames: string[] = lesson.files.map((file) => file.filename + file.ext);
    return filenames;
  }

  async addLessonUser(lessonId: number, shareLesson: ShareLessonDTO): Promise<void> {
    const invitedByUser = await this.userRepository.findOne({
      where: { userId: Number(shareLesson.invitationByUserId) },
    });
    if (!invitedByUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const invitedToUser = await this.userRepository.findOne({
      where: { userId: Number(shareLesson.invitationToUserId) },
      relations: ["lessons"],
    });

    if (!invitedToUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const lesson = await this.lessonRepository.findOne({ where: { lessonId } });
    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    //A lesson can only be shared by the creator
    if (!(lesson.created_by == (await invitedByUser).username)) {
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
    const lesson = await this.lessonRepository.findOne({ where: { lessonId } });
    if (!lesson) {
      throw new Error(`Lesson with id ${lessonId} not found`);
    }

    const file = new FileStore();
    const user = request.user as User;
    file.filename = newFile.filename;
    file.ext = newFile.ext;
    file.created_by = user.username;
    file.updated_by = user.username;
    file.lesson = lesson;

    if ([".jpg", ".jpeg", ".gif", ".png"].includes(file.ext)) {
      file.content = Buffer.from(newFile.content, "base64");
    } else {
      file.content = Buffer.from(newFile.content);
    }

    try {
      const savedFile = await this.fileStoreRepository.save(file, {
        transaction: true,
        chunk: 10,
      });
      return savedFile.fileId;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to save file");
    }
  }

  async updateLessonFile(
    lessonId: number,
    filename: string,
    updatedByUserId: number,
    fileContent: string,
    request: Request
  ): Promise<FileStore> {
    const lesson = await this.getLesson(lessonId);
    lesson.updated_at = new Date();
    const file = lesson.files.find((file) => file.filename == filename);
    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    const updatedByUser = await this.userRepository.findOne({ where: { userId: updatedByUserId } });
    if (!updatedByUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    file.content = Buffer.from(fileContent);
    file.updated_by = updatedByUser.username;

    // if (updateThumb) {
    //   console.log("thumbUpdated");
    //   const thumbImage = await this.thumbService.getThumb(lessonId, filename, request);
    //   const previewFile = lesson.files.find((file) => file.filename == "preview");
    //   previewFile.content = Buffer.from(thumbImage);
    // }

    const savedLesson = await this.lessonRepository.save(lesson);
    return file;
  }

  async updateThumbnail(lessonId, filename, request): Promise<any> {
    const lesson = await this.getLesson(lessonId);
    let thumbImage;
    try {
      thumbImage = await this.thumbService.getThumb(lessonId, filename, request);
    } catch (error) {
      console.error(error);
      throw new HttpException("Error generating thumbnail", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const previewFile = lesson.files.find((file) => file.filename == "preview");
    previewFile.content = Buffer.from(thumbImage);
    const savedLesson = await this.lessonRepository.save(lesson);
    return true;
  }

  async deleteLessonFile(lessonId: number, filename: string, ext: string, request: Request) {
    const lesson = await this.getLesson(lessonId);
    const file = lesson.files.find((file) => file.filename === filename && file.ext === `.${ext}`);

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
