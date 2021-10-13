export interface Message {
  message: string;
}

export const paths = {
  "AUTH_CALLBACK": "/callback",
  "AUTH_LOGIN_FAILED": "/login-failed",
  "DISPLAY_FILE": "/api/display/:lessonId/:file",
  "FILE": "/file/*",
  "LESSON": "/api/lesson/:lessonId",
  "LESSON_FILENAMES": "/api/lesson/:lessonId/fileNames",
  "LESSON_DATA": "/api/lesson/:lessonId/data/:filename",
  "LESSON_FILES": "/api/lesson/:lessonId/files",
  "LESSON_FILE": "api/lesson/:lessonId/files/:fileName",
  "LESSON_FILE_UPDATE": "/api/lesson/:lessonId/files/:fileName",
  "LESSON_PROXY": "/api/lessons-proxy/*",
  "LESSON_SUBMIT": "/api/lesson/:lessonId/submit",
  "LESSON_THUMB": "/api/lesson-thumb/:lessonId/:file",
  "LESSON_UPLOADS": "/api/lesson/:lessonId/upload",
  "USER_LESSON_UPDATE": "/api/user/:userId/lesson/:lessonId",
  "USER_LESSON_NEW": "/api/user/:userId/lesson",
  "USER": "/api/user",
  "USER_LESSONS": "/api/user/:userId/lessons"
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
