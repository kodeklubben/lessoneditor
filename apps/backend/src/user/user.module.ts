import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThumbModule } from "../thumb/thumb.module";
import { User } from "./user.entity";
import { LessonModule } from "../lesson/lesson.module";
import { GithubModule } from "../github/github.module";
import { LessonImportService } from "./lesson-import.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => LessonModule),
    GithubModule,
    ThumbModule,
  ],
  controllers: [UserController],
  providers: [UserService, LessonImportService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
