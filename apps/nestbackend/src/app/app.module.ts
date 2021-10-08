import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// import { User, UserModule } from '@lessoneditor/user';
// import { Lesson, LessonModule } from "@lessoneditor/lesson";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "../../../../libs/user/src/lib/user.module";
import { LessonModule } from "../../../../libs/lesson/src/lib/lesson.module";
import { AuthModule } from "../../../../libs/auth/src/lib/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".local.env" }),
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    LessonModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: LoginGuard,
    // }
  ],
})
export class AppModule {}
