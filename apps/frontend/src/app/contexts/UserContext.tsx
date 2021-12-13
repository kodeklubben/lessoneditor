import React, { useContext, useEffect, useState, FC } from "react";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { LessonDTO, NewLessonDTO } from "@lessoneditor/contracts";
import { UserDTO } from "@lessoneditor/contracts";

import {
  initialUserContextState,
  UserContextModel,
  UserContextState,
} from "./userContext.functions";
import NotLoggedInPage from "../pages/NotLoggedInPage";

export const UserContext = React.createContext({} as UserContextModel);

export const UserContextProvider = (props: any) => {
  const [userContexState, setUserContextState] =
    useState<UserContextState>(initialUserContextState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const userRes = await axios.get<UserDTO>(paths.USER);
        const userLessonsRes = await axios.get<LessonDTO[]>(
          paths.USER_LESSONS.replace(":userId", userRes.data.userId.toString())
        );

        setUserContextState((s) => {
          return {
            ...s,
            user: userRes.data,
            lessons: userLessonsRes.data,
          };
        });
        setUserContextState((s) => ({ ...s, loggedIn: true }));
        setLoading(false);
      } catch (error: any) {
        console.log("error");
        window.location.href = "/api/auth/login/";
      }
    }
    fetchData();
  }, []);

  const getLesson = (lessonId: number): LessonDTO | undefined => {
    return userContexState.lessons?.find((item: LessonDTO) => item.lessonId === lessonId);
  };

  const getLessonByCourseAndLesson = (
    courseSlug: string,
    lessonSlug: string
  ): LessonDTO | undefined => {
    return userContexState.lessons?.find(
      (item: LessonDTO) => item.courseSlug === courseSlug && item.lessonSlug === lessonSlug
    );
  };

  const addLesson = async (
    courseSlug: string,
    courseTitle: string,
    lessonSlug: string,
    lessonTitle: string,
    language: string
  ): Promise<number | undefined> => {
    try {
      const newLesson: NewLessonDTO = {
        courseSlug: courseSlug,
        courseTitle: courseTitle,
        lessonSlug: lessonSlug,
        lessonTitle: lessonTitle,
        language: language,
      };
      const newLessonRes = await axios.post<number>(
        paths.USER_LESSON_NEW.replace(":userId", userContexState.user!.userId.toString()),
        newLesson
      );
      const userLessonsRes = await axios.get<LessonDTO[]>(
        paths.USER_LESSONS.replace(":userId", userContexState.user!.userId.toString())
      );

      setUserContextState((s) => {
        return {
          ...s,
          lessons: userLessonsRes.data,
        };
      });

      return newLessonRes.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const removeLesson = async (lessonId: number) => {
    const existing = getLesson(lessonId);
    if (existing) {
      try {
        await axios.delete(
          paths.USER_LESSON_UPDATE.replace(
            ":userId",
            userContexState.user!.userId.toString()
          ).replace(":lessonId", lessonId.toString())
        );
        const userLessonsRes = await axios.get<LessonDTO[]>(
          paths.USER_LESSONS.replace(":userId", userContexState.user!.userId.toString())
        );
        setUserContextState((s) => {
          return {
            ...s,
            lessons: userLessonsRes.data,
          };
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const context: UserContextModel = {
    state: userContexState,
    addLesson: addLesson,
    removeLesson: removeLesson,
    loading,
  };

  if (userContexState.loggedIn) {
    return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
  } else {
    return <NotLoggedInPage></NotLoggedInPage>;
  }
};
export const useUserContext = (): UserContextModel => useContext<UserContextModel>(UserContext);
