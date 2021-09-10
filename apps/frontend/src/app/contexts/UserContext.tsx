import React, { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Lesson, paths, User } from "@lessoneditor/api-interfaces";
import { UserDTO } from "@lessoneditor/user"
import { LessonDTO } from "@lessoneditor/lesson"

import createLesson from "../api/create-lesson";
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

  const saveLessons = async (updatedLessons: LessonDTO[]) => {
    await axios.post(paths.USER_LESSONS, updatedLessons);
    setLessons(updatedLessons);
  };

  const addLesson = async (courseSlug: string, courseTitle: string, lessonSlug: string, lessonTitle?: string): Promise<number> => {
    let lessonId: number;
    const existing = getLessonByCourseAndLesson(courseSlug, lessonSlug);
    if (existing) {
      lessonId = existing.lessonId;
    } else {
      lessonId = await createLesson({
        courseSlug,
        courseTitle,
        lessonSlug,
        lessonTitle,
      });

      lessons.push({ lessonId, courseSlug, courseTitle, lessonSlug, lessonTitle });
    }
    await saveLessons(lessons);
    return lessonId;
  }

  const removeLesson = async (lessonId: string) => {
    const existing = getLesson(lessonId);
    if (existing) {
      await saveLessons(lessons.filter((lesson: LessonDTO) => lesson.lessonId !== lessonId));
    } else {
      console.error("Trying to remove a lesson that doesn't exists.", lessonId);
    }
  }

  const getUserData = async (): Promise<AxiosResponse<User>> => {
    async function fetchData() {
      return await axios.get<User>(paths.USER);
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
