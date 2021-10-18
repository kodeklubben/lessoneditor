import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Express, Request } from "express";
import { verify } from "jsonwebtoken";
import { UserDTO } from "libs/user/src/lib/user.dto";

@Injectable()
export class LoginGuard extends AuthGuard("github") {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
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
