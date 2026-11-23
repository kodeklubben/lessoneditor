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
import { ImportLessonBody, NewLessonBody } from "../app/request-bodies";
import { sessionGithubToken } from "../auth/github-token";
import { ImportResult, LessonImportService } from "./lesson-import.service";

@Controller("user")
@UseGuards(LoginGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private lessonImportService: LessonImportService,
  ) {}

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
    @Req() req: Request,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() newLesson: NewLessonBody,
  ): Promise<number> {
    return this.userService.addUserLesson(userId, newLesson, sessionGithubToken(req));
  }

  /** Copies a published lesson for editing (docs/rediger-oppgave.md); reads GitHub, writes nothing there. */
  @Post(":userId/lesson/import")
  async ImportLesson(
    @Req() req: Request,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() body: ImportLessonBody,
  ): Promise<ImportResult> {
    return this.lessonImportService.importLesson(userId, sessionGithubToken(req), body);
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
