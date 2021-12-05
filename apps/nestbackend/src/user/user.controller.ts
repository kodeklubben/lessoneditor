import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LessonDTO, NewLessonDTO } from "../../../../libs/contracts/src/index";
import { UserDTO } from "../../../../libs/contracts/src/index";
import { LoginGuard } from "../auth/login.guard";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(LoginGuard)
  @Get(":userId/lessons")
  async GetUserLessons(@Param() params): Promise<LessonDTO[]> {
    const { lessons, ...userDTO } = await this.userService.getUserLessons(params.userId);
    return lessons;
  }

  @UseGuards(LoginGuard)
  @Get()
  async GetUser(@Req() req): Promise<UserDTO> {
    if (req.user == null) {
      throw new ForbiddenException();
    }
    return req.user;
  }

  @UseGuards(LoginGuard)
  @Post(":userId/lesson")
  async AddLesson(@Req() req, @Param() params, @Body() newLesson: NewLessonDTO): Promise<number> {
    return await this.userService.addUserLesson(params.userId, newLesson, req);
  }

  @UseGuards(LoginGuard)
  @Put(":userId/lesson/:lessonId")
  async UpdateLesson(
    @Req() req,
    @Param("userId") userId,
    @Param("lessonId") lessonId,
    @Query("regenThumb") regenThumb: boolean,
    @Body() updatedLesson: LessonDTO
  ): Promise<LessonDTO> {
    const { users, files, ...updatedLessonDTO } = await this.userService.updateUserLesson(
      userId,
      lessonId,
      regenThumb,
      updatedLesson,
      req
    );
    return updatedLessonDTO;
  }

  @UseGuards(LoginGuard)
  @Delete(":userId/lesson/:lessonId")
  async DeleteLesson(
    @Param("userId") userId,
    @Param("lessonId") lessonId,
    @Query() queryParams
  ): Promise<LessonDTO> {
    const { users, files, ...deletedLessonDTO } = await this.userService.deleteUserLesson(
      userId,
      lessonId
    );
    return deletedLessonDTO;
  }
}
