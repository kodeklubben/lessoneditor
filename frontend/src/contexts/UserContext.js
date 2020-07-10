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
  const context = {
    user,
    getLesson: (course, lesson) => {
      return user.lessons.find(
        (l) => l.course === course && l.lesson === lesson
      );
    },
    addLesson: async (course, lesson, title) => {
      const existing = user.lessons.find(
        (l) => l.course === course && l.lesson === lesson
      );
      if (existing) {
        existing.title = title;
      } else {
        user.lessons.push({ course, lesson, title });
      }
      await axios.post(paths.USER_LESSONS, user.lessons);
      setUser(user);
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
