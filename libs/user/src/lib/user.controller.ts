import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { LessonDTO, NewLessonDTO} from "../../../lesson/src/lib/lesson.dto"
import { NewUserDTO, UserDTO } from "./user.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get(':userId/lessons')
  async GetUserLessons(@Param() params)
  {
    return await this.userService.getUserLessons(params.userId);
  }

  @Post()
  async AddUser(@Body() newUser: NewUserDTO): Promise<UserDTO>
  {
    const {lessons, ...userDTO} = await this.userService.addUser(newUser);
    return userDTO
  }
  
  @Get()
  async GetUser(@Query() queryParams): Promise<UserDTO>
  {
    const {lessons, ...userDTO} = await this.userService.getUser(queryParams.email)
    return userDTO;
  }

  @Post(':userId/lesson')
  async AddLesson(@Param() params, @Body() newLesson: NewLessonDTO): Promise<number>
  {
      return await this.userService.addUserLesson(params.userId,newLesson);
  }

  @Put(':userId/lesson')
  async UpdateLesson(@Param() params, @Body() updatedLesson: LessonDTO): Promise<LessonDTO>
  {
    const {users, files, ...updatedLessonDTO} = await this.userService.updateUserLesson(params.userId, updatedLesson)
    return updatedLessonDTO;
  }

  @Delete(':userId/lesson')
  async DeleteLesson(@Param() params, @Query() queryParams): Promise<LessonDTO>
  {
    const {users, files, ...deletedLessonDTO} = await this.userService.deleteUserLesson(params.userId, queryParams.lessonId)
    return deletedLessonDTO
  }



}
