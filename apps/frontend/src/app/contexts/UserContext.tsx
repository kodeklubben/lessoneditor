import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { paths } from "@lessoneditor/api-interfaces";
import createLesson from "../api/create-lesson";

export const UserContext = React.createContext({});

export const UserContextProvider = (props: any) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [lessons, setLessons] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      const userRes = await axios.get(paths.USER);
      const userLessonsRes = await axios.get(paths.USER_LESSONS);
      setUser({ ...userRes.data });
      setLessons(userLessonsRes.data);
    }

    fetchData();
  }, []);

  const getLesson = (lessonId: string) => {
    return lessons.find((item: any) => item.lessonId === lessonId);
  };

  const getLessonByCourseAndLesson = (course: string, lesson: string) => {
    return lessons.find((item: any) => item.course === course && item.lesson === lesson);
  };

  const saveLessons = async (updatedLessons: any) => {
    await axios.post(paths.USER_LESSONS, updatedLessons);
    setLessons(updatedLessons);
  };
  const context = {
    user,
    setUser,
    lessons,
    setLessons,
    getLesson,
    addLesson: async (course: string, courseTitle: string, lesson: string, lessonTitle: string) => {
      let lessonId;
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
    },
    removeLesson: async (lessonId: string) => {
      const existing = getLesson(lessonId);
      if (existing) {
        await saveLessons(lessons.filter((lesson: any) => lesson.lessonId !== lessonId));
      } else {
        console.error("Trying to remove a lesson that doesn't exists.", lessonId);
      }
    },
    getUserData: async () => {
      async function fetchData() {
        return await axios.get(paths.USER);
      }

      return await fetchData();
    },
  };
  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
};
export const useUserContext = (): Partial<any> => useContext(UserContext);
