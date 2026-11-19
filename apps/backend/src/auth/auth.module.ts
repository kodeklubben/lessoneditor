import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { LocalStrategy } from "./local.strategy";
import { LoginGuard } from "./login.guard";
import { GithubSerializer } from "./local.serializer";

@Module({
  imports: [UserModule, HttpModule, PassportModule],
  controllers: [AuthController],
  providers: [LocalStrategy, LoginGuard, GithubSerializer],
  exports: [LocalStrategy],
})
export class AuthModule {}
