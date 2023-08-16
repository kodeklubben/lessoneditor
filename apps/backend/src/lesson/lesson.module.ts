import { Module, forwardRef } from "@nestjs/common";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lesson } from "./lesson.entity";
import { UserModule } from "../user/user.module";
import { GithubModule } from "../github/github.module";
import { ThumbModule } from "../thumb/thumb.module";
import { FileStore } from "./lesson.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, FileStore]),
    forwardRef(() => UserModule),
    GithubModule,
    ThumbModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService, TypeOrmModule],
})
export class LessonModule {}
