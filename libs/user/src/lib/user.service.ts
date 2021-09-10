import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { NewUserDTO } from "./user.dto";
import { User } from "./user.entity"
import { LessonDTO, NewLessonDTO } from "../../../lesson/src/lib/lesson.dto";
import {Lesson} from "../../../lesson/src/lib/lesson.entity"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>
    )
    {
    }

      async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
      }
    
      async getUser(email: string): Promise<User> {
        const user = await this.userRepository.findOne({email: email});
        if(!user)
        {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        return user
      }

      async addUser(newUser: NewUserDTO): Promise<User>
      {
          const user = new User();
          user.email = newUser.email
          user.username = newUser.username
          user.name = newUser.name

          return await this.userRepository.save(user);
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
          user.lessons.push(newLesson)

          const savedUser = await this.userRepository.save(user);
          const savedLesson = await this.lessonRepository.save(newLesson);
          return savedLesson.lessonId
      }
      async updateUserLesson(userId: number, updatedLesson: LessonDTO): Promise<Lesson>
      {
        const user = await this.userRepository.findOne(userId);
        if(!user)
        {
          throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const lesson = user.lessons.find(lesson => lesson.lessonId == updatedLesson.lessonId)
        if(!lesson)
        {
          throw new HttpException('Lesson does not exist', HttpStatus.NOT_FOUND);
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
