import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";
import paths from "../paths.json";

export const LessonContext = React.createContext({});
const resolveLessonUrls = (lessonId) => {
  return {
    files: resolveUrlTemplate(paths.LESSON_FILES, { lessonId }),
    data: resolveUrlTemplate(paths.LESSON_DATA, {
      lessonId,
      filename: "data.json",
    }),
    ymlData: resolveUrlTemplate(paths.LESSON_DATA, {
      lessonId,
      filename: "lesson.yml",
    }),
  };
};
export const LessonContextProvider = (props) => {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState({
    files: {},
    yml: {
      level: 1,
      license: "CC BY-SA 4.0",
      tags: { topic: [], subject: [], grade: [] },
    },
  });

  useEffect(() => {
    async function fetchLessonData() {
      const lessonUrls = resolveLessonUrls(lessonId);
      const lessonDataRes = await axios.get(lessonUrls.data);
      const lessonListRes = await axios.get(lessonUrls.files);
      const lessonYMLDataRes = await axios.get(lessonUrls.ymlData);
      const rootDataObj = lessonDataRes.data;
      rootDataObj.files = lessonListRes.data;
      rootDataObj.yml = lessonYMLDataRes.data;
      setLessonData(rootDataObj);
    }
    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);
  const lessonUrls = resolveLessonUrls(lessonId);
  const context = {
    lessonData,
    setLessonData,
    ymlData: lessonData.yml,
    lessonList: lessonData.files,
    fetchList: () => lessonData.files,
    saveLesson: async (data) => {
      if (lessonId) {
        await axios.post(lessonUrls.data, data);
        data.files = lessonData.files;
        data.yml = lessonData.yml;
        setLessonData(data);
      } else {
        console.error("No lessonId set in context aborting");
      }
    },
    saveYml: async (data) => {
      if (lessonId) {
        await axios.post(lessonUrls.ymlData, data);
        lessonData.yml = data;
      } else {
        console.error("No lessonId set in context aborting");
      }
    },
    getLessonData: () => lessonData,
    getYmlData: () => lessonData.yml,
  };
  return (
    <>
      <LessonContext.Provider value={context}>
        {props.children}
      </LessonContext.Provider>
    </>
  );
};
