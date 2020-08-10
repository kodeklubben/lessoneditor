import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";
import paths from "../paths.json";

export const LessonContext = React.createContext({});

export const LessonContextProvider = (props) => {
  const { lessonId } = useParams();
  const [data, setData] = useState({});
  const lessonDataUrl = resolveUrlTemplate(paths.LESSON_DATA, { lessonId });
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(lessonDataUrl);
      setData(res.data);
    }

    if (lessonId) fetchData();
  }, [lessonId, lessonDataUrl]);
  const context = {
    data,
    saveLesson: async (data) => {
      if (lessonId) {
        await axios.post(lessonDataUrl, data);
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
