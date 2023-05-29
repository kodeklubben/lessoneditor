import { forwardRef, Module } from "@nestjs/common";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonEntity } from "./lesson.entity";
import { UserModule } from "../user/user.module";
import { GithubModule } from "../github/github.module";
import { ThumbModule } from "../thumb/thumb.module";
import { LessonFileEntity } from "./lesson-file.entity";
import { UserLessonsEntity } from "../user/user-lessons.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonEntity, LessonFileEntity, UserLessonsEntity]),
    forwardRef(() => UserModule),
    GithubModule,
    ThumbModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService, TypeOrmModule],
})
export class LessonModule {}
