import { Strategy } from "passport-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { stringify } from "querystring";
import { UserService } from "../user/user.service";
import { UserDTO } from "@lessoneditor/contracts";
import { lastValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/common";
import { Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";

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
    try {
      return await this.userService.getUser(response.data.id);
    } catch (error) {
      const newUserDTO: UserDTO = {
        userId: response.data.id,
        name: response.data.name,
        username: response.data.username,
        email: response.data.email,
        photo: response.data.avatar_url,
      };
      const newUser = await this.userService.addUser(newUserDTO);
      this.cacheManager.set(newUser.userId.toString(), accessToken);
      return newUser
    }
  }
}
