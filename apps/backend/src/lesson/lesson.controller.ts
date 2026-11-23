import {
  HttpCode,
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
import { contentVersion, LessonService } from "./lesson.service";
import { isLessonOwner } from "./lesson.entity";
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
  ShareByUsernameBody,
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
    level: yml.level as number,
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

  /** Wakes the thumbnail service while the teacher starts writing; answers at once. */
  @Post(":lessonId/warmup")
  @HttpCode(204)
  Warmup(@Param("lessonId", ParseIntPipe) _lessonId: number): void {
    this.lessonService.warmUpThumbnails();
  }

  @Post(":lessonId/submit")
  async SubmitLesson(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Body() submitMessage: SubmitLessonBody,
  ) {
    return this.lessonService.submitLesson(req.user as User, sessionGithubToken(req), lessonId, {
      message: submitMessage.message ?? "",
    });
  }

  /** The lesson's members, without e-mail; `owner` marks the one who made it (#337). */
  @Get(":lessonId/users")
  async GetLessonUsers(
    @Param("lessonId", ParseIntPipe) lessonId: number,
  ): Promise<(Omit<UserDTO, "email"> & { owner: boolean })[]> {
    const lesson = await this.lessonService.getLesson(lessonId);
    return lesson.users.map((user) => ({
      ...publicMember(user),
      owner: isLessonOwner(lesson, user),
    }));
  }

  /** Shares the lesson with a GitHub username (#337). Only the owner may. */
  @Post(":lessonId/members")
  @HttpCode(204)
  async AddLessonMember(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Body() body: ShareByUsernameBody,
  ): Promise<void> {
    await this.lessonService.addLessonMemberByUsername(
      lessonId,
      (req.user as UserDTO).userId,
      body.username,
    );
  }

  /** The owner removes a member, or a member leaves. */
  // :memberId, not :userId: LoginGuard only lets :userId be the signed-in user.
  @Delete(":lessonId/members/:memberId")
  @HttpCode(204)
  async RemoveLessonMember(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Param("memberId", ParseIntPipe) memberId: number,
  ): Promise<void> {
    await this.lessonService.removeLessonMember(lessonId, (req.user as UserDTO).userId, memberId);
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
      content: filename === "lesson" ? JSON.parse(content.toString()) : content.toString("utf-8"),
      version: contentVersion(content),
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
    const {
      lesson,
      content: saved,
      ...fileProps
    } = await this.lessonService.updateLessonFile(
      lessonId,
      filename,
      (req.user as UserDTO).userId,
      content,
      updatedFile.base,
    );
    return { ...fileProps, content: saved.toString("utf-8"), version: contentVersion(saved) };
  }

  @Put(":lessonId/files/:filename/updateThumbnail")
  async UpdateThumbnail(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Param("filename") filename: string,
  ): Promise<boolean> {
    return this.lessonService.updateThumbnail(lessonId, filename, req);
  }

  /** A text's own thumbnail as base64, like the images; 404 until it has one. */
  @Get(":lessonId/files/:filename/thumbnail")
  async GetTextThumbnail(
    @Res() res: Response,
    @Param("lessonId", ParseIntPipe) lessonId: number,
    @Param("filename") filename: string,
  ) {
    const thumbnail = await this.lessonService.textThumbnail(lessonId, filename);
    if (!thumbnail) return res.status(404).end();
    return res.end(thumbnail.toString("base64"));
  }

  /**
   * A thumbnail of the lesson's main text, for a lesson that has none yet (9f): an older copy,
   * or one whose first thumbnail failed. Answers with the text it photographed.
   */
  @Put(":lessonId/thumbnail")
  async MakeLessonThumbnail(
    @Req() req: Request,
    @Param("lessonId", ParseIntPipe) lessonId: number,
  ): Promise<{ text: string | null }> {
    const text = await this.lessonService.textForMissingPreview(lessonId);
    if (!text) return { text: null };
    await this.lessonService.updateThumbnail(lessonId, text, req);
    return { text };
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
