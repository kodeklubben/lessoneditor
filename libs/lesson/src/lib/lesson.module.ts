import { Module, forwardRef } from "@nestjs/common";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import {Lesson} from "./lesson.entity"
import { UserModule } from "../../../user/src/lib/user.module"

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), forwardRef(() => UserModule)],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService, TypeOrmModule],
})
export class LessonModule {}
