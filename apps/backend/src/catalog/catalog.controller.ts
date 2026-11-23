import { Controller, Get, Header, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import type { CatalogLesson, LessonCatalog } from "@lessoneditor/contracts";
import { LoginGuard } from "../auth/login.guard";
import { sessionGithubToken } from "../auth/github-token";
import { CatalogService } from "./catalog.service";

@Controller("catalog")
@UseGuards(LoginGuard)
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  /** Courses and tags from the lesson repo; null when it could not be read (the editor's own lists apply). */
  @Get()
  async GetCatalog(@Req() req: Request): Promise<LessonCatalog | null> {
    return this.catalogService.catalog(sessionGithubToken(req));
  }

  /**
   * Every lesson in the lesson repo, to find one and copy it from the front page. The browser may
   * keep the answer for ten minutes; the server keeps it for an hour.
   */
  @Get("lessons")
  @Header("Cache-Control", "private, max-age=600")
  async GetLessons(@Req() req: Request): Promise<CatalogLesson[] | null> {
    return this.catalogService.lessons(sessionGithubToken(req));
  }
}
