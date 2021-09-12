import { Controller, Request, UseGuards, Post } from "@nestjs/common";
import { LockNotSupportedOnGivenDriverError } from "typeorm";
import { AuthService } from "..";
import { AuthGuard } from "@nestjs/passport";

@Controller("lesson")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('github'))
  @Post('auth/login')
  async login(@Request() req)
  {
      return this.authService.login(req.user);

  }
}