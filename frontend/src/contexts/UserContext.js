import React, { useEffect, useState } from "react";
import axios from "axios";
import paths from "../paths.json";
import createLesson from "../api/create-lesson";

export const UserContext = React.createContext({});

export const UserContextProvider = (props) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [lessons, setLessons] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const userRes = await axios.get(paths.USER);
      const userLessonsRes = await axios.get(paths.USER_LESSONS);
      setUser({ ...userRes.data });
      setLessons(userLessonsRes.data);
    }
    fetchData();
  }, []);

  const getLesson = (lessonId) => {
    return lessons.find((item) => item.lessonId === lessonId);
  };

  const getLessonByCourseAndLesson = (course, lesson) => {
    return lessons.find(
      (item) => item.course === course && item.lesson === lesson
    );
  };

  const saveLessons = async (updatedLessons) => {
    await axios.post(paths.USER_LESSONS, updatedLessons);
    setLessons(updatedLessons);
  };
  const context = {
    user,
    lessons,
    getLesson,
    addLesson: async (course, lesson) => {
      let lessonId;
      const existing = getLessonByCourseAndLesson(course, lesson);
      if (existing) {
        // existing.title = title;
        lessonId = existing.lessonId;
      } else {
        // lessonId = await createLesson({ course, lesson, title });
        lessonId = await createLesson({ course, lesson });
        // lessons.push({ lessonId, course, lesson, title });
        lessons.push({ lessonId, course, lesson });
      }
      await saveLessons(lessons);
      return lessonId;
    },
    removeLesson: async (lessonId) => {
      const existing = getLesson(lessonId);
      if (existing) {
        await saveLessons(lessons.filter((l) => l.lessonId !== lessonId));
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
