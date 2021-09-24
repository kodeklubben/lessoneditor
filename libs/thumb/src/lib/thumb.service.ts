import { Injectable, Scope,Inject, HttpException, HttpStatus, Req } from "@nestjs/common";
import { HttpService } from "@nestjs/common";
import { AxiosResponse } from "axios";
import * as jwt from "jsonwebtoken"
import { lastValueFrom } from "rxjs";


@Injectable()
export class ThumbService {

    constructor(private http: HttpService, @Inject(Scope.REQUEST) private request: Request)
    {}

    async getThumb(lessonId: number, filename: string): Promise<ArrayBuffer>
    {
        const baseUrl = this.baseUrl(this.request)
        const previewurl = [baseUrl, "preview", lessonId, filename].join("/");
        const url = this.thumbUrl(previewurl)
        const response$ = this.http.get<ArrayBuffer>(url)
        const response: AxiosResponse<ArrayBuffer> = await lastValueFrom(response$);
        return response.data
    }

    thumbUrl(previewUrl)
    {
        const url = new URL(process.env.THUMB_SERVICE_URL);
        const token = this.createJwtToken("na", process.env.GITHUB_CLIENT_SECRET);
        url.searchParams.append("url", previewUrl);
        url.searchParams.append("token", token);
        return url.toString();
    }

    createJwtToken(username, secret)
    {
        return jwt.sign({sub: username}, secret);
    };

    baseUrl(req){
        const protocol = req.hostname === "localhost" ? "http" : "https";
        return protocol + "://" + req.get("host");
    };
}
