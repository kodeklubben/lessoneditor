import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Express, Request } from 'express';
import {verify} from "jsonwebtoken";

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest<Request>();
    if(request.headers.authorization)
    {
        const [type, token] = request.headers.authorization.split(" ");
        const verification = verifyJwtToken(token);
        if (verification.valid) {
          request.user = {
                username: verification.data.sub,
            };
            return true
        } else {
            return false
        }
    }
    else
    {     
        await super.logIn(request);
        return result;
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
}