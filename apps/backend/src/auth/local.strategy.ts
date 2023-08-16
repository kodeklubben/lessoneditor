import { Strategy } from "passport-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { stringify } from "querystring";
import { UserService } from "../user/user.service";
import { UserDTO } from "@lessoneditor/contracts";
import { lastValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { User } from "../user/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "github") {
  private axiosResponse$: any;
  private data: any;
  constructor(
    private authService: AuthService,
    private http: HttpService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    super({
      authorizationURL: `https://github.com/login/oauth/authorize?${stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
        response_type: "code",
        scope: "repo",
      })}`,
      tokenURL: "https://github.com/login/oauth/access_token",
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: null,
    });
  }

  async validate(accessToken: string): Promise<UserDTO> {
    this.axiosResponse$ = this.http.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const response: any = await lastValueFrom(this.axiosResponse$);
    let user: User;
    try {
      user = await this.userService.getUser(response.data.id);
      const { lessons, ...storedUser } = user;
      const newUserDTO: UserDTO = {
        userId: response.data.id,
        name: response.data.name,
        username: response.data.login || response.data.id,
        email: response.data.email,
        photo: response.data.avatar_url,
      };

      if (!this.shallowEqual(storedUser, newUserDTO)) {
        user = await this.userService.updateUser(newUserDTO, storedUser.userId);
      }
    } catch (error) {
      const newUserDTO: UserDTO = {
        userId: response.data.id,
        name: response.data.name,
        username: response.data.login || response.data.id,
        email: response.data.email,
        photo: response.data.avatar_url,
      };
      user = await this.userService.addUser(newUserDTO);
    }
    this.cacheManager.set(user.userId.toString(), accessToken);
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
