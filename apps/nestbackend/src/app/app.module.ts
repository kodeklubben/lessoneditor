import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
// import { User, UserModule } from '@lessoneditor/user';
// import { Lesson, LessonModule } from "@lessoneditor/lesson";
import { AuthGuard } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from "../../../../libs/user/src/lib/user.module"
import { LessonModule } from "../../../../libs/lesson/src/lib/lesson.module"
import { SessionModule } from "../../../../libs/session/src/lib/session.module"

@Module({
   imports: [
     TypeOrmModule.forRoot(
    
  ), 
  
UserModule,
LessonModule],
  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard('github2'),
    // }
  ],
})
export class AppModule {}
