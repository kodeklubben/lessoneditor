import { Controller, UseGuards, Get, Res, Req, Post } from "@nestjs/common";
import { LoginGuard } from "./login.guard";
import { Request, Response } from "express";
import { revokeGithubToken, sessionGithubToken } from "./github-token";

@Controller("auth")
export class AuthController {
  @UseGuards(LoginGuard)
  @Get("login")
  async login(@Res() res) {}

  @UseGuards(LoginGuard)
  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = sessionGithubToken(req);
    if (token) await revokeGithubToken(token);
    await new Promise<void>((resolve, reject) => {
      req.logOut((error) => (error ? reject(error) : resolve()));
    });
    await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
    res.clearCookie("access_token");
    res.clearCookie("connect.sid");
    res.redirect("/logout");
  }

  @UseGuards(LoginGuard)
  @Get("callback")
  authCallback(@Req() req, @Res() res) {
    res.redirect("/");
  }
}
