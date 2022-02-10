import { Module, CacheModule, forwardRef } from "@nestjs/common";
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
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".local.env" }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0, // do not expire
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../../frontend'),
      exclude: ['/api*'],
      
    }),
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
