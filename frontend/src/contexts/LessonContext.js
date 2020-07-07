import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";
import paths from "../paths.json";

export const LessonContext = React.createContext({});

export const LessonContextProvider = (props) => {
  const { course, lesson } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    async function fetchData() {
      const url = resolveUrlTemplate(paths.LESSON_DATA, {
        course,
        lesson,
      });
      const res = await axios.get(url);
      setData(res.data);
    }

    if (course && lesson) fetchData();
  }, [course, lesson]);
  const context = {
    data,
    saveLesson: async (data) => {
      if (course && lesson) {
        const url = resolveUrlTemplate(paths.LESSON_DATA, {
          course,
          lesson,
        });
        await axios.post(url, data);
        setData(data);
      }
    },
  };
  return (
    <>
      <LessonContext.Provider value={context}>
        {props.children}
      </LessonContext.Provider>
    </>
  );
};
