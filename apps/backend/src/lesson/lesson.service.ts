import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LessonEntity } from "./lesson.entity";
import { UserEntity } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, In, Repository } from "typeorm";
import { NewFileDTO, ShareLessonDTO, UserDTO } from "@lessoneditor/contracts";
import { GithubService } from "../github/github.service";
import { ThumbService } from "../thumb/thumb.service";
import { Request } from "express";
import { LessonFileEntity } from "./lesson-file.entity";
import { UserLessonsEntity } from "../user/user-lessons.entity";

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(LessonFileEntity)
    private fileRepository: Repository<LessonFileEntity>,

    @InjectRepository(UserLessonsEntity)
    private userLessonsRepository: Repository<UserLessonsEntity>,

    private githubService: GithubService,
    private thumbService: ThumbService
  ) {}

  async submitLesson(
    user: UserEntity,
    accessToken: string,
    lessonId: number,
    submitMessage: { message: string }
  ) {
    const lesson = await this.getLesson(lessonId);
    const lessonFiles = await this.fileRepository.findBy({
      lessonLessonId: lessonId,
    });
    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }

    try {
      await this.githubService.submitLesson(user, accessToken, lesson, lessonFiles, submitMessage);
    } catch (error) {
      console.error(error);
    }
  }

  async getLesson(lessonId: number): Promise<LessonEntity> {
    const lesson = await this.lessonRepository.findOneBy({ lessonId });
    if (lesson == null) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    return lesson;
  }

  async getLessonFileNames(lessonId: number): Promise<string[]> {
    const files = await this.fileRepository.findBy({
      lessonLessonId: lessonId,
    });
    return files.map((file) => file.filename + file.ext);
  }

  async addLessonUser(lessonId: number, shareLesson: ShareLessonDTO): Promise<void> {
    const invitedByUser = await this.userRepository.findOneBy({
      userId: parseInt(shareLesson.invitationByUserId),
    });
    if (!invitedByUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const invitedToUser = await this.userRepository.findOneBy({
      userId: parseInt(shareLesson.invitationToUserId),
    });
    if (!invitedToUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const lesson = await this.lessonRepository.findOneBy({ lessonId });
    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    //A lesson can only be shared by the creator
    if (lesson.created_by != (await invitedByUser).username) {
      throw new HttpException("Lesson can only be shared by creator", HttpStatus.FORBIDDEN);
    }
    await this.userLessonsRepository.upsert(
      {
        lessonLessonsId: lessonId,
        userUserId: parseInt(shareLesson.invitationByUserId),
      },
      ["lessonLessonsId", "userUserId"]
    );
  }

  async getLessonFile(lessonId: number, filename: string) {
    const file = await this.fileRepository.findOneBy({
      lessonLessonId: lessonId,
      filename: filename,
    });

    if (!file) {
      throw new HttpException(`File "${filename}" does not exist`, HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async getLessonUsers(lessonId: number) {
    const userLessonsEntities = await this.userLessonsRepository.findBy({
      lessonLessonsId: lessonId,
    });
    const userIds = userLessonsEntities.map((entity) => entity.userUserId);
    return await this.userRepository.findBy({
      userId: In(userIds),
    });
  }

  async addLessonFile(lessonId: number, newFile: NewFileDTO, request: Request): Promise<number> {
    const lesson = await this.lessonRepository.findOneBy({ lessonId });
    const file = new LessonFileEntity();
    const user = request.user as UserEntity;
    file.filename = newFile.filename;
    file.ext = newFile.ext;
    file.created_by = user.username;
    file.updated_by = user.username;
    file.lessonLessonId = lesson.lessonId;
    if ([".jpg", ".jpeg", ".gif", ".png"].includes(file.ext)) {
      file.content = Buffer.from(newFile.content, "base64");
    } else {
      file.content = Buffer.from(newFile.content);
    }
    try {
      const newFile = await this.fileRepository.save(file, {
        transaction: true,
        chunk: 10,
      });

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
  ): Promise<LessonFileEntity> {
    const lesson = await this.getLesson(lessonId);
    lesson.updated_at = new Date();
    const file = await this.getLessonFile(lessonId, fileName);
    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    const updatedByUser = await this.userRepository.findOneBy({ userId: updatedByUserId });
    if (!updatedByUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    file.content = Buffer.from(fileContent);
    file.updated_by = updatedByUser.username;
    await this.lessonRepository.save(lesson);
    return file;
  }

  async updateThumbnail(lessonId: number, fileName: string, request: Request): Promise<any> {
    const thumbImage = await this.thumbService.getThumb(lessonId, fileName, request);
    const user = request.user as UserDTO;

    return await this.fileRepository.upsert(
      {
        content: Buffer.from(thumbImage),
        filename: "preview",
        ext: ".png",
        lessonLessonId: lessonId,
        created_by: user.username,
        updated_by: user.username,
      },
      ["fileId"]
    );
  }

  async deleteLessonFile(lessonId: number, fileName: string, ext: string, request: Request) {
    const lesson = await this.getLesson(lessonId);
    const file = await this.getLessonFile(lessonId, fileName);

    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    try {
      const deletedFileRes = await this.fileRepository.delete(file.fileId);
      return deletedFileRes.affected;
    } catch (e) {
      console.log(e);
    }
  }
}
