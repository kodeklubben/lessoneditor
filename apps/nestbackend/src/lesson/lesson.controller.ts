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
  Delete,
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
import { Multer } from "multer";
import { Readable } from "stream";
import * as fs from "fs";
import { UpdatedFileDTO, YamlContent } from "@lessoneditor/contracts";
import { Request } from "express";
import { User } from "../user/user.entity";

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
  async SubmitLesson(@Req() req: Request, @Param() params, @Body() submitMessage) {
    const accessToken: string = req.cookies["access_token"];
    await this.lessonService.submitLesson(
      req.user as User,
      accessToken,
      params.lessonId,
      submitMessage
    );
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
        return res.end(content.toString("base64"));
      }
      if (fileName == "lesson") {
        const fileDTO: FileDTO<string> = {
          ...fileProps,
          content: JSON.parse(content.toString()),
        };
        return res.send(fileDTO);
      } else {
        const fileDTO: FileDTO<string> = {
          ...fileProps,
          content: content.toString("utf-8"),
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
    const addFileRes = await this.lessonService.addLessonFile(params.lessonId, newFile, req);
    return addFileRes;
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
      fileName === "lesson" ? JSON.stringify(updatedFile.content) : updatedFile.content,
      req
    );
    const newFile: FileDTO<string> = {
      ...fileProps,
      content: content.toString("utf-8"),
    };
    return newFile;
  }

  @UseGuards(LoginGuard)
  @Put(":lessonId/files/:fileName/updateThumbnail")
  async UpdateThumbnail(
    @Req() req,
    @Param("lessonId") lessonId,
    @Param("fileName") fileName
  ): Promise<any> {
    const isThumbUpdated = await this.lessonService.updateThumbnail(lessonId, fileName, req);

    return isThumbUpdated;
  }

  @UseGuards(LoginGuard)
  @Delete(":lessonId/files/:fileName/:ext")
  async DeleteLessonFile(
    @Req() req,
    @Param("lessonId") lessonId,
    @Param("fileName") fileName,
    @Param("ext") ext
  ): Promise<any> {
    const deleteRes = await this.lessonService.deleteLessonFile(lessonId, fileName, ext, req);
    return deleteRes;
  }
}
