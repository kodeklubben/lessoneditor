import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { LoginGuard } from "../auth/login.guard";
import { TranslateService } from "./translate.service";

@Controller()
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  /** The editor hides the translate option when this says false. */
  @UseGuards(LoginGuard)
  @Get("translate/status")
  status() {
    return { enabled: this.translateService.enabled };
  }

  @UseGuards(LoginGuard)
  @Post("lesson/:lessonId/translate")
  translate(
    @Req() req: Request,
    @Param("lessonId") lessonId: string,
    @Body() body: { source?: unknown; language?: unknown },
  ) {
    return this.translateService.translateFile(
      Number(lessonId),
      typeof body?.source === "string" ? body.source : "",
      typeof body?.language === "string" ? body.language : "",
      req,
    );
  }
}
