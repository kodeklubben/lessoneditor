import { Controller, Request, UseGuards, Get, Res, Req } from "@nestjs/common";
import { LockNotSupportedOnGivenDriverError } from "typeorm";
import { AuthService } from "..";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
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

  @Get('callback')
  @UseGuards(AuthGuard('local'))
  authCallback(@Req() req, @Res() res) {
    res.redirect("/")
  }
}