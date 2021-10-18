import { Controller, Request, UseGuards, Get, Res, Req } from "@nestjs/common";
import { LockNotSupportedOnGivenDriverError } from "typeorm";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginGuard } from "./login.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Get("login")
  async login(@Res() res) {

    const here = "here"
    console.log(here);

    // const authorizationURL = `https://github.com/login/oauth/authorize?${ stringify({
    //     client_id    : process.env.GITHUB_CLIENT_ID,
    //     redirect_uri :  process.env.GITHUB_CALLBACK_URL,
    //     response_type: 'code'
    // }) }`
    // return res.redirect(authorizationURL);
  }

  @UseGuards(LoginGuard)
  @Get('callback')
  authCallback(@Req() req, @Res() res) {
    res.redirect("/")
  }
}