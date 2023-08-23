import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { LocalStrategy } from "./local.strategy";
import { LoginGuard } from "./login.guard";
import { GithubSerializer } from "./local.serializer";

@Module({
  imports: [
    UserModule,
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.GH_CLIENT_SECRET,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LoginGuard, GithubSerializer],
  exports: [AuthService, LocalStrategy],
})
export class AuthModule {}
