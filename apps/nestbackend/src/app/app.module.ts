import { Module, forwardRef } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
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
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { User } from "../user/user.entity";
import { Lesson, FileStore } from "../lesson/lesson.entity";
import { Session } from "../session/session.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0, // do not expire
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../../../../frontend"),
      exclude: ["/api*"],
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "orm-user",
      database: "lesson-editor",
      password: "testing",
      synchronize: true,
      logging: false,
      entities: [User, Lesson, FileStore, Session],
      migrations: ["db/migrations/*.ts"],
    }),
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
