import { Controller, UseGuards, Get, Res, Req } from "@nestjs/common";
import { LockNotSupportedOnGivenDriverError } from "typeorm";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginGuard } from "./login.guard";
import { Request } from 'express';
import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";
import { UserDTO } from "@lessoneditor/contracts";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @UseGuards(LoginGuard)
  @Get("login")
  async login(@Res() res) {
    // const authorizationURL = `https://github.com/login/oauth/authorize?${ stringify({
    //     client_id    : process.env.GITHUB_CLIENT_ID,
    //     redirect_uri :  process.env.GITHUB_CALLBACK_URL,
    //     response_type: 'code'
    // }) }`
    // return res.redirect(authorizationURL);
  }

  @UseGuards(LoginGuard)
  @Get("logout")
  async logout(@Req() req: Request)
  {
    req.logOut()
    //lear access token from cache
    this.cacheManager.del((req.user as UserDTO).userId.toString());
    
  }

  @UseGuards(LoginGuard)
  @Get("callback")
  authCallback(@Req() req, @Res() res) {
    res.redirect("/");
  }
}
