import { Module, forwardRef } from "@nestjs/common";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import {Lesson} from "./lesson.entity"
import { UserModule } from "../../../user/src/lib/user.module"
import {GithubModule} from "../../../github/src/lib/github.module"



@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), forwardRef(() => UserModule), GithubModule],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService, TypeOrmModule],
})
export class LessonModule {}
