import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { UserService } from "./user.service";
import { LessonDTO, UserDTO } from "@lessoneditor/contracts";
import { LoginGuard } from "../auth/login.guard";
import { NewLessonBody } from "../app/request-bodies";

@Controller("user")
@UseGuards(LoginGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":userId/lessons")
  async GetUserLessons(@Param("userId", ParseIntPipe) userId: number): Promise<LessonDTO[]> {
    const { lessons } = await this.userService.getUserLessons(userId);
    return lessons;
  }

  @Get()
  GetUser(@Req() req: Request): UserDTO {
    return req.user as UserDTO;
  }

  @Post(":userId/lesson")
  async AddLesson(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() newLesson: NewLessonBody,
  ): Promise<number> {
    return this.userService.addUserLesson(userId, newLesson);
  }

  @Delete(":userId/lesson/:lessonId")
  async DeleteLesson(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("lessonId", ParseIntPipe) lessonId: number,
  ): Promise<LessonDTO> {
    const { users, files, ...deletedLessonDTO } = await this.userService.deleteUserLesson(
      userId,
      lessonId,
    );
    return deletedLessonDTO;
  }
}
