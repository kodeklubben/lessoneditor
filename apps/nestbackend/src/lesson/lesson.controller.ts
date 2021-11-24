import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Put,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ExpressAdapter, FileInterceptor, MulterModule } from "@nestjs/platform-express";
import { LessonService } from "./lesson.service";
import {
  LessonDTO,
  FileDTO,
  LessonFilterDTO,
  ShareLessonDTO,
  NewFileDTO,
} from "@lessoneditor/contracts";
import { UserDTO } from "@lessoneditor/contracts";
import { AuthGuard } from "@nestjs/passport";
import { fileURLToPath } from "url";
import { LoginGuard } from "../auth/login.guard";
import { Express } from "express";
import { Multer } from "multer";
import { Readable } from "stream";
import * as fs from "fs";
import { UpdatedFileDTO, YamlContent } from "@lessoneditor/contracts";

@Controller("lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @UseGuards(LoginGuard)
  @Get(":lessonId")
  async GetLesson(@Param() params): Promise<LessonDTO> {
    const { users, files, ...lessonDTO } = await this.lessonService.getLesson(params.lessonId);
    return lessonDTO;
  }

  @UseGuards(LoginGuard)
  @Get(":lessonId/fileNames")
  async GetLessonFileNames(@Param() params): Promise<string[]> {
    return await this.lessonService.getLessonFileNames(params.lessonId);
  }

  @UseGuards(LoginGuard)
  @Post(":lessonId/submit")
  async SubmitLesson(@Param() params) {
    await this.lessonService.submitLesson(params.lessonId);
  }

  @UseGuards(LoginGuard)
  @Get(":lessonId/users")
  async GetLessonUsers(@Param() params): Promise<UserDTO[]> {
    const { users, files, ...lessonDTO } = await this.lessonService.getLesson(params.lessonId);
    const userArray: UserDTO[] = users.map(function (user) {
      const { lessons, ...userDTO } = user;
      return userDTO;
    });
    return userArray;
  }

  // @UseGuards(LoginGuard)
  // @Get(':lessonId/files')
  // async GetLessonFiles(@Param() params): Promise<FileDTO<Buffer>[]>
  // {
  //   const {users, files, ...lessonDTO} = await this.lessonService.getLesson(params.lessonId)
  //   const filesArray: FileDTO<Buffer>[] = files.map(function(file){
  //     const {content, ...fileProps} = file
  //     return new StreamableFile(file)
  //   })
  //   return filesArray
  // }

  @UseGuards(LoginGuard)
  @Get(":lessonId/files/:fileName")
  async GetLessonFile(@Res() res, @Param("lessonId") lessonId, @Param("fileName") fileName) {
    try {
      const { lesson, content, ...fileProps } = await this.lessonService.getLessonFile(
        lessonId,
        fileName
      );
      if ([".jpg", ".jpeg", ".gif", ".png"].includes(fileProps.ext)) {
        res.end(content.toString("base64"));
      }
      if (fileName == "lesson") {
        const fileDTO: FileDTO<string> = {
          ...fileProps,
          content: JSON.parse(content.toString()),
        };
        res.send(fileDTO);
      } else {
        const fileDTO: FileDTO<string> = {
          ...fileProps,
          content: content.toString("utf-8"),
        };
        res.send(fileDTO);
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
    const { lesson, content, ...fileProps } = await this.lessonService.updateLessonFile(
      lessonId,
      fileName,
      req.user.userId,
      updatedFile.content,
      req
    );
    const newFile: FileDTO<string> = {
      ...fileProps,
      content: content.toString("utf-8"),
    };
    return newFile;
  }
}
