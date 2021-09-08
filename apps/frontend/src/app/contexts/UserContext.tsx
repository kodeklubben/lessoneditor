import React, { useContext, useEffect, useState, FC } from "react";
import axios from "axios";
import { paths } from "@lessoneditor/api-interfaces";
import createLesson from "../api/create-lesson";

interface User {
  email: string;
  name: string;
  username: string;
  photo: string;
}

interface Lesson {
  course: string;
  courseTitle: string;
  lesson: string;
  lessonId: string;
  lessonTitle: string;
  thumb?: string;
}

interface UserContextProps {
  user: User;
  lessons: Lesson[];
  addLesson: (
    course: string,
    courseTitle: string,
    lesson: string,
    lessonTitle: string
  ) => Promise<string>;
  removeLesson: (lessonId: string) => Promise<void>;
}

export const UserContext = React.createContext<UserContextProps>({
  user: { email: "", name: "", username: "", photo: "" },
  lessons: [],
  addLesson: async () => {
    return "";
  },
  removeLesson: async () => {
    return;
  },
});

export const UserContextProvider: FC = (props) => {
  const [user, setUser] = useState<User>({
    email: "",
    name: "",
    username: "",
    photo: "",
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      const userRes = await axios.get(paths.USER);
      const userLessonsRes = await axios.get(paths.USER_LESSONS);
      if (isSubscribed) {
        setUser({ ...userRes.data });
        setLessons(userLessonsRes.data);
      }
    }
    fetchData();
    return () => {
      isSubscribed = false;
    };
  }, []);

  const getLesson = (lessonId: string) => {
    const lesson = lessons.find((item: Lesson) => item.lessonId === lessonId);
    return lesson;
  };

  const addLesson = async (
    course: string,
    courseTitle: string,
    lesson: string,
    lessonTitle: string
  ) => {
    const existing = getLessonByCourseAndLesson(course, lesson);
    const lessonId: string = existing
      ? existing.lessonId
      : await createLesson({
          course,
          courseTitle,
          lesson,
          lessonTitle,
        });
    setLessons((oldLessons) => [
      ...oldLessons,
      { course, courseTitle, lesson, lessonId, lessonTitle },
    ]);
    await saveLessons([...lessons, { course, courseTitle, lesson, lessonId, lessonTitle }]);
    return lessonId;
  };

  const removeLesson = async (lessonId: string) => {
    const existing = getLesson(lessonId);
    if (existing) {
      await saveLessons(lessons.filter((lesson: Lesson) => lesson.lessonId !== lessonId));
    } else {
      console.error("Trying to remove a lesson that doesn't exists.", lessonId);
    }
  };

  const getLessonByCourseAndLesson = (course: string, lesson: string) => {
    return lessons.find((item: Lesson) => item.course === course && item.lesson === lesson);
  };

  const saveLessons = async (updatedLessons: Lesson[]) => {
    await axios.post(paths.USER_LESSONS, updatedLessons);
    setLessons(updatedLessons);
  };
  const context: UserContextProps = {
    user,
    lessons,
    addLesson,
    removeLesson,
  };
  return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
};
export const useUserContext = () => useContext(UserContext);
