import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { UpdatedFileDTO} from "./lesson.dto"
import {Lesson, FileStore} from "./lesson.entity"
import {User} from "../../../user/src/lib/user.entity"
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonFilterDTO, NewFileDTO, NewLessonDTO, ShareLessonDTO } from "./lesson.dto";
import {GithubService} from "../../../github/src/lib/github.service"

@Injectable()
export class LessonService {
    constructor(@InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private githubService: GithubService
    )
    {
    }

    async submitLesson(token: string, lessonId:number)
    {
      const lesson = await this.getLesson(lessonId)
      if(lesson == null)
      {
        throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
      }
      return await this.githubService.submitLesson(token, lesson)
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
      if(file.filename == "lesson")
      {
        file.content = JSON.parse(file.content);
      }
      if(file.ext == ".md")
      {
        file.content = file.content.toString()
      }
      return file

    }

    async addLessonFile(lessonId:number, newFile: NewFileDTO): Promise<number>
    {
        const lesson = await this.getLesson(lessonId)
        const file = new FileStore()
        file.filename= newFile.filename
        file.ext = newFile.ext
        file.content = newFile.content

        lesson.files.push(file);

        const savedLesson = await this.lessonRepository.save(lesson);
        return savedLesson.files[savedLesson.files.length-1].fileId
    }

    async updateLessonFile(lessonId: number, fileId: number, updatedFile: UpdatedFileDTO): Promise<FileStore>
    {
        const lesson = await this.getLesson(lessonId)
        const file = lesson.files.find(file => file.fileId == fileId);
        if(!file)
        {
          throw new HttpException('File does not exist', HttpStatus.NOT_FOUND);
        }
        const updatedByUser = await this.userRepository.findOne(updatedFile.updatedByUserId)
        if(!updatedByUser)
        {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        file.content = updatedFile.content
        file.updated_by = updatedByUser.name

        const savedLesson = await this.lessonRepository.save(lesson);
        return file

    }






}
