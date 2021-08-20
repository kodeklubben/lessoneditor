import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Course, Lesson, paths, User } from "@lessoneditor/api-interfaces";
import createLesson from "../api/create-lesson";
import { UserContextModel } from "./userContext.models";

export const UserContext = React.createContext({});

export const UserContextProvider = (props: any) => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    photo: "",
    username: "",
    authenticated: false
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  useEffect(() => {
    async function fetchData() {
      const userRes = await axios.get<User>(paths.USER);
      const userLessonsRes = await axios.get<Lesson[]>(paths.USER_LESSONS);
      setUser({ ...userRes.data });
      setLessons(userLessonsRes.data);
    }

    fetchData().then();
  }, []);

  const getLesson = (lessonId: string): Lesson | undefined => {
    return lessons.find((item: Lesson) => item.lessonId === lessonId);
  };

  const getLessonByCourseAndLesson = (course: Course, lesson: string): Lesson | undefined  => {
    return lessons.find((item: Lesson) => item.course === course && item.lesson === lesson);
  };

  const saveLessons = async (updatedLessons: Lesson[]) => {
    await axios.post(paths.USER_LESSONS, updatedLessons);
    setLessons(updatedLessons);
  };

  const addLesson = async (course: Course, courseTitle: string, lesson: string, lessonTitle?: string): string => {
    let lessonId: string;
    const existing = getLessonByCourseAndLesson(course, lesson);
    if (existing) {
      lessonId = existing.lessonId;
    } else {
      lessonId = await createLesson({
        course,
        courseTitle,
        lesson,
        lessonTitle,
      });

      lessons.push({ lessonId, course, courseTitle, lesson, lessonTitle });
    }
    await saveLessons(lessons);
    return lessonId;
  }

  const removeLesson = async (lessonId: string) => {
    const existing = getLesson(lessonId);
    if (existing) {
      await saveLessons(lessons.filter((lesson: Lesson) => lesson.lessonId !== lessonId));
    } else {
      console.error("Trying to remove a lesson that doesn't exists.", lessonId);
    }
  }

  const getUserData = async () => {
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
