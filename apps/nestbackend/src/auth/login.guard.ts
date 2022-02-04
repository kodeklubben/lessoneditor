import { ExecutionContext, Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Express, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserDTO } from "@lessoneditor/contracts";
import { Cache } from "cache-manager";
import { User } from "../user/user.entity";

@Injectable()
export class LoginGuard extends AuthGuard("github") {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache){
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    if (request.headers.authorization) {
      const [type, token] = request.headers.authorization.split(" ");
      const verification = verifyJwtToken(token);
      if (verification.valid) {
        const newUser: UserDTO = {
          userId: +verification.data.sub,
          username: undefined,
          name: undefined,
          email: undefined,
          photo: undefined,
        };
        request.user = newUser;
        return true;
      } else {
        return false;
      }
    } else {
      if (request.user == null) {
        const result = (await super.canActivate(context)) as boolean;
        await super.logIn(request);
        //store the accesstoken in an http-only cookie
        const user = request.user
        const accessToken = await this.cacheManager.get((request.user as User).userId.toString());

        response.cookie('access_token', accessToken, {
          httpOnly: true,
          domain: process.env.LESSON_EDITOR_DOMAIN, // your domain here!
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        })
        return result;
      } else {
        return true;
      }
    }
  }
}

const verifyJwtToken = (token) => {
  try {
    const decoded = verify(token, process.env.GITHUB_CLIENT_SECRET);
    return {
      valid: true,
      data: decoded,
    };
  } catch (err) {
    return {
      valid: false,
      error: err.message,
    };
  }
};
