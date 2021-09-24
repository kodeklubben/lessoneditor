import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { UserService } from "./user.service";
import { LessonDTO, NewLessonDTO} from "../../../lesson/src/lib/lesson.dto"
import { UserDTO } from "./user.dto";
import { AuthGuard } from "@nestjs/passport";
import { query } from "express";


@Controller("user")
export class UserController {
  constructor(private userService: UserService) {
  }

  @UseGuards(AuthGuard('github'))
  @Get(':userId/lessons')
  async GetUserLessons(@Param() params)
  {
    return await this.userService.getUserLessons(params.userId);
  }
  
  @UseGuards(AuthGuard('github'))
  @Get()
  async GetUser(@Req() req): Promise<UserDTO>
  {
    if(req.user == null)
    {
      throw new ForbiddenException();
    }
    return req.user
  
  }

  @UseGuards(AuthGuard('github'))
  @Post(':userId/lesson')
  async AddLesson(@Param() params, @Body() newLesson: NewLessonDTO): Promise<number>
  {
      return await this.userService.addUserLesson(params.userId,newLesson);
  }

  @UseGuards(AuthGuard('github'))
  @Put(':userId/lesson/:lessonId')
  async UpdateLesson(@Param('userId') userId,@Param('lessonId') lessonId, @Query('regenThumb') regenThumb: boolean, @Body() updatedLesson: LessonDTO): Promise<LessonDTO>
  {
    const {users, files, ...updatedLessonDTO} = await this.userService.updateUserLesson(userId, lessonId, regenThumb,updatedLesson)
    return updatedLessonDTO;
  }

  @UseGuards(AuthGuard('github'))
  @Delete(':userId/lesson')
  async DeleteLesson(@Param() params, @Query() queryParams): Promise<LessonDTO>
  {
    const {users, files, ...deletedLessonDTO} = await this.userService.deleteUserLesson(params.userId, queryParams.lessonId)
    return deletedLessonDTO
  }



}
