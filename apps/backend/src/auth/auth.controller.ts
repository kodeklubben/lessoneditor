import { Controller, UseGuards, Get, Res, Req, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginGuard } from "./login.guard";
import { Request, Response } from "express";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
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
  async login(@Res() res) {}

  @UseGuards(LoginGuard)
  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      this.cacheManager.del((req.user as UserDTO).userId.toString());
      req.logOut(function (err) {
        if (err) {
          return err;
        }
      });
      res.clearCookie("access_token");

      res.redirect("/logout");
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(LoginGuard)
  @Get("callback")
  authCallback(@Req() req, @Res() res) {
    res.redirect("/");
  }
}
