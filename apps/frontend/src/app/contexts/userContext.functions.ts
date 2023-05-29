import { LessonDTO, UserDTO } from "@lessoneditor/contracts";

export interface UserContextState {
  user: UserDTO | undefined;
  lessons: LessonDTO[];
  loggedIn: boolean;
}

export interface UserContextModel {
  state: UserContextState;
  logoutUser: () => void;
  addLesson: (
    course: string,
    courseTitle: string,
    lesson: string,
    lessonTitle: string,
    language: string
  ) => Promise<number | undefined>;
  removeLesson: (lessonId: number) => void;
  previewImage: any;
  loading: boolean;
}

export const initialUserContextState: UserContextState = {
  user: undefined,
  lessons: [],
  loggedIn: false,
};
