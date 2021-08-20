import { Lesson, User, Course } from "@lessoneditor/api-interfaces";
import { AxiosResponse } from "axios";
import React from "react";

export interface UserContextModel
{
    user: User
    lessons: Lesson[],
    setUser: React.Dispatch<React.SetStateAction<User>>
    setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>
    getLesson: (lessonId: string) => Lesson | undefined
    addLesson: (course: Course, courseTitle: string, lesson: string, lessonTitle?: string) => Promise<string>
    removeLesson: (lessonId: string) => void
    getUserData: () => Promise<AxiosResponse<User>>


    
}