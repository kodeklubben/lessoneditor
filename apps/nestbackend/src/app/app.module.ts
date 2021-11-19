import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
  import { TypeOrmModule } from "@nestjs/typeorm";
// import { User, UserModule } from '@lessoneditor/user';
// import { Lesson, LessonModule } from "@lessoneditor/lesson";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "../user/user.module";
import { LessonModule } from "../lesson/lesson.module";
import { AuthModule } from "../auth/auth.module";
import { LoginGuard } from "../auth/login.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".local.env" }),
    TypeOrmModule.forRoot(),
    forwardRef(() => UserModule),
    AuthModule,
    UserModule,
    LessonModule,
    PassportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
