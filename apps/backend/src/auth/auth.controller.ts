import { CACHE_MANAGER, Controller, Get, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginGuard } from "./login.guard";
import { Request, Response } from "express";
import { Cache } from "cache-manager";
import { UserDTO } from "@lessoneditor/contracts";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @UseGuards(LoginGuard)
  @Get("login")
  authLogin(@Req() req, @Res() res) {
    res.send("should be redirected");
  }

  @UseGuards(LoginGuard)
  @Get("callback")
  authCallback(@Req() req, @Res() res) {
    res.redirect("/");
  }

  @UseGuards(LoginGuard)
  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      await this.cacheManager.del((req.user as UserDTO).userId.toString());
      req.logOut(() => {});
      res.clearCookie("access_token");

      res.redirect("/logout");
    } catch (error) {
      console.error(error);
    }
  }
}
