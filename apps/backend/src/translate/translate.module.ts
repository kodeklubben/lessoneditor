import { Module } from "@nestjs/common";
import { LessonModule } from "../lesson/lesson.module";
import { TranslateController } from "./translate.controller";
import { TranslateService } from "./translate.service";

@Module({
  imports: [LessonModule],
  controllers: [TranslateController],
  providers: [TranslateService],
})
export class TranslateModule {}
