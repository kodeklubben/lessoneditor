import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";
import paths from "../paths.json";

export const LessonContext = React.createContext({});

export const LessonContextProvider = (props) => {
  const { lessonId } = useParams();
  const [data, setData] = useState({});
  const [ymlData, setYmlData] = useState({});
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
    async function fetchData() {
      const res = await axios.get(lessonDataUrl);
      return res;
    }
    if (lessonId) {
      fetchData().then((res) => setData(res.data));
    }
  }, [lessonId, lessonDataUrl]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(lessonYMLDataUrl);
      return res;
    }
    if (lessonId) {
      fetchData().then((res) => console.log(res));
    }
  }, [lessonId, lessonYMLDataUrl]);

  useEffect(() => {
    async function fetchList() {
      const res = await axios.get(lessonListUrl);
      setLessonList(res.data);
    }
    if (lessonId) fetchList();
  }, [lessonId, lessonListUrl]);

  const context = {
    data,
    ymlData,
    setData,
    headerData,
    setHeaderData,
    language,
    setLanguage,

    fetchList: async () => {
      const res = await axios.get(lessonListUrl);
      setLessonList(res.data);
    },
    lessonList,
    saveLesson: async (data) => {
      if (lessonId) {
        await axios.post(lessonDataUrl, data);
        setData(data);
      }
    },
    saveYml: async (innhold) => {
      if (lessonId) {
        await axios.post(lessonYMLDataUrl, innhold);
        setYmlData(innhold);
      }
    },
    getLessonData: async () => {
      async function fetchData() {
        const res = await axios.get(lessonDataUrl);
        return res;
      }
      if (lessonId) {
        fetchData().then((res) => setData(res.data));
      }
      return "lesson data is loaded";
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
