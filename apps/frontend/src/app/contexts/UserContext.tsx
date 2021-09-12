import React, { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Lesson, paths, User } from "@lessoneditor/api-interfaces";
import { UserDTO } from "@lessoneditor/user"
import { LessonDTO, NewLessonDTO } from "@lessoneditor/lesson"

import createLesson from "../api/create-lesson";
import deleteLesson from "../api/delete-lesson";
import { UserContextModel } from "./userContext.models";

export const UserContext = React.createContext({});

export const UserContextProvider = (props: any) => {
  const [user, setUser] = useState<UserDTO>({
    userId: 1234,
    name: "",
    email: "",
    username: ""
  });
  const [lessons, setLessons] = useState<LessonDTO[]>([]);
  useEffect(() => {
    async function fetchData() {
      const userRes = await axios.get<UserDTO>(paths.USER);
      const userLessonsRes = await axios.get<LessonDTO[]>(paths.USER_LESSONS);
      setUser({ ...userRes.data });
      setLessons(userLessonsRes.data);
    }

    fetchData().then();
  }, []);

  const getLesson = (lessonId: number): LessonDTO | undefined => {
    return lessons.find((item: LessonDTO) => item.lessonId === lessonId);
  };

  const getLessonByCourseAndLesson = (courseSlug: string, lessonSlug: string): LessonDTO | undefined  => {
    return lessons.find((item: LessonDTO) => item.courseSlug === courseSlug && item.lessonSlug === lessonSlug);
  };

  const addLesson = async (courseSlug: string, courseTitle: string, lessonSlug: string, lessonTitle: string): Promise<number> => {
    let lessonId: number;
    const existing = getLessonByCourseAndLesson(courseSlug, lessonSlug);
    if (existing) {
      return existing.lessonId;
    } else {
      const newLesson: NewLessonDTO = {
        courseSlug: courseSlug,
        courseTitle: courseTitle,
        lessonSlug: lessonSlug,
        lessonTitle: lessonTitle
      }
      lessonId = await createLesson(user.userId, newLesson);
      const userLessonsRes = await axios.get<LessonDTO[]>(paths.USER_LESSONS);
      setLessons(userLessonsRes.data);
      return lessonId

    }
  }

  const removeLesson = async (lessonId: number) => {
    const existing = getLesson(lessonId);
    if (existing) {
      await deleteLesson(user.userId, lessonId);
      const userLessonsRes = await axios.get<LessonDTO[]>(paths.USER_LESSONS);
      setLessons(userLessonsRes.data);
    } else {
      console.error("Trying to remove a lesson that doesn't exists.", lessonId);
    }
  }

  const getUserData = async (): Promise<AxiosResponse<UserDTO>> => {
    async function fetchData() {
      return await axios.get<UserDTO>(paths.USER);
    }
    return await fetchData();
  }

  const context: UserContextModel = {
    user,
    setUser,
    lessons,
    setLessons,
    getLesson,
    addLesson,
    removeLesson,
    getUserData
  };
  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
};
export const useUserContext = (): Partial<any> => useContext(UserContext);
