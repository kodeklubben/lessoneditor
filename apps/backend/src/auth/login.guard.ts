import { ExecutionContext, Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserDTO } from "@lessoneditor/contracts";
import { Cache } from "cache-manager";
import { User } from "../user/user.entity";

@Injectable()
export class LoginGuard extends AuthGuard("github") {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

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
        // console.log("request.user is null");
        const result = (await super.canActivate(context)) as boolean;
        // console.log("result", result);
        await super.logIn(request);
        // console.log("request.user", request.user);
        //store the accesstoken in an http-only cookie
        const user = request.user;
        const accessToken = await this.cacheManager.get((request.user as User).userId.toString());
        // console.log("accessToken", accessToken);
        // console.log("hosturl: ", process.env.LESSON_EDITOR_DOMAIN);
        response.cookie("access_token", accessToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });
        // console.log("reponse", response);
        // console.log("result", result);
        return result;
      } else {
        return true;
      }
    }
  }
}

const verifyJwtToken = (token) => {
  try {
    const decoded = verify(token, process.env.GH_CLIENT_SECRET);
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
