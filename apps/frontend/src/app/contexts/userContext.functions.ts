import {UserDTO} from "../../../../../libs/user/src/lib/user.dto"
import {LessonDTO} from "../../../../../libs/lesson/src/lib/lesson.dto"

export interface UserContextState
{
    user: UserDTO | undefined,
    lessons: LessonDTO[] 
    loggedIn: boolean

}

export interface UserContextModel
{
    state: UserContextState,
    addLesson: (course: string, courseTitle: string, lesson: string, lessonTitle: string) => Promise<number | undefined>
    removeLesson: (lessonId: number) => void

}

export const initialUserContextState: UserContextState = {
    user: undefined,
    lessons: [],
    loggedIn: false

}