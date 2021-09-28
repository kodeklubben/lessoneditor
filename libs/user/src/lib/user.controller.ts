import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { UserService } from "./user.service";
import { LessonDTO, NewLessonDTO} from "../../../lesson/src/lib/lesson.dto"
import { UserDTO } from "./user.dto";
import { query } from "express";


@Controller("user")
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get(':userId/lessons')
  async GetUserLessons(@Param() params)
  {
    return await this.userService.getUserLessons(params.userId);
  }
  
  @Get()
  async GetUser(@Req() req): Promise<UserDTO>
  {
    if(req.user == null)
    {
      throw new ForbiddenException();
    }
    return req.user
  
  }

  @Post(':userId/lesson')
  async AddLesson(@Req() req, @Param() params, @Body() newLesson: NewLessonDTO): Promise<number>
  {
      return await this.userService.addUserLesson(params.userId,newLesson, req);
  }

  @Put(':userId/lesson/:lessonId')
  async UpdateLesson(@Req() req, @Param('userId') userId,@Param('lessonId') lessonId, @Query('regenThumb') regenThumb: boolean, @Body() updatedLesson: LessonDTO): Promise<LessonDTO>
  {
    const {users, files, ...updatedLessonDTO} = await this.userService.updateUserLesson(userId, lessonId, regenThumb,updatedLesson, req)
    return updatedLessonDTO;
  }

  @Delete(':userId/lesson')
  async DeleteLesson(@Param() params, @Query() queryParams): Promise<LessonDTO>
  {
    const {users, files, ...deletedLessonDTO} = await this.userService.deleteUserLesson(params.userId, queryParams.lessonId)
    return deletedLessonDTO
  }



}
