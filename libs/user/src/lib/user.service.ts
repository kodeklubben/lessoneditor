import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserDTO } from "./user.dto";
import { User } from "./user.entity"
import { LessonDTO, NewLessonDTO } from "../../../lesson/src/lib/lesson.dto";
import {FileStore, Lesson} from "../../../lesson/src/lib/lesson.entity"
import {ThumbService} from "../../../thumb/src/lib/thumb.service"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private thumbService: ThumbService
    )
    {
    }

      async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
      }
    
      async getUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne(userId);
        if(!user)
        {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        return user
      }

      async addUser(newUser: UserDTO): Promise<User>
      {
          const user = new User();
          user.userId = newUser.userId
          user.email = newUser.email
          user.username = newUser.username
          user.name = newUser.name

          try
          {
            return await this.userRepository.save(user);
          }
          catch(err)
          {
            console.log(err)

          }
      }

      async getUserLessons(userId: number): Promise<User[]>
      {
          return await this.userRepository.find({userId:userId})


      }

      async addUserLesson(userId: number, lesson: NewLessonDTO): Promise<number>
      {
          const user = await this.userRepository.findOne(userId);
          if(!user)
          {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
          }

          const newLesson = new Lesson()
          newLesson.lessonTitle = lesson.lessonTitle
          newLesson.lessonSlug = lesson.lessonSlug
          newLesson.courseSlug = lesson.courseSlug
          newLesson.lessonTitle = lesson.lessonTitle
          newLesson.updated_by = user.name
          newLesson.created_by = user.name
          const emptyMdFile = new FileStore()
          emptyMdFile.content = "";
          emptyMdFile.ext = ".md";
          emptyMdFile.filename = lesson.lessonSlug
          emptyMdFile.updated_by = user.name
          emptyMdFile.created_by = user.name
          newLesson.files.push(emptyMdFile);
          user.lessons.push(newLesson)
          const emptyYamlFile = new FileStore()
          emptyYamlFile.content = JSON.stringify({})
          emptyYamlFile.ext = ".yml"
          emptyYamlFile.updated_by = user.name
          emptyYamlFile.created_by = user.name

          const savedUser = await this.userRepository.save(user);
          const savedLesson = await this.lessonRepository.save(newLesson);
          try
          {
            const thumbImage = await this.thumbService.getThumb(savedLesson.lessonId,lesson.lessonSlug)

            const previewPngFile = new FileStore()
            previewPngFile.content = Buffer.from(thumbImage).toString("hex");
            previewPngFile.ext = ".png"
            previewPngFile.filename = "preview"
            previewPngFile.updated_by = user.name
            previewPngFile.created_by = user.name
            savedLesson.files.push(previewPngFile)
            await this.lessonRepository.save(savedLesson);
          }
          catch(error)
          {
            console.error(error.message)
          }

          return savedLesson.lessonId
      }
      async updateUserLesson(userId: number, lessonId: number, regenThumb: boolean, updatedLesson: NewLessonDTO): Promise<Lesson>
      {
        const user = await this.userRepository.findOne(userId);
        if(!user)
        {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const lesson = user.lessons.find(lesson => lesson.lessonId == lessonId)
        if(!lesson)
        {
          throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
        }
        if(regenThumb)
        {
          const previewFile = lesson.files.find(file => file.filename == "preview");
          if(!previewFile)
          {
            throw new HttpException('Preview file not found', HttpStatus.NOT_FOUND)
          }
          const thumbImage = await this.thumbService.getThumb(lessonId,lesson.lessonSlug);
          previewFile.content = Buffer.from(thumbImage).toString("hex");
        }
        lesson.lessonTitle = lesson.lessonTitle
        lesson.lessonSlug = lesson.lessonSlug
        lesson.courseSlug = lesson.courseSlug
        lesson.lessonTitle = lesson.lessonTitle
        lesson.updated_by = user.name

        const savedUser = await this.userRepository.save(user);
        const savedLesson = await this.lessonRepository.save(lesson);

        return savedLesson
      }

      async deleteUserLesson(userId: number, lessonId: number): Promise<Lesson>
      {
        const user = await this.userRepository.findOne(userId);
        if(!user)
        {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const lesson = user.lessons.find(lesson => lesson.lessonId == lessonId)
        if(!lesson)
        {
          throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
        }
        //You can only delete the items you have self created
        if(!(lesson.created_by == user.name))
        {
            throw new HttpException('Lesson can only be deleted by creator', HttpStatus.FORBIDDEN);
        }
          return await this.lessonRepository.remove(lesson);
      }
}
