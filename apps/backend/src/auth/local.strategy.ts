import { Strategy } from "passport-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { stringify } from "querystring";
import { UserService } from "../user/user.service";
import { UserDTO } from "@lessoneditor/contracts";
import { lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { User } from "../user/user.entity";
import { RequestWithGithubToken } from "./github-token";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "github") {
  constructor(
    private http: HttpService,
    private userService: UserService,
  ) {
    super({
      authorizationURL: `https://github.com/login/oauth/authorize?${stringify({
        client_id: process.env.GH_CLIENT_ID,
        redirect_uri: process.env.GH_CALLBACK_URL,
        response_type: "code",
        // Forks, commits and pull requests against the public lesson repo need no more than this.
        scope: "public_repo",
      })}`,
      tokenURL: "https://github.com/login/oauth/access_token",
      clientID: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET,
      callbackURL: process.env.GH_CALLBACK_URL,
      scope: null,
      state: true,
      passReqToCallback: true,
    });
  }

  async validate(request: RequestWithGithubToken, accessToken: string): Promise<UserDTO> {
    const response: any = await lastValueFrom(
      this.http.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    const newUserDTO: UserDTO = {
      userId: response.data.id,
      name: response.data.name,
      username: response.data.login || response.data.id,
      email: response.data.email,
      photo: response.data.avatar_url,
    };
    let user: User;
    try {
      user = await this.userService.getUser(newUserDTO.userId);
    } catch (error) {
      // Only an unknown user is created; a database error must fail the login, not add a user.
      if (!(error instanceof HttpException) || error.getStatus() !== HttpStatus.NOT_FOUND)
        throw error;
      user = await this.userService.addUser(newUserDTO);
    }
    const { lessons, ...storedUser } = user;
    if (!this.shallowEqual(storedUser, newUserDTO)) {
      user = await this.userService.updateUser(newUserDTO, storedUser.userId);
    }
    // Kept on this request only; LoginGuard moves it, encrypted, into the server-side session.
    request.githubAccessToken = accessToken;
    return user;
  }

  shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }
}
