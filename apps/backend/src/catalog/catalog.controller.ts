import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import type { LessonCatalog } from "@lessoneditor/contracts";
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
}
