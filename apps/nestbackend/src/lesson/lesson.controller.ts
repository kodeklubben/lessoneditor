import { Controller, Post, Body } from '@nestjs/common';
import {Lesson} from "@lessoneditor/api-interfaces";

@Controller('lesson')
export class LessonController {

    @Post()
    async addLesson(@Body() lesson: Lesson) {
        //const data = await createLessonData(lesson, username);;
        //return course;
    }



}
