import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { LessonService } from "./lesson.service";
import {
  FileDTO,
  LessonDTO,
  NewFileDTO,
  ShareLessonDTO,
  UpdatedFileDTO,
  UserDTO,
} from "@lessoneditor/contracts";
import { LoginGuard } from "../auth/login.guard";
import { Request } from "express";
import { UserEntity } from "../user/user.entity";
import { LessonFileEntity } from "./lesson-file.entity";

@Controller("lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @UseGuards(LoginGuard)
  @Get(":lessonId")
  async GetLesson(@Param() params): Promise<LessonDTO> {
    return await this.lessonService.getLesson(params.lessonId);
  }

  @UseGuards(LoginGuard)
  @Get(":lessonId/filenames")
  async GetLessonFileNames(@Param() params): Promise<string[]> {
    return await this.lessonService.getLessonFileNames(params.lessonId);
  }

  @UseGuards(LoginGuard)
  @Post(":lessonId/submit")
  async SubmitLesson(@Req() req: Request, @Param() params, @Body() submitMessage) {
    const accessToken: string = req.cookies["access_token"];
    await this.lessonService.submitLesson(
      req.user as UserEntity,
      accessToken,
      params.lessonId,
      submitMessage
    );
  }

  @UseGuards(LoginGuard)
  @Get(":lessonId/users")
  async GetLessonUsers(@Param("lessonId") lessonId): Promise<UserDTO[]> {
    const userEntities = await this.lessonService.getLessonUsers(lessonId);
    return userEntities.map(function (userEntity) {
      const { ...userDTO } = userEntity;
      return userDTO;
    });
  }

  @UseGuards(LoginGuard)
  @Get(":lessonId/files/:fileName")
  async GetLessonFile(@Res() res, @Param("lessonId") lessonId, @Param("fileName") fileName) {
    try {
      const lessonFile: LessonFileEntity = await this.lessonService.getLessonFile(
        lessonId,
        fileName
      );

      if ([".jpg", ".jpeg", ".gif", ".png"].includes(lessonFile.ext)) {
        return res.end(lessonFile.content.toString("base64"));
      }
      if (fileName == "lesson") {
        const fileDTO: FileDTO<string> = {
          ...lessonFile,
          content: JSON.parse(lessonFile.content.toString()),
        };
        return res.send(fileDTO);
      } else {
        const fileDTO: FileDTO<string> = {
          ...lessonFile,
          content: lessonFile.content.toString("utf-8"),
        };
        return res.send(fileDTO);
      }
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(LoginGuard)
  @Post(":lessonId/user")
  async AddLessonUser(@Param() params, @Body() shareLesson: ShareLessonDTO) {
    await this.lessonService.addLessonUser(params.lessonId, shareLesson);
  }

  @UseGuards(LoginGuard)
  @Post(":lessonId/files")
  async AddLessonFile(@Req() req, @Param() params, @Body() newFile: NewFileDTO): Promise<number> {
    return await this.lessonService.addLessonFile(params.lessonId, newFile, req);
  }

  @UseGuards(LoginGuard)
  @Put(":lessonId/files/:fileName")
  async UpdateLessonFile(
    @Req() req,
    @Param("lessonId") lessonId,
    @Param("fileName") fileName,
    @Body() updatedFile: UpdatedFileDTO
  ): Promise<FileDTO<string>> {
    const { lessonLessonId, content, ...fileProps } = await this.lessonService.updateLessonFile(
      lessonId,
      fileName,
      req.user.userId,
      fileName === "lesson" ? JSON.stringify(updatedFile.content) : updatedFile.content,
      req
    );
    return {
      ...fileProps,
      content: content.toString("utf-8"),
    };
  }

  @UseGuards(LoginGuard)
  @Put(":lessonId/files/:fileName/updateThumbnail")
  async UpdateThumbnail(
    @Req() req,
    @Param("lessonId") lessonId,
    @Param("fileName") fileName
  ): Promise<any> {
    return await this.lessonService.updateThumbnail(lessonId, fileName, req);
  }

  @UseGuards(LoginGuard)
  @Delete(":lessonId/files/:fileName/:ext")
  async DeleteLessonFile(
    @Req() req,
    @Param("lessonId") lessonId,
    @Param("fileName") fileName,
    @Param("ext") ext
  ): Promise<any> {
    return await this.lessonService.deleteLessonFile(lessonId, fileName, ext, req);
  }
}
