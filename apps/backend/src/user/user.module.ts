import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { LessonModule } from "../lesson/lesson.module";
import { ThumbModule } from "../thumb/thumb.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => LessonModule), ThumbModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
