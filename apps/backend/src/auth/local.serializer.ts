import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";
import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GithubSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.userId);
  }

  async deserializeUser(userId: number, done: CallableFunction) {
    const user = await this.userService.getUser(userId);
    done(null, user);
  }
}
