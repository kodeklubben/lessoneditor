import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";
import paths from "../paths.json";

export const LessonContext = React.createContext({});

export const LessonContextProvider = (props) => {
  const { lessonId } = useParams();
  const [data, setData] = useState({});
  const [ymlData, setYmlData] = useState({
    level: 1,
    license: "CC BY-SA 4.0",
    tags: { topic: [], subject: [], grade: [] },
  });
  const [headerData, setHeaderData] = useState({});
  const [language, setLanguage] = useState("nb");
  const [lessonList, setLessonList] = useState({});

  const lessonListUrl = resolveUrlTemplate(paths.LESSON_FILES, { lessonId });
  const lessonDataUrl = resolveUrlTemplate(paths.LESSON_DATA, {
    lessonId,
    filename: "data.json",
  });

  const lessonYMLDataUrl = resolveUrlTemplate(paths.LESSON_DATA, {
    lessonId,
    filename: "lesson.yml",
  });

  useEffect(() => {
    async function fetchLessonData() {
      return await axios.get(lessonDataUrl);
    }
    if (lessonId) {
      fetchLessonData().then((res) => setData(res.data));
    }
  }, [lessonId, lessonDataUrl]);

  useEffect(() => {
    async function fetchYMLData() {
      return axios.get(lessonYMLDataUrl).then((res) => {
        return res.data;
      });
    }
    if (lessonId) {
      fetchYMLData().then((res) =>
        setYmlData((prevState) => ({
          ...prevState,
          ...res,
        }))
      );
    }
  }, [lessonId, lessonYMLDataUrl]);

  useEffect(() => {
    async function fetchFileList() {
      axios.get(lessonListUrl).then((res) => {
        setLessonList(res.data);
      });
    }
    if (lessonId) fetchFileList();
  }, [lessonId, lessonListUrl]);

  const context = {
    data,
    setData,
    ymlData,
    setYmlData,
    headerData,
    setHeaderData,
    language,
    setLanguage,
    lessonList,

    fetchList: async () => {
      await axios.get(lessonListUrl).then((res) => {
        setLessonList(res.data);
      });
    },

    saveLesson: async (data) => {
      if (lessonId) {
        axios.post(lessonDataUrl, await data);
        setData(await data);
      }
    },
    saveYml: async (ymlData) => {
      if (lessonId) {
        axios.post(lessonYMLDataUrl, await ymlData);
      }
    },
    getLessonData: async () => {
      return await axios.get(lessonDataUrl);
    },
    getHeaderData: async () => {
      return await headerData;
    },
    getYmlData: async () => {
      async function fetchData() {
        return await axios.get(lessonYMLDataUrl).then((res) => {
          if (JSON.stringify(res.data) === "{}") {
            return ymlData;
          } else {
            return res.data;
          }
        });
      }

      const res = fetchData().then((res) => {
        return res;
      });

      return res;
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
