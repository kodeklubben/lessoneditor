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
  Delete,
} from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { LessonDTO, FileDTO, ShareLessonDTO, NewFileDTO } from "@lessoneditor/contracts";
import { UserDTO } from "@lessoneditor/contracts";
import { LoginGuard } from "../auth/login.guard";
import { UpdatedFileDTO } from "@lessoneditor/contracts";
import { Request } from "express";
import { User } from "../user/user.entity";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { validate } from "class-validator";

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
  @Get(":lessonId/filenames")
  async GetLessonFileNames(@Param() params): Promise<string[]> {
    return await this.lessonService.getLessonFileNames(params.lessonId);
  }

  @UseGuards(LoginGuard)
  @Post(":lessonId/submit")
  async SubmitLesson(@Req() req: Request, @Param() params, @Body() submitMessage) {
    const accessToken: string = req.cookies["access_token"];
    // console.log("accessToken", accessToken);
    // console.log("submitMessage", submitMessage);
    // console.log("params", params);
    // console.log("req.user", req.user);
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
  @Get(":lessonId/files/:filename")
  async GetLessonFile(@Res() res, @Param("lessonId") lessonId, @Param("filename") filename) {
    try {
      const { lesson, content, ...fileProps } = await this.lessonService.getLessonFile(
        lessonId,
        filename
      );

      if ([".jpg", ".jpeg", ".gif", ".png"].includes(fileProps.ext)) {
        return res.end(content.toString("base64"));
      }
      if (filename == "lesson") {
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
    try {
      const errors = await validate(newFile);
      if (errors.length > 0) {
        throw new BadRequestException("Validation failed");
      }

      const addFileRes = await this.lessonService.addLessonFile(params.lessonId, newFile, req);
      return addFileRes;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("An error occurred");
    }
  }

  @UseGuards(LoginGuard)
  @Put(":lessonId/files/:filename")
  async UpdateLessonFile(
    @Req() req,
    @Param("lessonId") lessonId,
    @Param("filename") filename,
    @Body() updatedFile: UpdatedFileDTO
  ): Promise<FileDTO<string>> {
    const { lesson, content, ...fileProps } = await this.lessonService.updateLessonFile(
      lessonId,
      filename,
      req.user.userId,
      filename === "lesson" ? JSON.stringify(updatedFile.content) : updatedFile.content,
      req
    );
    const newFile: FileDTO<string> = {
      ...fileProps,
      content: content.toString("utf-8"),
    };
    return newFile;
  }

  @UseGuards(LoginGuard)
  @Put(":lessonId/files/:filename/updateThumbnail")
  async UpdateThumbnail(
    @Req() req,
    @Param("lessonId") lessonId,
    @Param("filename") filename
  ): Promise<any> {
    const isThumbUpdated = await this.lessonService.updateThumbnail(lessonId, filename, req);

    return isThumbUpdated;
  }

  @UseGuards(LoginGuard)
  @Delete(":lessonId/files/:filename/:ext")
  async DeleteLessonFile(
    @Req() req,
    @Param("lessonId") lessonId,
    @Param("filename") filename,
    @Param("ext") ext
  ): Promise<any> {
    const deleteRes = await this.lessonService.deleteLessonFile(lessonId, filename, ext, req);
    return deleteRes;
  }
}
