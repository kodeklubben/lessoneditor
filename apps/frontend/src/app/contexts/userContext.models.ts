import { AxiosResponse } from "axios";
import { UserDTO } from "../../../../../libs/user/src/lib/user.dto"
import { LessonDTO } from "../../../../../libs/lesson/src/lib/lesson.dto"
import React from "react";

export interface UserContextModel
{
    user: UserDTO
    lessons: LessonDTO[],
    setUser: React.Dispatch<React.SetStateAction<UserDTO>>
    setLessons: React.Dispatch<React.SetStateAction<LessonDTO[]>>
    getLesson: (lessonId: number) => LessonDTO | undefined
    addLesson: (course: string, courseTitle: string, lesson: string, lessonTitle: string) => Promise<number>
    removeLesson: (lessonId: number) => void
    getUserData: () => Promise<AxiosResponse<UserDTO>>


    
}