import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserDTO } from "@lessoneditor/contracts";
import { DataSource } from "typeorm";
import { User } from "../user/user.entity";
import { encryptToken, RequestWithGithubToken } from "./github-token";
import { env } from "../app/env";

@Injectable()
export class LoginGuard extends AuthGuard("github") {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (request.headers.authorization) {
      const [type, token] = request.headers.authorization.split(" ");
      if (type !== "Bearer" || !token || request.method !== "GET")
        throw new UnauthorizedException();
      try {
        const decoded = verify(token, env("JWT_SECRET"), {
          algorithms: ["HS256"],
          audience: "lessoneditor-thumbnail",
        });
        if (
          typeof decoded === "string" ||
          !decoded.exp ||
          !Number.isSafeInteger(Number(decoded.sub)) ||
          Number(decoded.sub) <= 0
        ) {
          throw new Error("Invalid thumbnail token");
        }
        request.user = { userId: Number(decoded.sub) } as UserDTO;
      } catch {
        throw new UnauthorizedException();
      }
    } else if (!request.user) {
      if (!/^\/api\/auth\/(login|callback)\/?$/.test(request.path))
        throw new UnauthorizedException();
      const result = (await super.canActivate(context)) as boolean;
      await super.logIn(request);
      // logIn regenerates the session, so the token is stored after it. The browser only ever
      // holds the signed session id; the old clear-text access_token cookie is removed.
      const accessToken = (request as RequestWithGithubToken).githubAccessToken;
      delete (request as RequestWithGithubToken).githubAccessToken;
      if (accessToken) request.session.githubToken = encryptToken(accessToken);
      response.clearCookie("access_token");
      return result;
    }

    const userId = (request.user as UserDTO).userId;
    if (request.params.userId && Number(request.params.userId) !== userId)
      throw new ForbiddenException();
    if (request.params.lessonId) {
      const lessonId = Number(request.params.lessonId);
      if (!Number.isSafeInteger(lessonId) || lessonId <= 0) throw new ForbiddenException();
      const hasAccess = await this.dataSource.getRepository(User).exists({
        where: { userId, lessons: { lessonId } },
      });
      if (!hasAccess) throw new ForbiddenException();
    }
    return true;
  }
}
