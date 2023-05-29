import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { LessonDTO, NewLessonDTO, UserDTO } from "@lessoneditor/contracts";
import { LoginGuard } from "../auth/login.guard";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(LoginGuard)
  @Get(":userId/lessons")
  async GetUserLessons(@Param() params): Promise<LessonDTO[]> {
    return await this.userService.getUserLessons(params.userId);
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
    return await this.userService.updateUserLesson(userId, lessonId, regenThumb, updatedLesson);
  }

  @UseGuards(LoginGuard)
  @Delete(":userId/lesson/:lessonId")
  async DeleteLesson(
    @Param("userId") userId,
    @Param("lessonId") lessonId,
    @Query() queryParams
  ): Promise<boolean> {
    return await this.userService.deleteUserLesson(userId, lessonId);
  }
}
