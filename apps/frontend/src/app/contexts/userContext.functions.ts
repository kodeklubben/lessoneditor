import { UserDTO } from "../../../../../libs/contracts/src/index";
import { LessonDTO } from "../../../../../libs/contracts/src/index";

export interface UserContextState {
  user: UserDTO | undefined;
  lessons: LessonDTO[];
  loggedIn: boolean;
}

export interface UserContextModel {
  state: UserContextState;
  addLesson: (
    course: string,
    courseTitle: string,
    lesson: string,
    lessonTitle: string,
    language: string
  ) => Promise<number | undefined>;
  removeLesson: (lessonId: number) => void;
}

export const initialUserContextState: UserContextState = {
  user: undefined,
  lessons: [],
  loggedIn: false,
};
