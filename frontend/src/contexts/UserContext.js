import React, { useEffect, useState } from "react";
import axios from "axios";
import paths from "../paths.json";
import resolveUrlTemplate from "../utils/resolve-url-template";
import createLesson from "../api/create-lesson";

export const UserContext = React.createContext({});

export const UserContextProvider = (props) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
    lessons: [],
  });

  useEffect(() => {
    async function fetchData() {
      const userRes = await axios.get(paths.USER);
      const userLessonsRes = await axios.get(paths.USER_LESSONS);
      setUser({
        ...userRes.data,
        lessons: userLessonsRes.data,
      });
    }

    fetchData();
  }, []);

  const getLesson = (lessonId) => {
    return user.lessons.find((item) => item.lessonId === lessonId);
  };

  const getLessonByCourseAndLesson = (course, lesson) => {
    return user.lessons.find(
      (item) => item.course === course && item.lesson === lesson
    );
  };

  const listLesson = async (lessonId) => {
    const url = resolveUrlTemplate(paths.LESSON_FILES, { lessonId });
    return await axios.get(url);
  };

  const saveLesson = async () => {
    await axios.post(paths.USER_LESSONS, user.lessons);
    setUser(user);
  };
  const context = {
    user,
    getLesson,
    addLesson: async (course, lesson, title) => {
      let lessonId;
      const existing = getLessonByCourseAndLesson(course, lesson);
      if (existing) {
        existing.title = title;
        lessonId = existing.lessonId;
      } else {
        lessonId = await createLesson();
        user.lessons.push({ lessonId, course, lesson, title });
      }
      await saveLesson();
      return lessonId;
    },
    listLesson,
    removeLesson: async (lessonId) => {
      const existing = getLesson(lessonId);
      if (existing) {
        user.lessons = user.lessons.filter(
          (item) => item.lessonId !== lessonId
        );
        await saveLesson();
      } else {
        console.error(
          "Trying to remove a lesson that doesn't exists",
          lessonId
        );
      }
    },
  };
  return (
    <>
      <UserContext.Provider value={context}>
        {props.children}
      </UserContext.Provider>
    </>
  );
};
