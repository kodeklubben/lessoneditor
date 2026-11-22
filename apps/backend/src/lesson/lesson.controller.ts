import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  PayloadTooLargeException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { LessonService } from "./lesson.service";
import { LessonDTO, FileDTO, UserDTO, YamlContent } from "@lessoneditor/contracts";
import { LoginGuard } from "../auth/login.guard";
import { sessionGithubToken } from "../auth/github-token";
import { User } from "../user/user.entity";
import {
  IMAGE_EXTENSIONS,
  MAX_FILE_BASE64_LENGTH,
  NewFileBody,
  ShareLessonBody,
  SubmitLessonBody,
  UpdatedFileBody,
} from "../app/request-bodies";

/** What other members of a lesson may see about each other: never the e-mail address. */
export function publicMember({ userId, username, name, photo }: User): Omit<UserDTO, "email"> {
  return { userId, username, name, photo };
}

const isStringList = (value: unknown) =>
  value === undefined || (Array.isArray(value) && value.every((item) => typeof item === "string"));

/** lesson.yml is stored as JSON: only these fields, with these types, are kept. */
export function lessonYaml(content: unknown): YamlContent {
  const yml = content as Partial<YamlContent> | null;
  const tags = yml?.tags as Record<string, unknown> | undefined;
  if (
    typeof yml !== "object" ||
    yml === null ||
    Array.isArray(yml) ||
    !Number.isInteger(yml.level) ||
    typeof yml.license !== "string" ||
    typeof tags !== "object" ||
    tags === null ||
    !isStringList(tags.topic) ||
    !isStringList(tags.subject) ||
    !isStringList(tags.grade)
  )
    throw new BadRequestException("Invalid lesson.yml content");
  return {
    level: yml.level,
    license: yml.license,
    tags: { topic: tags.topic ?? [], subject: tags.subject ?? [], grade: tags.grade ?? [] },
  };
}

@Controller("lesson")
@UseGuards(LoginGuard)
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @Get(":lessonId")
  async GetLesson(@Param("lessonId", ParseIntPipe) lessonId: number): Promise<LessonDTO> {
    const { users, files, ...lessonDTO } = await this.lessonService.getLesson(lessonId);
    return lessonDTO;
  }

  @Get(":lessonId/filenames")
  async GetLessonFileNames(@Param("lessonId", ParseIntPipe) lessonId: number): Promise<string[]> {
    return this.lessonService.getLessonFileNames(lessonId);
  }

  @Post(":lessonId/submit")
  async SubmitLesson(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Body() submitMessage: SubmitLessonBody,
  ) {
    return this.lessonService.submitLesson(
      req.user as User,
      sessionGithubToken(req),
      lessonId,
      { message: submitMessage.message ?? "" },
    );
  }

  @Get(":lessonId/users")
  async GetLessonUsers(
    @Param("lessonId", ParseIntPipe) lessonId: number,
  ): Promise<Omit<UserDTO, "email">[]> {
    const { users } = await this.lessonService.getLesson(lessonId);
    return users.map(publicMember);
  }

  @Get(":lessonId/files/:filename")
  async GetLessonFile(
    @Res() res: Response,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Param("filename") filename: string,
  ) {
    const { lesson, content, ...fileProps } = await this.lessonService.getLessonFile(
      lessonId,
      filename,
    );
    if (IMAGE_EXTENSIONS.includes(fileProps.ext)) {
      return res.end(content.toString("base64"));
    }
    const fileDTO: FileDTO<unknown> = {
      ...fileProps,
      content:
        filename === "lesson" ? JSON.parse(content.toString()) : content.toString("utf-8"),
    };
    return res.send(fileDTO);
  }

  @Post(":lessonId/user")
  async AddLessonUser(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Body() shareLesson: ShareLessonBody,
  ) {
    // Who invites is always the logged-in user, never a value from the request.
    await this.lessonService.addLessonUser(lessonId, {
      invitationToUserId: shareLesson.invitationToUserId,
      invitationByUserId: String((req.user as UserDTO).userId),
    });
  }

  @Post(":lessonId/files")
  async AddLessonFile(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Body() newFile: NewFileBody,
  ): Promise<{ fileId: number; filename: string; ext: string }> {
    if (newFile.content.length > MAX_FILE_BASE64_LENGTH)
      throw new PayloadTooLargeException("Files can be at most 5 MB");
    return this.lessonService.addLessonFile(lessonId, newFile, req);
  }

  @Put(":lessonId/files/:filename")
  async UpdateLessonFile(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Param("filename") filename: string,
    @Body() updatedFile: UpdatedFileBody,
  ): Promise<FileDTO<string>> {
    let content: string;
    if (filename === "lesson") {
      content = JSON.stringify(lessonYaml(updatedFile.content));
    } else if (typeof updatedFile.content === "string") {
      content = updatedFile.content;
    } else {
      throw new BadRequestException("content must be a string");
    }
    const { lesson, content: saved, ...fileProps } = await this.lessonService.updateLessonFile(
      lessonId,
      filename,
      (req.user as UserDTO).userId,
      content,
    );
    return { ...fileProps, content: saved.toString("utf-8") };
  }

  @Put(":lessonId/files/:filename/updateThumbnail")
  async UpdateThumbnail(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Param("filename") filename: string,
  ): Promise<boolean> {
    return this.lessonService.updateThumbnail(lessonId, filename, req);
  }

  @Delete(":lessonId/files/:filename/:ext")
  async DeleteLessonFile(
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Param("filename") filename: string,
    @Param("ext") ext: string,
  ): Promise<number> {
    return this.lessonService.deleteLessonFile(lessonId, filename, ext);
  }
}
