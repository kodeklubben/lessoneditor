import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { UpdatedFileDTO} from "./lesson.dto"
import {Lesson, FileStore} from "./lesson.entity"
import {User} from "../../../user/src/lib/user.entity"
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonFilterDTO, NewFileDTO, NewLessonDTO, ShareLessonDTO } from "./lesson.dto";

@Injectable()
export class LessonService {
    constructor(@InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>
    )
    {
    }

    async getLesson(lessonId: number): Promise<Lesson> {
        return await this.lessonRepository.findOne(lessonId);
      } 

    async addLessonUser(lessonid: number, shareLesson: ShareLessonDTO): Promise<void>
    {
        const invitedByUser = await this.userRepository.findOne(shareLesson.invitationByUserId);
        if(!invitedByUser)
        {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const invitedToUser = await this.userRepository.findOne(shareLesson.invitationToUserId);
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

    async addLessonFile(lessonId:number, newFile: NewFileDTO): Promise<number>
    {
        const lesson = await this.lessonRepository.findOne(lessonId);
        if(!lesson)
        {
          throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
        }
        const file = new FileStore()
        file.filename= newFile.filename
        file.ext = newFile.ext
        file.content = newFile.content

        lesson.files.push(file);

        const savedLesson = await this.lessonRepository.save(lesson);
        return savedLesson.files[savedLesson.files.length-1].fileId
    }

    async updateLessonFile(lessonId: number, updatedFile: UpdatedFileDTO): Promise<number>
    {
        const lesson = await this.lessonRepository.findOne(lessonId);
        if(!lesson)
        {
          throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
        }
        const file = lesson.files.find(file => file.fileId == updatedFile.fileId);
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
        return savedLesson.files[savedLesson.files.length-1].fileId

    }






}
