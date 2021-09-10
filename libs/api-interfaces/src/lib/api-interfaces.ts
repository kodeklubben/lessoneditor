export interface Message {
  message: string;
}

export const paths = {
  "AUTH_CALLBACK": "/callback",
  "AUTH_LOGIN_FAILED": "/login-failed",
  "DISPLAY_FILE": "/api/display/:lessonId/:file",
  "FILE": "/file/*",
  "LESSON": "/api/lesson",
  "LESSON_DATA": "/api/lesson/:lessonId/data/:filename",
  "LESSON_FILES": "/api/lesson/:lessonId/files",
  "LESSON_PROXY": "/api/lessons-proxy/*",
  "LESSON_SUBMIT": "/api/lesson/:lessonId/submit",
  "LESSON_THUMB": "/api/lesson-thumb/:lessonId/:file",
  "LESSON_UPLOADS": "/api/lesson/:lessonId/upload",
  "USER": "/api/user",
  "USER_LESSONS": "/api/user/lessons"
}

export interface Lesson
{
  lessonId: string
  course: string
  courseTitle: string
  lesson: string
  lessonTitle?: string
  created?: string
  updated?: string
  createdBy?: string
}

export interface User
{
  authenticated: boolean
  name: string
  email: string
  username: string
  photo: string

}
