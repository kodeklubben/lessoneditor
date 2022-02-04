import { Controller, UseGuards, Get, Res, Req, Post } from "@nestjs/common";
import { LockNotSupportedOnGivenDriverError } from "typeorm";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginGuard } from "./login.guard";
import { Request, Response } from 'express';
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
  @Post("logout")
  async logout(@Req() req: Request,@Res() res: Response)
  {
    try
    {
      this.cacheManager.del((req.user as UserDTO).userId.toString());
      req.logOut()
      res.clearCookie("access_token")
      
      res.redirect("/logout");


    }
    catch(error)
    {
      console.error(error)
    }

    
  }

  @UseGuards(LoginGuard)
  @Get("callback")
  authCallback(@Req() req, @Res() res) {
    res.redirect("/");
  }
}
