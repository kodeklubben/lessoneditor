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
      axios.get(lessonDataUrl).then((res) => {
        setData(res.data);
      });
    }
    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId, lessonDataUrl]);

  useEffect(() => {
    async function fetchYMLData() {
      axios.get(lessonYMLDataUrl).then((res) => {
        setYmlData((prevState) => ({
          ...prevState,
          ...res.data,
        }));
      });
    }
    if (lessonId) {
      fetchYMLData();
    }
  }, [lessonId, lessonYMLDataUrl]);

  useEffect(() => {
    async function fetchFileList() {
      const res = await axios.get(lessonListUrl);
      setLessonList(res.data);
    }
    if (lessonId) {
      fetchFileList();
    }
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
      const res = await axios.get(lessonListUrl);
      setLessonList(res.data);
    },

    saveLesson: async (data) => {
      if (lessonId) {
        await axios.post(lessonDataUrl, data);
        setData(data);
      }
    },
    saveYml: async (ymlData) => {
      if (lessonId) {
        await axios.post(lessonYMLDataUrl, ymlData);
      }
    },
    getLessonData: async () => {
      async function fetchData() {
        const res = await axios.get(lessonDataUrl);
        if (JSON.stringify(res.data) === "{}") {
          return ymlData;
        } else {
          return res.data;
        }
      }
      const res = await fetchData();
      return res;
    },
    getHeaderData: () => {
      return headerData;
    },
    getYmlData: async () => {
      async function fetchData() {
        if (
          JSON.stringify(ymlData.tags) ===
          "{ topic: [], subject: [], grade: [] }"
        ) {
          const res = await axios.get(lessonYMLDataUrl);
          return res.data;
        } else {
          return ymlData;
        }
      }

      const res = await fetchData();

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
