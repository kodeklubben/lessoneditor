import { Module, HttpModule } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from '@nestjs/passport';
import { UserModule } from "../../../user/src/lib/user.module";
import { JwtModule } from '@nestjs/jwt';
import { GithubStrategy } from "./github.strategy";

@Module({
  imports: [
    UserModule,
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.GITHUB_CLIENT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy],
  exports: [AuthService],
})
export class AuthModule {}
