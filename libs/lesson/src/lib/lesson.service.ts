import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import {Lesson, FileStore} from "./lesson.entity"
import {User} from "../../../user/src/lib/user.entity"
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonFilterDTO, NewFileDTO, NewLessonDTO, ShareLessonDTO } from "./lesson.dto";
import {GithubService} from "../../../github/src/lib/github.service"
import * as fs from "fs"
import { ThumbService } from "../../../../libs/thumb/src/lib/thumb.service";
import { Request } from "express";

@Injectable()
export class LessonService {
    constructor(@InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private githubService: GithubService,
    private thumbService: ThumbService
    )
    {
    }

    async submitLesson(lessonId:number)
    {
      const lesson = await this.getLesson(lessonId)
      if(lesson == null)
      {
        throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
      }
      return await this.githubService.submitLesson(lesson)
    }

    async getLesson(lessonId: number): Promise<Lesson> {
        const lesson = await this.lessonRepository.findOne(lessonId, { relations: ["files"] });
        if(lesson == null)
        {
          throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
        }
        return lesson
      } 

    async getLessonFileNames(lessonId: number): Promise<string[]>
    {
      const lesson = await this.getLesson(lessonId)
      const fileNames: string[] = lesson.files.map(file => file.filename + file.ext)
      return fileNames

    }

    async addLessonUser(lessonid: number, shareLesson: ShareLessonDTO): Promise<void>
    {
        const invitedByUser = await this.userRepository.findOne(shareLesson.invitationByUserId);
        if(!invitedByUser)
        {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const invitedToUser = await this.userRepository.findOne(shareLesson.invitationToUserId, { relations: ["lessons"] });
        if(!invitedToUser)
        {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const lesson = await this.lessonRepository.findOne(lessonid);
        if(!lesson)
        {
          throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
        }
        //A lesson can only be shared by the creator
        if(!(lesson.created_by == (await invitedByUser).name))
        {
            throw new HttpException('Lesson can only be shared by creator', HttpStatus.FORBIDDEN);
        }
        invitedToUser.lessons.push(lesson)
        await this.userRepository.save(invitedToUser);
    }

    async getLessonFile(lessonId: number, filename: string)
    {
      const lesson = await this.getLesson(lessonId)
      const file = lesson.files.find(file => file.filename == filename);
      if(!file)
      {
        throw new HttpException('File does not exist', HttpStatus.NOT_FOUND);
      }
      if(file.filename == "preview")
      {
        fs.writeFile("test.png", file.content, (error) => {
          console.error(error)
        })
      
        return file
      }
      return file

    }

    async addLessonFile(lessonId:number, newFile: NewFileDTO): Promise<number>
    {
        const lesson = await this.getLesson(lessonId)
        const file = new FileStore()
        file.filename= newFile.filename
        file.ext = newFile.ext
        file.content = Buffer.from(newFile.content)

        lesson.files.push(file);

        const savedLesson = await this.lessonRepository.save(lesson);
        return savedLesson.files[savedLesson.files.length-1].fileId
    }

    async updateLessonFile(lessonId: number, fileName: string, updatedByUserId: number, fileContent: string, request: Request): Promise<FileStore>
    {
        const lesson = await this.getLesson(lessonId)
        const file = lesson.files.find(file => file.filename == fileName);
        if(!file)
        {
          throw new HttpException('File does not exist', HttpStatus.NOT_FOUND);
        }
        const updatedByUser = await this.userRepository.findOne(updatedByUserId)
        if(!updatedByUser)
        {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        file.content = Buffer.from(fileContent)
        file.updated_by = updatedByUser.name

        const thumbImage = await this.thumbService.getThumb(lesson.lessonId,lesson.lessonSlug, request)
        const previewFile = lesson.files.find(file => file.filename == "preview")
        previewFile.content = Buffer.from(thumbImage)

        const savedLesson = await this.lessonRepository.save(lesson);
        return file

    }
}
