import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import * as jwt from "jsonwebtoken";
import { lastValueFrom } from "rxjs";
import { Request } from "express";
import { UserDTO } from "@lessoneditor/contracts";
import { env } from "../app/env";

/** Must match the header the thumbnailer reads (apps/thumbnailer/src/app/read-request.ts). */
export const PREVIEW_TOKEN_HEADER = "x-preview-token";

@Injectable()
export class ThumbService {
  constructor(private http: HttpService) {}

  async getThumb(lessonId: number, filename: string, request: Request): Promise<ArrayBuffer> {
    const baseUrl = this.baseUrl(request);
    const previewurl = [baseUrl, "preview", lessonId, encodeURIComponent(filename)].join("/");
    const { url, headers } = this.thumbRequest(previewurl, request.user as UserDTO);
    const response$ = this.http.get<ArrayBuffer>(url, { responseType: "arraybuffer", headers });
    const response: AxiosResponse<ArrayBuffer> = await lastValueFrom(response$);
    return response.data;
  }

  /**
   * The token goes in a header, never in the query string, which ends up in request logs.
   * Not in Authorization: that is kept for Google's ID token once the function is private (IAM).
   */
  thumbRequest(previewUrl: string, user: UserDTO) {
    const url = new URL(env("THUMB_SERVICE_URL"));
    url.searchParams.append("url", previewUrl);
    const token = this.createJwtToken(user.userId, env("JWT_SECRET"));
    return { url: url.toString(), headers: { [PREVIEW_TOKEN_HEADER]: token } };
  }

  createJwtToken(userId: number, secret: string) {
    return jwt.sign({}, secret, {
      subject: String(userId),
      audience: "lessoneditor-thumbnail",
      expiresIn: "5m",
      algorithm: "HS256",
    });
  }

  baseUrl(_req: unknown) {
    return new URL(env("FRONTEND_URL")).origin;
  }
}
