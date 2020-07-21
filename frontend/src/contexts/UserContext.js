import React, { useEffect, useState } from "react";
import axios from "axios";
import paths from "../paths.json";

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
  const getLesson = (course, lesson) => {
    return user.lessons.find(
      (item) => item.course === course && item.lesson === lesson
    );
  };
  const saveLesson = async () => {
    await axios.post(paths.USER_LESSONS, user.lessons);
    setUser(user);
  };
  const context = {
    user,
    getLesson,
    addLesson: async (course, lesson, title) => {
      const existing = getLesson(course, lesson);
      if (existing) {
        existing.title = title;
      } else {
        user.lessons.push({ course, lesson, title });
      }
      await saveLesson();
    },
    removeLesson: async (course, lesson) => {
      const existing = getLesson(course, lesson);
      if (existing) {
        user.lessons = user.lessons.filter(
          (item) => item.course !== course && item.lesson !== lesson
        );
        saveLesson();
      } else {
        console.error(
          "Trying to remove a lesson that doesn't exists",
          course,
          lesson
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
