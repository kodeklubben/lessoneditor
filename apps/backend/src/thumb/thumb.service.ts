import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import * as jwt from "jsonwebtoken";
import { lastValueFrom } from "rxjs";
import { Request } from "express";
import { UserDTO } from "@lessoneditor/contracts";

@Injectable()
export class ThumbService {
  constructor(private http: HttpService) {}

  async getThumb(lessonId: number, filename: string, request: Request): Promise<ArrayBuffer> {
    const baseUrl = this.baseUrl(request);
    const previewurl = [baseUrl, "preview", lessonId, filename].join("/");
    const url = this.thumbUrl(previewurl, request.user as UserDTO);
    const response$ = this.http.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });
    const response: AxiosResponse<ArrayBuffer> = await lastValueFrom(response$);
    return response.data;
    request.user;
  }

  thumbUrl(previewUrl: string, user: UserDTO) {
    const url = new URL(process.env.THUMB_SERVICE_URL);
    const token = this.createJwtToken(user.userId, process.env.GITHUB_CLIENT_SECRET);
    url.searchParams.append("url", previewUrl);
    url.searchParams.append("token", token);
    return url.toString();
  }

  createJwtToken(userId, secret) {
    return jwt.sign({ sub: userId }, secret);
  }

  baseUrl(req) {
    const protocol = req.hostname === "localhost" ? "http" : "https";
    return protocol + "://" + req.get("host");
  }
}
