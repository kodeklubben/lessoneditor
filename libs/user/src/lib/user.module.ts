import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./user.entity"
import {LessonModule} from "../../../lesson/src/lib/lesson.module"
import {ThumbModule} from "../../../thumb/src/lib/thumb.module"

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => LessonModule), ThumbModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
