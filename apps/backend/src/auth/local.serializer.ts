import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";
import { PassportSerializer } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class GithubSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.userId);
  }

  /** A session for a user that no longer exists is treated as logged out, not as a 500 on every page. */
  async deserializeUser(userId: number, done: CallableFunction) {
    try {
      done(null, await this.userService.getUser(userId));
    } catch (error) {
      if (error instanceof HttpException && error.getStatus() === HttpStatus.NOT_FOUND)
        return done(null, false);
      done(error);
    }
  }
}
