import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { LessonModule } from "../lesson/lesson.module";
import { AuthModule } from "../auth/auth.module";
import { UserEntity } from "../user/user.entity";
import { LessonEntity } from "../lesson/lesson.entity";
import { SessionEntity } from "../session/session.entity";
import { LessonFileEntity } from "../lesson/lesson-file.entity";
import { UserLessonsEntity } from "../user/user-lessons.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".local.env" }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0, // do not expire
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: true,
      logging: false,
      entities: [UserEntity, LessonEntity, LessonFileEntity, SessionEntity, UserLessonsEntity],
      migrations: [],
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
